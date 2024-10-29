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
import { trophyImage } from "../assets";

import { ProductsCard } from "../components";

const tabs = [
  {
    id: 'all-products',
    content: 'All Products',
    accessibilityLabel: 'All Products',
    panelID: 'all-products-content',
  },
  {
    id: 'stories',
    content: 'Stories',
    panelID: 'stories-content',
  }
];

export default function HomePage() {
  const { t } = useTranslation();

  const [selected, setSelected] = useState(0);

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );
  return (
    <Page narrowWidth>
      <TitleBar title={t("HomePage.title")} />
      <Layout>
        <Layout.Section>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange} fitted>
            {/* <LegacyCard.Section title={tabs[selected].content}> */}
            <AlphaCard>
              <p>Tab {selected} selected</p>
            </AlphaCard>
            {/* </LegacyCard.Section> */}
          </Tabs>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
