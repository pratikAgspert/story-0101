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
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import CarouselComponent from "../components/ProductStoryVisualizer/CarouselComponent";
import { ProductStoryContext } from "../services/context";
import { useProducts } from "../apiHooks/useProducts";
import {
  STORY_TEMPLATE_QUERY_KEY,
  useStoryTemplate,
  useUpdateStoryTemplate,
} from "../apiHooks/useStoryTemplate";
import { useQueryClient } from "@tanstack/react-query";
import {
  filterCarouselTypes,
  handleSavedOrPublishData,
} from "../components/ProductStoryBuilder/storyUtils";
import { useSearchParams } from "react-router-dom";

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
const ProductSelector = memo(({ availableProducts, onSelect, isDisabled }) => (
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
      {availableProducts.length > 0
        ? "Select products..."
        : "No more products available"}
    </MenuButton>
    <MenuList>
      {availableProducts.map((product) => (
        <MenuItem key={product.id} onClick={() => onSelect(product)}>
          {product?.name}
        </MenuItem>
      ))}
    </MenuList>
  </Menu>
));

ProductSelector.displayName = "ProductSelector";

// Memoized Card component
const Card = memo(
  ({
    index,
    selectedTags,
    availableProducts,
    onSelectProduct,
    onRemoveProduct,
    template,
    onPreview,
    onEdit,
    templateId,
  }) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const tagBg = useColorModeValue("blue.50", "blue.900");
    const tagColor = useColorModeValue("blue.600", "blue.200");
    const {
      mutate: updateStoryTemplate,
      isPending: isUpdatingStoryTemplate,
      isError: isUpdatingStoryTemplateError,
    } = useUpdateStoryTemplate();

    const handleUpdateStoryTemplate = async () => {
      const updatedStoryTemplate = {
        ...template,
        products: selectedTags?.map((product) => product?.id),
      };

      updateStoryTemplate({ id: template?.id, formData: updatedStoryTemplate }); //TODO:  a few changes may be required here
    };

    return (
      <Stack
        bg="white"
        p={3}
        borderRadius="xl"
        borderWidth={templateId === template?.id ? 2 : 0}
        borderColor={templateId === template?.id ? "green" : "white"}
      >
        <HStack justifyContent="space-between">
          <Text size="sm" fontWeight="semibold">
            {template?.name}
          </Text>
          <HStack
            onClick={() => {
              searchParams.set("templateId", template?.id);
              setSearchParams(searchParams.toString());
            }}
          >
            <Tag
              onClick={() => {
                onEdit(template);
              }}
              fontSize="xs"
              p={2}
              px={4}
              cursor="pointer"
            >
              Edit
            </Tag>
            <Tag
              fontSize="xs"
              p={2}
              px={4}
              cursor="pointer"
              onClick={() => onPreview(template)}
            >
              Preview
            </Tag>
            {isUpdatingStoryTemplate ? <Spinner /> : <Tag
              fontSize="xs"
              p={2}
              px={4}
              cursor="pointer"
              isLoading={isUpdatingStoryTemplate}
              onClick={handleUpdateStoryTemplate}
            >
              Publish
            </Tag>}
          </HStack>
        </HStack>

        <Stack spacing={1}>
          <Box>
            <ProductSelector
              availableProducts={availableProducts}
              onSelect={(product) => onSelectProduct(template?.id, product)}
              isDisabled={availableProducts.length === 0}
            />
          </Box>

          <Stack direction="row" flexWrap="wrap" spacing={2}>
            {selectedTags.map((product) => (
              <ProductTag
                key={product?.id}
                tag={product?.name}
                onRemove={() => onRemoveProduct(template?.id, product)}
                tagBg={tagBg}
                tagColor={tagColor}
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

Card.displayName = "Card";

// Main Stories component
const Stories = () => {
  const {
    data: storyTemplates,
    isLoading: isStoryTemplatesLoading,
    isError: isStoryTemplatesError,
  } = useStoryTemplate();
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useProducts();
  const [cardSelections, setCardSelections] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  // Initialize card selections when templates load
  React.useEffect(() => {
    if (storyTemplates?.length) {
      console.log("storyTemplates", storyTemplates);
      // story pre-selected products
      // a dict of id and products from storyTemplates
      const storyPreSelectedProducts = {};
      storyTemplates.map((template) => {
        storyPreSelectedProducts[template.id] = template.products;
      });
      setCardSelections(storyPreSelectedProducts);
    }
  }, [storyTemplates]);
  // Get all selected products across all cards
  const getAllSelectedProducts = useCallback(() => {
    return Object.values(cardSelections).flat();
  }, [cardSelections]);

  // Get available products for any card
  const getAvailableProducts = useCallback(() => {
    if (!products) return [];
    const selectedProducts = getAllSelectedProducts();
    return products.filter(
      (product) =>
        !selectedProducts.some((selected) => selected.id === product.id)
    );
  }, [cardSelections, products]);

  // Handle product selection
  const handleSelectProduct = useCallback((templateId, product) => {
    setCardSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[templateId] = [...prev[templateId], product];
      return newSelections;
    });
  }, []);

  // Handle product removal
  const handleRemoveProduct = useCallback((templateId, product) => {
    setCardSelections((prev) => {
      const newSelections = { ...prev };
      newSelections[templateId] = prev[templateId].filter(
        (p) => p.id !== product.id
      );
      return newSelections;
    });
  }, []);

  // Create a context value object
  const productStoryContextValue = {
    addInfoPoint: () => { },
    removeInfoPoint: () => { },
    getInfoPoints: () => { },
    updateInfoPointText: () => { },
    isDisabled: true,
    styles: {},
    handleStyleChange: () => { },
  };

  const [contents, setContents] = useState([]);
  const [sheetData, setSheetData] = useState([]);

  if (isStoryTemplatesLoading || isProductsLoading) {
    return (
      <Stack align="center" justify="center" h="100vh">
        <Spinner size="xl" />
        <Text>Loading...</Text>
      </Stack>
    );
  }

  if (isStoryTemplatesError || isProductsError) {
    return (
      <Alert status="error">
        <AlertIcon />
        Error loading data. Please try again later.
      </Alert>
    );
  }
  const handlePreview = (template) => {
    console.log("template", template);
    const contents = template?.description?.data;
    const sheetData = template?.description?.general_sheet;
    handleSavedOrPublishData(
      template,
      setContents,
      setSheetData,
      filterCarouselTypes,
      template?.name
    );
    console.log("contents", contents);
    console.log("sheetData", sheetData);
    // setContents(contents);
    // setSheetData(sheetData);
  };

  const handleEdit = (template) => {
    window.location.href = `/storyBuilder?edit=published&templateId=${template?.id}`;
    console.log("template", template);
  };

  return (
    <ProductStoryContext.Provider value={productStoryContextValue}>
      <HStack p={5} h={"100dvh"}>
        <Stack spacing={3} w="50%" h={"100%"} overflowY={"scroll"}>
          {storyTemplates
            ?.sort((a, b) => b?.id - a?.id)
            ?.map((template, index) => (
              <Card
                key={template.id}
                index={index}
                template={template}
                selectedTags={cardSelections?.[template?.id] || []}
                availableProducts={getAvailableProducts()}
                onSelectProduct={handleSelectProduct}
                onRemoveProduct={handleRemoveProduct}
                onPreview={handlePreview}
                onEdit={handleEdit}
                templateId={Number(templateId)}
              />
            ))}
        </Stack>

        <Stack w="50%" alignItems="center">
          <Stack
            w="277.4px"
            h="572.85px"
            borderWidth={5}
            borderColor="black"
            borderRadius={50}
            overflow="hidden"
            boxShadow="lg"
            position="relative"
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
