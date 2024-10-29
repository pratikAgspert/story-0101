import { Card, Page, Layout, TextContainer, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";
import { ProductsCard } from "../components";

export default function PageName() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title={t("Stories.title")}>
        <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("Stories.primaryAction")}
        </button>
        <button onClick={() => console.log("Secondary action")}>
          {t("Stories.secondaryAction")}
        </button>
      </TitleBar>
      <Layout>
        <Layout.Section>
          <ProductsCard />
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              {t("Stories.heading")}
            </Text>
            <TextContainer>
              <p>{t("Stories.body")}</p>
            </TextContainer>
          </Card>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              {t("Stories.heading")}
            </Text>
            <TextContainer>
              <p>{t("Stories.body")}</p>
            </TextContainer>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
              {t("Stories.heading")}
            </Text>
            <TextContainer>
              <p>{t("Stories.body")}</p>
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
