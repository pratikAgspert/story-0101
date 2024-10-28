import React from "react";
import { Text } from "@chakra-ui/react";
import ProductStoryBuilder from "../components/ProductStoryBuilder/ProductStoryBuilder";

const Story = () => {
  return (
    <div>
      <Text>Three Js is working</Text>

      <Text>Chakra Ui is working</Text>

      <ProductStoryBuilder />
    </div>
  );
};

export default Story;
