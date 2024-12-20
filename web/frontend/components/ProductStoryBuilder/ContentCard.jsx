import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  IconButton,
  HStack,
  Heading,
  Switch,
  Input,
  Textarea,
  Stack,
  Icon,
  Text,
} from "@chakra-ui/react";
import { DeleteIcon, EditIcon, DragHandleIcon } from "@chakra-ui/icons";
import MediaPicker from "./MediaPicker";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FaYoutube } from "react-icons/fa";
import { FaAmazon } from "react-icons/fa";
import { FaFacebookSquare } from "react-icons/fa";
import { FaPinterest } from "react-icons/fa";
import { FaShopify } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io5";
import { nanoid } from "nanoid";
import MultipleMediaPicker from "./MultipleMediaPicker";
import WordEditor from "./WordEditor";

const ContentCard = ({
  id,
  type,
  header,
  data,
  onUpdate,
  content,
  onDelete,
  label,
  url,
  social_links,
  isActive,
  isCarousel = false,
  addUrlMapping,
  addUnusedRemoteUrl,
  isDisabled,
  formMethods,
  background_color,
  handle_color,
}) => {
  const inputRef = useRef(null);
  const textContentRef = useRef(null);
  const labelRef = useRef(null);
  const urlRef = useRef(null);
  const [urlError, setUrlError] = useState(false);
  // const URL_REGEX =
  //   /^(https?:\/\/)?(([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{2,}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[-a-z0-9\._~:/?#[$$@!$&'()*+,;=%]*)?$/i;
  const URL_REGEX =
    /^(https?:\/\/)(([a-z0-9][a-z0-9-]*[a-z0-9]\.)+[a-z]{2,}|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?(\/[-a-z0-9\._~:/?#[$$@!$&'()*+,;=%]*)?$/i;

  const { control } = formMethods;

  const handleLabelChange = (e) => {
    onUpdate({ label: e.target.value });
  };

  // for social icons
  const handleUrlChange = (e) => {
    const newUrl = e.target.value;

    if (newUrl === "") {
      setUrlError(false);
      onUpdate({ url: newUrl });
    } else {
      const isValid = URL_REGEX.test(newUrl);
      if (isValid) {
        setUrlError(false);
        onUpdate({ url: newUrl });
      } else {
        setUrlError(true);
        onUpdate({ url: newUrl });
      }
    }
  };

  const handleHeaderChange = (e) => {
    onUpdate({ header: e.target.value });
  };

  const handleTextContentChange = (e) => {
    onUpdate({ content: e.target.value });
  };

  // single upload media
  const handleMediaChange = (newMedia) => {
    console.log("state carousel handleMediaChange", newMedia);
    onUpdate({
      data: [
        {
          ...data[0],
          image_url: newMedia[0],
        },
      ],
    });
  };
  const handleDeleteSingleMedia = (id) => {
    console.log(
      "state carousel handleDeleteSingleMedia",
      id,
      data?.find((image) => image?.id === id)?.image_url
    );
    addUnusedRemoteUrl(id, data?.find((image) => image?.id === id)?.image_url);
    onUpdate({
      data: [
        {
          ...data[0],
          image_url: "",
        },
      ],
      infoPoints: {},
    });
  };

  // multiple upload media
  const handleMultipleMediaChange = (mediaList) => {
    console.log("new media", mediaList);
    //TODO:
    onUpdate({
      data: [
        ...data,
        ...mediaList?.map((media) => ({
          id: media.id,
          type: media.type,
          image_url: media.url,
        })),
      ],
    });
  };

  const handleChangeOrder = (newOrder) => {
    onUpdate({
      data: newOrder,
    });
  };

  const handleDeleteImage = (id) => {
    console.log(
      "state carousel handleDeleteImage",
      id,
      data?.find((image) => image?.id === id)?.image_url
    );
    //TODO: we are getting local url but we need remote url
    addUnusedRemoteUrl(id, data?.find((image) => image.id === id)?.image_url);
    onUpdate({
      data: data.filter((image) => image.id !== id),
    });
  };

  const mediaTypes = [
    "carousel_360_image",
    "carousel_360_video",
    "brand_banner",
    "carousel_2d_image",
    "carousel_2d_video",
    "image_content",
    "video_content",
    "partners",
  ];
  const multipleMediaTypes = ["image_content", "video_content", "partners"];

  const contentTypes = [
    "header",
    "text_content",
    "carousel_360_image",
    "carousel_360_video",
    "carousel_2d_image",
    "carousel_2d_video",
  ];

  const textEditor = ["header", "text_content"];

  const screen360InfoTypes = ["carousel_360_image", "carousel_360_video"];

  const screen2DInfoTypes = ["carousel_2d_image", "carousel_2d_video"];

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      borderRadius="2xl"
      boxShadow="lg"
      p={4}
      bg={"white"}
      borderLeftWidth={5}
      borderLeftColor={isCarousel ? "lightblue" : "orange"}
    >
      <HStack justifyContent="space-between" mb={4}>
        <HStack>
          <IconButton
            {...attributes}
            {...listeners}
            aria-label="Drag handle"
            icon={<DragHandleIcon />}
            size="sm"
            cursor="grab"
            _active={{ cursor: "grabbing" }}
            bg={"transparent"}
            isDisabled={isDisabled}
          />
          <Heading size="md">{type}</Heading>
        </HStack>

        <HStack spacing={5}>
          <IconButton
            onClick={onDelete}
            aria-label="Delete"
            icon={<DeleteIcon />}
            size="md"
            borderRadius={"100%"}
            isDisabled={isDisabled}
          />
          <Switch
            size="md"
            defaultChecked
            onChange={() => onUpdate({ isActive: !isActive })}
            isDisabled={isDisabled}
          />
        </HStack>
      </HStack>

      {contentTypes.includes(type) && (
        <Box display="flex" alignItems="center" mb={4}>
          <Input
            placeholder="Header"
            size="sm"
            ref={inputRef}
            value={header}
            onChange={handleHeaderChange}
            borderRadius={50}
            isDisabled={isDisabled}
          />
          <IconButton
            aria-label="Edit"
            icon={<EditIcon />}
            size="sm"
            ml={2}
            onClick={() => inputRef.current.focus()}
            isDisabled={isDisabled}
          />
        </Box>
      )}

      {type === "text_content" && (
        <Box display="flex" alignItems="start" mb={4}>
          <Textarea
            placeholder="text content"
            size="sm"
            ref={textContentRef}
            value={content}
            onChange={handleTextContentChange}
            height="100px"
            borderRadius={10}
            isDisabled={isDisabled}
          />
          <IconButton
            aria-label="Edit"
            icon={<EditIcon />}
            size="sm"
            ml={2}
            onClick={() => textContentRef.current.focus()}
            isDisabled={isDisabled}
          />
        </Box>
      )}

      {type === "content" && (
        <WordEditor
          onUpdate={onUpdate}
          content={content}
          isDisabled={isDisabled}
        />
      )}

      {mediaTypes.includes(type) ? (
        multipleMediaTypes.includes(type) ? (
          <MultipleMediaPicker
            addUrlMapping={addUrlMapping}
            type={type}
            dataList={data}
            onImagesChange={(mediaList) =>
              handleMultipleMediaChange(mediaList, type)
            }
            // onImagesChange={(newMedia, type, id) =>
            //   handleMultipleMediaChange(newMedia, type, id)
            // }
            onDeleteImage={handleDeleteImage}
            changeOrder={handleChangeOrder}
            isDisabled={isDisabled}
          />
        ) : (
          <MediaPicker
            addUrlMapping={addUrlMapping}
            type={type}
            id={data?.[0]?.id}
            selectedImages={data[0]?.image_url ? [data[0].image_url] : []}
            onImagesChange={handleMediaChange}
            handleDeleteSingleMedia={handleDeleteSingleMedia}
            isDisabled={isDisabled}
          />
        )
      ) : null}

      {/* {screen360InfoTypes.includes(type) ? (
        <ContentPositions control={control} isDisabled={false} />
      ) : screen2DInfoTypes.includes(type) ? (
        <Stack></Stack>
      ) : null} */}

      {type === "redirect_url" && (
        <Stack spacing={0}>
          <Box display="flex" alignItems="start" mb={4}>
            <Input
              placeholder="Label"
              size="sm"
              ref={labelRef}
              value={label}
              onChange={handleLabelChange}
              borderRadius={50}
              isDisabled={isDisabled}
            />
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              ml={2}
              onClick={() => labelRef.current.focus()}
              isDisabled={isDisabled}
            />
          </Box>

          <Box display="flex" alignItems="start" mb={4}>
            <Stack w={"100%"} spacing={0}>
              <Input
                placeholder="Enter url: https://agspert.com/"
                size="sm"
                ref={urlRef}
                value={url}
                onChange={handleUrlChange}
                type="url"
                borderRadius={50}
                isInvalid={urlError}
                isDisabled={isDisabled}
              />
              {urlError && url !== "" && (
                <Text
                  color="red.500"
                  fontSize="sm"
                  mb={0}
                  alignSelf={"flex-end"}
                >
                  Invalid URL. Include http:// or https://
                </Text>
              )}
            </Stack>
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              ml={2}
              onClick={() => urlRef.current.focus()}
              isDisabled={isDisabled}
            />
          </Box>
        </Stack>
      )}

      {type === "social_links" && (
        <SocialLinks
          URL_REGEX={URL_REGEX}
          social_links={social_links}
          onChange={(newSocialLinks) =>
            onUpdate({ social_links: newSocialLinks })
          }
          isDisabled={isDisabled}
        />
      )}
    </Box>
  );
};

const initialSocialIcons = [
  { icon: FaYoutube, color: "#ce1312", name: "Youtube" },
  { icon: FaAmazon, color: "black", name: "Amazon" },
  { icon: FaFacebookSquare, color: "#4460A0", name: "Facebook" },
  { icon: FaPinterest, color: "#cc2127", name: "Pinterest" },
  { icon: FaShopify, color: "#81bf37", name: "Shopify" },
  { icon: IoLogoInstagram, color: "#d62da6", name: "Instagram" },
];

const SocialIcon = ({ icon: IconComponent, color, onClick }) => (
  <IconComponent
    color={color}
    fontSize={30}
    cursor="pointer"
    onClick={onClick}
  />
);

const SocialLinks = ({ social_links, onChange, URL_REGEX, isDisabled }) => {
  const [availableIcons, setAvailableIcons] = useState(initialSocialIcons);
  const [selectedIcons, setSelectedIcons] = useState([]);
  const [urlErrors, setUrlErrors] = useState({});
  const inputRefs = useRef({});

  useEffect(() => {
    // Initialize selectedIcons from social_links
    const initialSelectedIcons = social_links.map((link) => {
      const iconInfo = initialSocialIcons.find(
        (icon) => icon.name.toLowerCase() === link.label
      );
      return {
        ...link,
        icon: iconInfo?.icon,
        color: iconInfo?.color,
      };
    });
    setSelectedIcons(initialSelectedIcons);

    // Update availableIcons
    const usedLabels = new Set(social_links.map((link) => link.label));
    setAvailableIcons(
      initialSocialIcons.filter(
        (icon) => !usedLabels.has(icon.name.toLowerCase())
      )
    );
  }, [social_links]);

  const addIcon = (icon) => {
    const newIcon = {
      id: nanoid(),
      label: icon.name.toLowerCase(),
      url: "",
      icon: icon.icon,
      color: icon.color,
    };
    setSelectedIcons([...selectedIcons, newIcon]);
    setAvailableIcons(availableIcons.filter((i) => i.name !== icon.name));
    onChange([
      ...social_links,
      { id: newIcon.id, label: newIcon.label, url: newIcon.url },
    ]);
  };

  const removeIcon = (iconId) => {
    const removedIcon = selectedIcons.find((i) => i.id === iconId);
    setSelectedIcons(selectedIcons.filter((i) => i.id !== iconId));
    setAvailableIcons(
      [
        ...availableIcons,
        {
          icon: removedIcon.icon,
          color: removedIcon.color,
          name:
            removedIcon.label.charAt(0).toUpperCase() +
            removedIcon.label.slice(1),
        },
      ].sort(
        (a, b) =>
          initialSocialIcons.findIndex((i) => i.name === a.name) -
          initialSocialIcons.findIndex((i) => i.name === b.name)
      )
    );
    onChange(social_links.filter((link) => link.id !== iconId));
  };

  const updateIconUrl = (iconId, url) => {
    const isValid = url === "" || URL_REGEX.test(url);
    setUrlErrors((prev) => ({ ...prev, [iconId]: !isValid }));

    setSelectedIcons(
      selectedIcons.map((icon) =>
        icon.id === iconId ? { ...icon, url } : icon
      )
    );
    onChange(
      social_links.map((link) => (link.id === iconId ? { ...link, url } : link))
    );
  };

  return (
    <Stack mx={10} my={5}>
      {availableIcons.length !== 0 && (
        <HStack
          bg={"#f5f5f5"}
          padding={3}
          w={"fit-content"}
          borderRadius={50}
          spacing={5}
        >
          {availableIcons.map((icon) => (
            <SocialIcon
              key={icon.name}
              icon={icon.icon}
              color={icon.color}
              onClick={() => !isDisabled && addIcon(icon)}
            />
          ))}
        </HStack>
      )}

      <Stack mt={3} spacing={6}>
        {selectedIcons?.map((icon) => (
          <HStack key={icon.id}>
            <Icon
              as={icon.icon}
              color={icon.color}
              fontSize={35}
              bg={"white"}
              p={1}
              borderRadius={"100%"}
              cursor={"pointer"}
              border={"1px solid #E2E8F0"}
            />
            <Stack w={"100%"} spacing={0} position={"relative"}>
              <Input
                placeholder={`https://${icon.label}.com`}
                size="sm"
                ref={(el) => (inputRefs.current[icon.id] = el)}
                value={icon.url}
                onChange={(e) => updateIconUrl(icon.id, e.target.value)}
                borderRadius={50}
                isInvalid={urlErrors[icon.id]}
                isDisabled={isDisabled}
              />
              {urlErrors[icon.id] && icon.url !== "" && (
                <Text
                  color="red.500"
                  fontSize="sm"
                  mb={0}
                  position={"absolute"}
                  bottom={-6}
                  right={0}
                >
                  Invalid URL format for {icon.label}. Include http:// or
                  https://
                </Text>
              )}
            </Stack>
            <IconButton
              aria-label="Edit"
              icon={<EditIcon />}
              size="sm"
              onClick={() => inputRefs.current[icon.id].focus()}
              isDisabled={isDisabled}
            />
            <IconButton
              onClick={() => removeIcon(icon.id)}
              aria-label="Delete"
              icon={<DeleteIcon />}
              size="sm"
              borderRadius={5}
              isDisabled={isDisabled}
            />
          </HStack>
        ))}
      </Stack>
    </Stack>
  );
};

export default ContentCard;
