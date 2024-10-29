import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./App.css";

import { PolarisProvider } from "./components";
import { AuthContext } from "./services/context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export default function App() {
  // Any .tsx or .jsx files in /pages will become a route
  // See documentation for <Routes /> for more info
  const pages = import.meta.glob("./pages/**/!(*.test.[jt]sx)*.([jt]sx)", {
    eager: true,
  });
  const { t } = useTranslation();

  const theme = extendTheme({});

  const queryClient = new QueryClient();

  return (
    <PolarisProvider>
      <AuthContext.Provider value={{ getToken: () => "Token 653d07211e176ab4e4707234a5411cb1a669a85e4d0bc59c3a03d7126b66e0ed" }}>

        <ChakraProvider theme={theme}>
          <QueryClientProvider client={queryClient}>

            <BrowserRouter>
              <NavMenu>
                <a href="/" rel="home" />
                <a href="/stories">{t("NavigationMenu.stories")}</a>
                <a href="/storyBuilder">{t("NavigationMenu.storyBuilder")}</a>
              </NavMenu>
              <Routes pages={pages} />
            </BrowserRouter>
          </QueryClientProvider>
        </ChakraProvider>
      </AuthContext.Provider>
    </PolarisProvider>
  );
}
