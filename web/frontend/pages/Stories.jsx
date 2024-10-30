import React, { useState, useCallback, memo } from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import CarouselComponent from "../components/ProductStoryVisualizer/CarouselComponent";
import { ProductStoryContext } from "../components/ProductStoryBuilder/context";

// Constants
const PRODUCT_NAMES = [
  "product 1",
  "product 2",
  "product 3",
  "product 4",
  "product 5",
];

// Memoized Tag component
const ProductTag = memo(({ tag, onRemove, tagBg, tagColor }) => (
  <Tag
    size="sm"
    borderRadius="full"
    variant="subtle"
    bg={tagBg}
    color={tagColor}
    p={1}
    px={3}
  >
    <TagLabel>{tag}</TagLabel>
    <TagCloseButton onClick={() => onRemove(tag)} />
  </Tag>
));

ProductTag.displayName = "ProductTag";

// Memoized Product Selector component
const ProductSelector = memo(({ unselectedProducts, onSelect, isDisabled }) => (
  <Menu>
    <MenuButton
      as={Button}
      rightIcon={<FaArrowRight />}
      w="full"
      variant="outline"
      textAlign="left"
      isDisabled={isDisabled}
      fontSize="sm"
    >
      {unselectedProducts.length > 0
        ? "Select products..."
        : "No more products available"}
    </MenuButton>
    <MenuList>
      {unselectedProducts.map((name) => (
        <MenuItem key={name} onClick={() => onSelect(name)}>
          {name}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
));

ProductSelector.displayName = "ProductSelector";

// Memoized Card component
const Card = memo(({ index, availableProducts, onUpdateCards }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const tagBg = useColorModeValue("blue.50", "blue.900");
  const tagColor = useColorModeValue("blue.600", "blue.200");

  const unselectedProducts = availableProducts.filter(
    (product) => !selectedTags.includes(product)
  );

  const handleSelect = useCallback((product) => {
    setSelectedTags((prev) => [...prev, product]);
  }, []);

  const handleRemove = useCallback((productToRemove) => {
    setSelectedTags((prev) =>
      prev.filter((product) => product !== productToRemove)
    );
  }, []);

  // Update parent component when tags change
  React.useEffect(() => {
    onUpdateCards(index, selectedTags);
  }, [selectedTags, index, onUpdateCards]);

  return (
    <Stack bg="white" p={3} borderRadius="xl">
      <HStack justifyContent={"space-between"}>
        <Text size="sm" fontWeight="semibold">
          Story {index + 1}
        </Text>

        <HStack>
          <Tag fontSize={"xs"} p={2} px={4} cursor={"pointer"}>
            Edit
          </Tag>

          <Tag fontSize={"xs"} p={2} px={4} cursor={"pointer"}>
            Preview
          </Tag>

          <Tag fontSize={"xs"} p={2} px={4} cursor={"pointer"}>
            Publish
          </Tag>
        </HStack>
      </HStack>

      <Stack spacing={1}>
        <Box>
          <ProductSelector
            unselectedProducts={unselectedProducts}
            onSelect={handleSelect}
            isDisabled={unselectedProducts.length === 0}
          />
        </Box>

        <Stack direction="row" flexWrap="wrap" spacing={2}>
          {selectedTags.map((tag) => (
            <ProductTag
              key={tag}
              tag={tag}
              onRemove={handleRemove}
              tagBg={tagBg}
              tagColor={tagColor}
            />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
});

Card.displayName = "Card";

// Main Stories component
const Stories = () => {
  const [cardCount] = useState(3);
  const [cardSelections, setCardSelections] = useState(
    Array(cardCount).fill([])
  );

  const handleUpdateCards = useCallback((cardIndex, newTags) => {
    setCardSelections((prev) => {
      const newSelections = [...prev];
      newSelections[cardIndex] = newTags;
      return newSelections;
    });
  }, []);

  // Create a context value object
  const productStoryContextValue = {
    addInfoPoint: () => {},
    removeInfoPoint: () => {},
    getInfoPoints: () => {},
    updateInfoPointText: () => {},
    isDisabled: true,
    styles: {},
    handleStyleChange: () => {},
  };

  const contents = [];
  const sheetData = [];

  return (
    <ProductStoryContext.Provider value={productStoryContextValue}>
      <HStack p={5}>
        <Stack spacing={3} w="50%">
          {Array.from({ length: cardCount }).map((_, index) => (
            <Card
              key={index}
              index={index}
              availableProducts={PRODUCT_NAMES}
              onUpdateCards={handleUpdateCards}
            />
          ))}
        </Stack>

        <Stack w="50%" alignItems={"center"}>
          <Stack
            w={"277.4px"}
            h={"572.85px"}
            borderWidth={5}
            borderColor={"black"}
            borderRadius={50}
            overflow={"hidden"}
            boxShadow={"lg"}
            position={"relative"}
          >
            <CarouselComponent
              productData={contents || []}
              defaultSheetData={sheetData || []}
            />
          </Stack>
        </Stack>
      </HStack>
    </ProductStoryContext.Provider>
  );
};

export default Stories;
