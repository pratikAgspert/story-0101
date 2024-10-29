import {
  Box,
  Button,
  Checkbox,
  HStack,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import BatchStatsPieChart from './BatchStatsPieChart';
import { GridLayout as HomePageLayout } from './GridLayout';
import { MapWrapper as Map } from './MapWrapper';
import QRAnalytics from './QRAnalytics';
import AppStats from './Stats/AppStats';
import StatsFilters from './StatsFilters';
import WorkflowStatsLineGraph from './WorkflowStatsLineGraph';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  rectSortingStrategy,
  rectSwappingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ProductStats from './Stats/ProductStats';
import ProcurementStats from './Stats/ProcurementStats';
import SalesStats from './Stats/SalesStats';
import POSStats from './Stats/POSStats';
import FarmerStats from './Stats/FarmerStats';
import BatchesStats from './Stats/BatchesStats';
import GeofencesStats from './Stats/GeofencesStats';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@chakra-ui/react';
import LoadingModal from './HomePage/loading';

const CARD_ORDER_KEY = 'card-order';
const cardsOrder = [
  { id: '1', title: 'Products', type: 'products', isVisible: true },
  { id: '2', title: 'Procurements', type: 'procurements', isVisible: true },
  { id: '3', title: 'Farmers/Vendors', type: 'farmers', isVisible: true },
  { id: '4', title: 'Sales', type: 'sales', isVisible: true },
  { id: '5', title: 'POS/Products', type: 'pos', isVisible: true },
  { id: '6', title: 'Batches', type: 'batches', isVisible: true },
  { id: '7', title: 'Geofence', type: 'geofence', isVisible: true },
];

export function getDateRange(daysBack) {
  if (daysBack === null) {
    return {};
  }

  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(endDate.getDate() - daysBack);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return {
    start_date: formatDate(startDate),
    end_date: formatDate(endDate),
  };
}

export const HomePage = () => {
  const [selectedTimeline, setSelectedTimeline] = useState(30);
  const [selectedGeofence, setSelectedGeofence] = useState(null);
  const [token, setToken] = useState(false);
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();

  const [activeId, setActiveId] = useState(null);
  const [isShopCreated, setIsShopCreated] = useState(false);
  const [isProductFetched, setIsProductFetched] = useState(false);




  const [cards, setCards] = useState(() => {
    try {
      const cards = window?.localStorage?.getItem(CARD_ORDER_KEY);
      const cardsData = JSON.parse(cards);
      return cardsData?.length ? cardsData : cardsOrder;
    } catch (err) {
      return cardsOrder;
    }
  });

  const toggleCardVisibility = (id) => {
    setCards(
      cards.map((card) =>
        card.id === id ? { ...card, isVisible: !card.isVisible } : card
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active?.id !== over?.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const updatedCardsList = arrayMove(items, oldIndex, newIndex);
        window?.localStorage?.setItem(
          CARD_ORDER_KEY,
          JSON.stringify(updatedCardsList)
        );
        return updatedCardsList;
      });
    }
    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const visibleCards = cards.filter((card) => card.isVisible);

  return (
    <>
      {/* <HomePageLayout> */}

      {/* <DisplayWrapper wrapperStyles={{ py: 2, px: 5 }}> */}
      {/* <StatsFilters
        selectedTimeline={selectedTimeline}
        updateTimeline={(timeline) => {
          setSelectedTimeline((previousTimeline) => {
            return previousTimeline === timeline ? null : timeline;
          });
        }}
      /> */}
      {/* </DisplayWrapper> */}
      <LoadingModal
        isOpen={isOpen}
        isShopCreated={isShopCreated}
        isProductFetched={isProductFetched}
      />
      <Stack py={2} px={5}>
        <StatsFilters
          selectedTimeline={selectedTimeline}
          updateTimeline={(timeline) => {
            setSelectedTimeline((previousTimeline) => {
              return previousTimeline === timeline ? null : timeline;
            });
          }}
          statsButton={
            <AddStatsList
              cards={cards}
              toggleVisibility={toggleCardVisibility}
            />
          }
        />

        <DisplayWrapper
          wrapperStyles={{
            display: 'flex',
            gap: 3,
            flexWrap: 'wrap',
            alignItems: 'start',
          }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            onDragCancel={handleDragCancel}
          >
            <SortableContext
              items={visibleCards}
              strategy={rectSortingStrategy}
            >
              <SimpleGrid columns={3} spacing={4} w="full">
                {visibleCards?.map((card) => (
                  <Box
                    key={card?.id}
                    gridColumn={
                      ['batches', 'geofence'].includes(card?.type)
                        ? 'span 3'
                        : 'span 1'
                    }
                  >
                    <SortableStatsCard
                      {...card}
                      timeline={selectedTimeline}
                      toggleCardVisibility={toggleCardVisibility}
                      isActive={card?.id === activeId}
                    />
                  </Box>
                ))}
              </SimpleGrid>
            </SortableContext>

            <DragOverlay>
              {activeId ? (
                <Box opacity={1} boxShadow="xl">
                  <SortableStatsCard
                    {...cards?.find((card) => card?.id === activeId)}
                    timeline={selectedTimeline}
                    toggleCardVisibility={toggleCardVisibility}
                    isOverlay
                  />
                </Box>
              ) : null}
            </DragOverlay>
          </DndContext>
        </DisplayWrapper>
      </Stack>

      {/* <DisplayWrapper wrapperStyles={{ py: 2 }}>
          <WorkflowStatsLineGraph timeline={selectedTimeline} />
        </DisplayWrapper>

        <DisplayWrapper wrapperStyles={{ py: 2 }}>
          <BatchStatsPieChart timeline={selectedTimeline} />
        </DisplayWrapper>

        <DisplayWrapper>
          <AppStats timeline={selectedTimeline} />
        </DisplayWrapper> */}

      {/* <DisplayWrapper wrapperStyles={{ id: 'map', w: '92vw' }}>
        <Map
          timeline={selectedTimeline}
          selectedGeofence={selectedGeofence}
          updateGeofence={(geofence) => setSelectedGeofence(geofence)}
        />
      </DisplayWrapper> */}

      {/* <DisplayWrapper>
        <QRAnalytics timeline={selectedTimeline} />
      </DisplayWrapper> */}
      {/* </HomePageLayout> */}
    </>
  );
};

export const DisplayWrapper = ({ children, wrapperStyles }) => {
  return (
    <Box
      borderRadius={'lg'}
      overflow={'hidden'}
      width={'100%'}
      height={'100% '}
      p={1}
      {...wrapperStyles}
    >
      {children}
    </Box>
  );
};

const SortableStatsCard = ({
  id,
  title,
  type,
  timeline,
  toggleCardVisibility,
  isActive,
  isOverlay = false,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isActive && !isOverlay ? 0.2 : 1,
  };

  const renderStatsComponent = () => {
    const props = {
      timeline,
      dragHandleProps: { ...attributes, ...listeners },
      title,
      onClickClose: () => toggleCardVisibility(id),
    };

    switch (type) {
      case 'products':
        return <ProductStats {...props} />;
      case 'procurements':
        return <ProcurementStats {...props} />;
      case 'sales':
        return <SalesStats {...props} />;
      case 'pos':
        return <POSStats {...props} />;
      case 'farmers':
        return <FarmerStats {...props} />;
      case 'batches':
        return <BatchesStats {...props} />;
      case 'geofence':
        return <GeofencesStats {...props} />;
      default:
        return null;
    }
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      borderRadius="lg"
      overflow="hidden"
      height="100%"
      // bg="white"
    >
      {renderStatsComponent()}
    </Box>
  );
};

const AddStatsList = ({ cards, toggleVisibility }) => {
  return (
    <Stack spacing={2} alignSelf={'flex-end'}>
      <Popover>
        <PopoverTrigger>
          <Button>Add Stats +</Button>
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverCloseButton />
          <PopoverBody>
            <Stack w={100}>
              {cards.map((card) => (
                <Checkbox
                  key={card.id}
                  isChecked={card.isVisible}
                  onChange={() => toggleVisibility(card.id)}
                >
                  {card.title.charAt(0).toUpperCase() + card.title.slice(1)}
                </Checkbox>
              ))}
            </Stack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Stack>
  );
};

export default HomePage;
