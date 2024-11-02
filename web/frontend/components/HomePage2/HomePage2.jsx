import {
  Button,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Image,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CgArrowLeft, CgArrowRight, CgClose } from "react-icons/cg";
import { MapWrapper as Map } from "../HomePage/MapWrapper";
import CarouselComponent from "../ProductStoryVisualizer/CarouselComponent";
import { ProductStoryContext } from "../ProductStoryBuilder/context";
import QRCode from "../../assets/AgSpeak_qr_code.png";

const HomePage2 = () => {
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [isViewDemo, setIsViewDemo] = useState(false);

  const contents = [];
  const sheetData = [];

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

  return (
    <HStack p={3} alignItems={"start"}>
      <Stack w={"70%"} h={"96dvh"} spacing={3} overflow={"scroll"}>
        <Stack spacing={0}>
          <Text>Click on link to get a demo experience</Text>
          <Link
            href="#"
            target="_blank"
            color={"blue.400"}
            fontWeight={"semibold"}
          >
            brandname.agspeak.in
          </Link>
        </Stack>

        <Grid templateColumns="repeat(3, 1fr)" gap={3}>
          <TopStatCard label={"Unique experiences"} value={"0 Experiences"} />
          <TopStatCard label={"Unique links"} value={"0 Links"} />
          <TopStatCard label={"Live on"} value={"0 Products"} />
        </Grid>

        <Button
          px={10}
          py={6}
          bg={"green.400"}
          boxShadow={"md"}
          w={"fit-content"}
          alignSelf={"center"}
          color={"white"}
          borderRadius={100}
        >
          Create your first experience
        </Button>

        <Stack bg={"white"} p={3} borderRadius={5}>
          <Stack>
            <Text>Analytics</Text>

            <Grid templateColumns="repeat(4, 2fr)" gap={3}>
              <AnalyticsCard label={"All Scans"} value={5474} />
              <AnalyticsCard label={"Unique Scans"} value={5474} />
              <AnalyticsCard label={"All Locations"} value={5474} />
              <AnalyticsCard label={"All Pins/Zips"} value={5474} />
              <AnalyticsCard label={"Unique IPs"} value={5474} />
              <AnalyticsCard label={"Referral Conversions"} value={5474} />
              <AnalyticsCard isOSBrowserStats />
            </Grid>
          </Stack>

          <Stack>
            <Map
              selectedGeofence={selectedGeofence}
              updateGeofence={(geofence) => setSelectedGeofence(geofence)}
            />
          </Stack>
        </Stack>
      </Stack>

      <Stack w={"30%"}>
        <ProductStoryContext.Provider value={productStoryContextValue}>
          {isViewDemo ? (
            <Stack spacing={0}>
              <Button
                leftIcon={<CgArrowLeft fontSize={20} />}
                onClick={() => setIsViewDemo(!isViewDemo)}
                alignSelf={"start"}
                size={"sm"}
              >
                Back
              </Button>

              <Stack
                w="277.4px"
                h="572.85px"
                borderWidth={5}
                borderColor="black"
                borderRadius={50}
                overflow="hidden"
                boxShadow="lg"
                position="relative"
                alignSelf={"center"}
              >
                <CarouselComponent
                  productData={contents || []}
                  defaultSheetData={sheetData || []}
                />
              </Stack>
            </Stack>
          ) : (
            <Stack spacing={1}>
              <Link
                display={"flex"}
                gap={3}
                alignItems={"center"}
                alignSelf={"flex-end"}
              >
                <Text
                  textTransform={"uppercase"}
                  fontWeight={"bold"}
                  fontSize={16}
                >
                  Guide Tour
                </Text>
                <CgArrowRight fontSize={20} />
              </Link>

              <Stack
                w="277.4px"
                h="572.85px"
                borderWidth={5}
                borderColor="black"
                borderRadius={50}
                overflow="hidden"
                boxShadow="lg"
                justifyContent={"end"}
                alignItems={"center"}
                alignSelf={"center"}
                pb={50}
              >
                <Stack
                  bg={"blackAlpha.900"}
                  borderRadius={8}
                  color={"white"}
                  w={"85%"}
                  textAlign={"center"}
                  p={3}
                >
                  <Text>Sample QR Code</Text>

                  <Stack bg={"white"} p={2} borderRadius={5}>
                    <Image src={QRCode} alt="QR-code" />
                  </Stack>

                  <Text>
                    Scan using your phone camera to get experience in your phone
                  </Text>
                </Stack>

                <Button
                  colorScheme="blue"
                  borderRadius={100}
                  size={"sm"}
                  onClick={() => setIsViewDemo(!isViewDemo)}
                >
                  Preview
                </Button>

                <Button colorScheme="green" borderRadius={100} size={"sm"}>
                  Use this Template
                </Button>
              </Stack>
            </Stack>
          )}
        </ProductStoryContext.Provider>
      </Stack>
    </HStack>
  );
};

const TopStatCard = ({ label, value }) => {
  return (
    <GridItem bg={"white"} borderRadius={5} p={3.5} py={5} spacing={0}>
      <HStack justifyContent={"space-between"}>
        <Text fontSize={14} fontWeight={"medium"}>
          {label}
        </Text>
        <CgArrowRight fontSize={20} />
      </HStack>
      <Text fontSize={20} fontWeight={"bold"}>
        {value}
      </Text>
    </GridItem>
  );
};

const AnalyticsCard = ({ label, value, isOSBrowserStats = false }) => {
  return (
    <>
      {isOSBrowserStats ? (
        <GridItem
          position={"relative"}
          p={2}
          bg={"blue.100"}
          borderRadius={5}
          colSpan={2}
        >
          <Stack h={"100%"} spacing={1} alignItems={"end"}>
            <Stack bg={"yellow.400"} w={"80%"} h={"25%"} />
            <Stack bg={"orange.400"} w={"50%"} h={"25%"} />
            <Stack bg={"red.400"} w={"30%"} h={"25%"} />
          </Stack>
          <Text
            fontSize={12}
            fontWeight={"medium"}
            position={"absolute"}
            bottom={1}
          >
            OS/Browser Stats
          </Text>
        </GridItem>
      ) : (
        <GridItem
          p={2}
          bg={"blue.100"}
          borderRadius={5}
          spacing={0}
          colSpan={1}
        >
          <Text fontSize={12} fontWeight={"medium"}>
            {label}
          </Text>
          <Text fontSize={20} fontWeight={"bold"}>
            {value}
          </Text>
        </GridItem>
      )}
    </>
  );
};

export default HomePage2;
