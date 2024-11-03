// @ts-check
import { join } from "path";
import { readFileSync } from "fs";
import express from "express";
import serveStatic from "serve-static";
import crypto from "crypto";

import shopify from "./shopify.js";
import productCreator from "./product-creator.js";
import PrivacyWebhookHandlers from "./privacy.js";

const PORT = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  shopify.processWebhooks({ webhookHandlers: PrivacyWebhookHandlers })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/knox-token", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const shopData = await client.query({
    data: `{
      shop {
        name
        email
        myshopifyDomain
        plan {
          displayName
        }
        primaryDomain {
          url
          host
        }
      }
    }`,
  });
  const body = {
    "access_token": res.locals.shopify.session.accessToken,
    "shop": res.locals.shopify.session.shop,
    "shop_id": res.locals.shopify.session.state,
    "email": shopData.body?.data?.shop?.email,
  }
  console.log("body", body, shopData.body?.data?.shop);
  const response = await fetch("https://g9bvvvyptqo7uxa0.agspert-ai.com/shopify/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });


  if (!response.ok) {
    return res.status(response.status).send({ error: "Failed to fetch Knox token" });
  }

  const { token } = await response.json();
  res.status(200).send({ token, shop: res.locals.shopify.session.shop });
});

app.get("/api/products/count", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });
  const accessToken = res.locals.shopify.session.accessToken;


  const shopData = await client.query({
    data: `{
      shop {
        name
        email
        myshopifyDomain
        plan {
          displayName
        }
        primaryDomain {
          url
          host
        }
      }
    }`,
  });

  const countData = await client.request(`
    query shopifyProductCount {
      productsCount {
        count
      }
    }
  `);

  res.status(200).send({ count: countData.data.productsCount.count, shop: shopData?.body });
});

app.get("/api/products", async (_req, res) => {
  const client = new shopify.api.clients.Graphql({
    session: res.locals.shopify.session,
  });

  try {
    const productsData = await client.request(`
      query {
        products(first: 10) {
          edges {
            node {
              id
              title
              description
            }
          }
        }
      }
    `);

    const products = productsData.data.products.edges.map(edge => edge.node);
    res.status(200).send({ products });
  } catch (error) {
    console.log(`Failed to fetch products: ${error.message}`);
    res.status(500).send({ error: error.message });
  }
});

app.post("/api/products", async (_req, res) => {
  let status = 200;
  let error = null;

  try {
    await productCreator(res.locals.shopify.session);
  } catch (e) {
    console.log(`Failed to process products/create: ${e.message}`);
    status = 500;
    error = e.message;
  }
  res.status(status).send({ success: status === 200, error });
});

app.post('/webhooks/app-uninstalled', express.json(), (req, res) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body;

  // Verify the request
  const generatedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(JSON.stringify(body), 'utf8')
    .digest('base64');

  if (generatedHash !== hmac) {
    return res.status(401).send('Unauthorized');
  }

  // Process the webhook data
  const shop = body.myshopify_domain;
  console.log(`App uninstalled from shop: ${shop}`);

  // Perform any cleanup or data storage here

  res.status(200).send('Webhook received');
});

app.post('/webhooks/shop-update', express.json(), (req, res) => {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.body;

  // Verify the request
  const generatedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(JSON.stringify(body), 'utf8')
    .digest('base64');

  if (generatedHash !== hmac) {
    return res.status(401).send('Unauthorized');
  }

  // Extract shop information
  const shopInfo = {
    shopDomain: body.domain,
    shopName: body.name,
    shopEmail: body.email,
    accessToken: req.headers['x-shopify-access-token'], // Assuming you have access to the token
  };

  console.log('shopInfo', shopInfo);
  // Send shopInfo to your external system to create a user account
  createUserInExternalSystem(shopInfo);

  res.status(200).send('Webhook received');
});

// Function to send shop info to your external system
function createUserInExternalSystem(shopInfo) {
  // Implement the logic to create a user in your external system
  console.log('Creating user in external system:', shopInfo);
}

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use("/*", shopify.ensureInstalledOnShop(), async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(
      readFileSync(join(STATIC_PATH, "index.html"))
        .toString()
        .replace("%VITE_SHOPIFY_API_KEY%", process.env.SHOPIFY_API_KEY || "")
    );
});

app.listen(PORT);
