import {
  Card,
  Page,
  Layout,
  TextContainer,
  Image,
  Stack,
  AlphaCard,
  Link,
  Tabs,
  LegacyCard,
  Text,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation, Trans } from "react-i18next";
import { useState, useCallback } from "react";
import { AnalyticsHomePage } from "../components";
import { trophyImage } from "../assets";

import { ProductsCard } from "../components";
import HomePage2 from "../components/HomePage2/HomePage2";

const tabs = [
  {
    id: "all-products",
    content: "All Products",
    accessibilityLabel: "All Products",
    panelID: "all-products-content",
  },
  {
    id: "stories",
    content: "Stories",
    panelID: "stories-content",
  },
];

export default function HomePage() {
  const { t } = useTranslation();

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );
  return (
    // <AnalyticsHomePage />
    <HomePage2 />
    // <Page narrowWidth>
    //  <TitleBar title={t("HomePage.title")} />
    // <Layout>
    //   <Layout.Section>
    //     <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
    //       <AlphaCard>
    //         <p>Tab {selected} selected</p>
    //       </AlphaCard>
    //     </Tabs>
    //   </Layout.Section>
    // </Layout>
    // </Page>
  );
}
