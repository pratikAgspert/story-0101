import React, { useContext, useEffect } from "react";
import { Header } from "./Header";
import { TextContent } from "./TextContent";
import { ImageContent } from "./ImageContent";
import { SocialLinks } from "./SocialLinks";
import { Image, Stack, Text } from "@chakra-ui/react";
import RedirectButton from "./RedirectButton";
import VideoContent from "./VideoContent";
import { BusinessPartner } from "./BusinessPartner";
import { Content } from "./Content";
import { ProductStoryContext } from "../../services/context";

export const DrawerInfo = ({ data }) => {
  const { styles } = useContext(ProductStoryContext);

  const fontFamily = styles?.font_family || "";
  const lineHeight = styles?.lineHeight || 1;

  console.log("lineHeight==>", styles?.font_family, styles?.lineHeight);

  useEffect(() => {
    if (fontFamily === "") return;

    // Load Google Fonts dynamically
    const link = document.createElement("link");
    link.href = `https://fonts.googleapis.com/css?family=${fontFamily.replace(
      " ",
      "+"
    )}`;
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, [fontFamily]);

  return (
    <Stack
      zIndex={100}
      p={3}
      overflowY={"scroll"}
      css={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
      justifyContent={"space-between"}
      mt={"2.5rem"}
      spacing={2}
      sx={{
        fontFamily: fontFamily,
        lineHeight: lineHeight,
        "& *": {
          fontFamily: "inherit !important",
          lineHeight: "inherit !important",
        },
        "&::-webkit-scrollbar": {
          display: "none",
        },
      }}
    >
      {data?.length > 0
        ? data?.map((info) => {
            switch (info?.type) {
              case "content":
                return (
                  <>
                    {info?.isActive && (
                      <Content key={info?.id} content={info?.content} />
                    )}
                  </>
                );
              case "header":
                return (
                  <>
                    {info?.isActive && (
                      <Header key={info?.id} headerTitle={info?.header} />
                    )}
                  </>
                );
              case "text_content":
                return (
                  <>
                    {info?.isActive && (
                      <TextContent
                        key={info?.id}
                        header={info?.header}
                        content={info?.content}
                      />
                    )}
                  </>
                );
              case "image_content":
                return (
                  <>
                    {info?.isActive && (
                      <ImageContent key={info?.id} media={info?.data} />
                    )}
                  </>
                );
              case "partners":
                return (
                  <>
                    {info?.isActive && (
                      <BusinessPartner key={info?.id} partner={info?.data} />
                    )}
                  </>
                );
              case "video_content":
                return (
                  <>
                    {info?.isActive && (
                      <VideoContent key={info?.id} media={info?.data} />
                    )}
                  </>
                );
              case "redirect_url":
                return (
                  <>
                    {info?.isActive && (
                      <RedirectButton key={info?.id} link={info} />
                    )}
                  </>
                );
              case "social_links":
                return (
                  <>
                    {info?.isActive && (
                      <SocialLinks
                        key={info?.id}
                        socialLinks={info?.social_links}
                      />
                    )}
                  </>
                );
              default:
                return null;
            }
          })
        : null}

      <Text
        display={"inline-flex"}
        alignItems={"center"}
        gap={2}
        w={"100%"}
        justifyContent={"center"}
        fontSize={10}
      >
        Powered by
        <a href="https://agspert.com/" target="_blank">
          <Image
            h={"1rem"}
            src="https://360-images-v1.s3.ap-south-1.amazonaws.com/Logo_agspeak.png"
            alt="logo"
          />
        </a>
      </Text>
    </Stack>
  );
};
