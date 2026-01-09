import { Text } from "@/components/ui/text"
import { ONBOARDING_SLIDES, OnBoardingSlide } from "@/lib/constants/onboarding"
import { useRouter } from "expo-router"
import { useCallback, useRef, useState } from "react"
import { FlatList, useWindowDimensions, View, ViewToken } from "react-native"

const BRAND_COLOR = "#5D4037"

export default function OnBoardingScreen() {
  const router = useRouter()
  const width = useWindowDimensions()
  const flatListRef = useRef<FlatList>(null)
  
  // track of current slide index
  const [activeIndex, setActiveIndex] = useState(0)
  
  const handleViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index !== null && viewableItems[0]?.index !== undefined) {
        setActiveIndex(viewableItems[0].index);
      }
    }, []);
  
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current
  
  const handleNext = () => {
      const nextIndex = activeIndex + 1;
      
      if (nextIndex < ONBOARDING_SLIDES.length) {
        // Scroll smoothly to the next item
        flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      } else {
        // User finished onboarding -> Go to Auth
        router.replace('/(auth)/login');
      }
    };
  
  const handleSkip = () => router.replace('/(auth)/login');
  
    /**
     * SENIOR NOTE:
     * We define the renderItem separately or inline cleanly. 
     * Notice we pass `width` explicitly to ensure each item is exactly one screen wide.
     */
    const renderItem = ({ item }: { item: OnBoardingSlide }) => (
      <View style={{ width }} className="items-center px-6 pt-10">
        {/* Image Container with fixed height to prevent layout jumps */}
        <View className="h-[45%] w-full justify-center items-center mb-8">
          <item.Image width={width * 0.8} height={width * 0.8} />
        </View>
  
        <View className="gap-3">
          <Text className="text-2xl font-bold text-center text-black">
            {item.title}
          </Text>
          <Text className="text-gray-500 text-center text-base leading-6 px-4">
            {item.description}
          </Text>
        </View>
      </View>
    );
}