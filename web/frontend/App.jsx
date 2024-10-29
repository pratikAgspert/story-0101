import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavMenu } from "@shopify/app-bridge-react";
import Routes from "./Routes";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import "./App.css";

import { PolarisProvider } from "./components";
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
    </PolarisProvider>
  );
}
