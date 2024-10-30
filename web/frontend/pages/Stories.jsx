import React, { useState } from "react";
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
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";

const productNames = [
  "product 1",
  "product 2",
  "product 3",
  "product 4",
  "product 5",
];

const Card = ({ index, availableProducts, onUpdateCards }) => {
  const [selectedTags, setSelectedTags] = useState([]);

  const tagBg = useColorModeValue("blue.50", "blue.900");
  const tagColor = useColorModeValue("blue.600", "blue.200");

  // Names that aren't selected in this card
  const unselectedProducts = availableProducts.filter(
    (product) => !selectedTags.includes(product)
  );

  const handleSelect = (product) => {
    setSelectedTags([...selectedTags, product]);
  };

  const handleRemove = (productToRemove) => {
    setSelectedTags(
      selectedTags.filter((product) => product !== productToRemove)
    );
  };

  // Update parent component when tags change
  React.useEffect(() => {
    onUpdateCards(index, selectedTags);
  }, [selectedTags, index, onUpdateCards]);

  return (
    <Stack bg={"white"} p={3} borderRadius={"xl"}>
      <Text size="sm" fontWeight={"semibold"}>
        Story {index + 1}
      </Text>

      <Stack spacing={1}>
        {/* Selector */}
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<FaArrowRight />}
              w="full"
              variant="outline"
              textAlign="left"
              isDisabled={unselectedProducts.length === 0}
              fontSize={"sm"}
            >
              {unselectedProducts.length > 0
                ? "Select products..."
                : "No more products available"}
            </MenuButton>
            <MenuList>
              {unselectedProducts.map((name) => (
                <MenuItem key={name} onClick={() => handleSelect(name)}>
                  {name}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Box>

        {/* Tags Display */}
        <Stack direction="row" flexWrap="wrap" spacing={2}>
          {selectedTags.map((tag) => (
            <Tag
              key={tag}
              size="sm"
              borderRadius="full"
              variant="subtle"
              bg={tagBg}
              color={tagColor}
              p={1}
              px={3}
            >
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemove(tag)} />
            </Tag>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

const Stories = () => {
  const [cardCount] = useState(3);
  const [cardSelections, setCardSelections] = useState(
    Array(cardCount).fill([])
  );

  const handleUpdateCards = (cardIndex, newTags) => {
    setCardSelections((prev) => {
      const newSelections = [...prev];
      newSelections[cardIndex] = newTags;
      return newSelections;
    });
  };

  return (
    <Box p={5} w={"50%"}>
      <Stack spacing={3}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <Card
            key={index}
            index={index}
            availableProducts={productNames}
            onUpdateCards={handleUpdateCards}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default Stories;
