import React, { useState, useCallback, useEffect, memo } from "react";
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  IconButton,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import CarouselComponent from "../components/ProductStoryVisualizer/CarouselComponent";
import { ProductDriverContext, ProductStoryContext } from "../services/context";
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
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { MdRemoveCircleOutline } from "react-icons/md";

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
      className="products-selector"
    >
      {availableProducts.length > 0
        ? "Select products..."
        : "No more products available"}
    </MenuButton>
    <MenuList overflow={"scroll"} maxH={"80vh"}>
      {availableProducts.map((product, index) => (
        <MenuItem
          className="first-product-selector"
          key={product.id}
          onClick={() => onSelect(product)}
        >
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
    className = "",
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
        product_ids: selectedTags?.map((product) => product?.id),
      };

      updateStoryTemplate({ id: template?.id, formData: updatedStoryTemplate });
    };

    return (
      <Stack
        bg="white"
        borderRadius="xl"
        borderWidth={templateId === template?.id ? 2 : 0}
        borderColor={templateId === template?.id ? "green" : "white"}
        className={className}
      >
        <Stack p={3}>
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
                className="preview-experience-btn"
                fontSize="xs"
                p={2}
                px={4}
                cursor="pointer"
                onClick={() => onPreview(template)}
              >
                Preview
              </Tag>
              {isUpdatingStoryTemplate ? (
                <Spinner />
              ) : (
                <Tag
                  className="publish-story-btn"
                  fontSize="xs"
                  p={2}
                  px={4}
                  cursor="pointer"
                  isLoading={isUpdatingStoryTemplate}
                  onClick={handleUpdateStoryTemplate}
                >
                  Publish
                </Tag>
              )}
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

        {selectedTags?.length !== 0 && (
          <CardAccordion
            label={<Text fontWeight={"semibold"}>Live Products</Text>}
            body={
              <>
                {selectedTags?.map((product) => {
                  return (
                    <ProductCard
                      key={product?.id}
                      product={product}
                      onRemove={() => onRemoveProduct(template?.id, product)}
                    />
                  );
                })}
              </>
            }
          />
        )}
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
  const driverObj = driver({
    steps: [
      {
        element: ".first-story-card",
        popover: {
          title: "Select the product",
          description: "Click here for more details",
        },
      },
      {
        element: ".preview-experience-btn",
        popover: {
          title: "Preview Experience",
          description: "Click to preview the experience",
          onNextClick: () => {
            const button = document.querySelector(".preview-experience-btn");
            button?.click();
            return false;
          },
        },
      },
      {
        element: ".preview-experience-card",
        popover: {
          title: "Preview Experience",
          description: "Preview the story",
          onNextClick: () => {
            driverObj?.moveNext();
            return false;
          },
        },
      },
      {
        element: ".products-selector",
        popover: {
          title: "Select Products",
          description: "Select the products for the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".products-selector");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
      {
        element: ".first-product-selector",
        popover: {
          title: "Attach product",
          description: "Click to attach a product to the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".first-product-selector");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
      {
        element: ".publish-story-btn",
        popover: {
          title: "Publish Story",
          description: "Click to publish the story",
          onNextClick: () => {
            // Redirect to story builder
            const button = document.querySelector(".publish-story-btn");
            button?.click();
            driverObj?.moveNext();
            // window.location.href = '/story-builder'; // Change this to the actual path of your story builder
            return false;
          },
        },
      },
    ],
    allowClose: true,
    overlayClickNext: false,
    keyboardControl: false,
    doneBtnText: "Finish",
  });
  useEffect(() => {
    if (products?.length > 0) {
      setTimeout(() => {
        driverObj.drive();
      }, 1000);
    }
  }, [products]);
  console.log("cardSelections", cardSelections);
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
    addInfoPoint: () => {},
    removeInfoPoint: () => {},
    getInfoPoints: () => {},
    updateInfoPointText: () => {},
    isDisabled: true,
    styles: {},
    handleStyleChange: () => {},
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
    setTimeout(() => {
      driverObj?.moveNext();
    }, 500);
    // setContents(contents);
    // setSheetData(sheetData);
  };

  const handleEdit = (template) => {
    window.location.href = `/storyBuilder?edit=published&templateId=${template?.id}`;
    console.log("template", template);
  };

  return (
    <ProductStoryContext.Provider value={productStoryContextValue}>
      <ProductDriverContext.Provider value={{ driver: driverObj }}>
        <HStack p={5} h={"100dvh"}>
          <Stack
            spacing={3}
            w={contents?.length > 0 || sheetData?.length > 0 ? "50%" : "70%"}
            h={"100%"}
            overflowY={"scroll"}
          >
            {storyTemplates
              ?.sort((a, b) => b?.id - a?.id)
              ?.map((template, index) => (
                <Card
                  className="first-story-card"
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

          {(contents?.length > 0 || sheetData?.length > 0) && (
            <Stack w="50%" alignItems="center">
              <Stack
                className="preview-experience-card"
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
          )}
        </HStack>
      </ProductDriverContext.Provider>
    </ProductStoryContext.Provider>
  );
};

const ProductCard = ({ product, onRemove }) => {
  return (
    <HStack
      justifyContent={"space-between"}
      boxShadow={"md"}
      p={1}
      px={3}
      borderRadius={10}
      bg={"gray.100"}
    >
      <Text fontWeight={"semibold"}>{product?.name}</Text>

      <HStack>
        <IconButton icon={<FaArrowUpRightFromSquare />} />
        <IconButton
          icon={<MdRemoveCircleOutline fontSize={24} />}
          onClick={() => onRemove(product?.id)}
        />
      </HStack>
    </HStack>
  );
};

const CardAccordion = ({ label, body, headerStyles }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <Accordion allowToggle index={isOpen ? 0 : -1}>
      <AccordionItem border={"none"}>
        <Stack>
          <AccordionButton
            onClick={toggleAccordion}
            borderBottomRadius={isOpen ? 0 : 10}
            {...headerStyles}
          >
            <Stack as="span" flex="1">
              {label}
            </Stack>
            <AccordionIcon />
          </AccordionButton>
        </Stack>

        <AccordionPanel pb={3}>
          <Stack>{body}</Stack>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default Stories;
