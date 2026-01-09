import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { ONBOARDING_SLIDES, OnBoardingSlide } from '@/lib/constants/onboarding';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, TouchableOpacity, useWindowDimensions, View, ViewToken } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BRAND_COLOR = '#5D4037';

export default function OnBoardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const flatListRef = useRef<FlatList>(null);

  // track of current slide index
  const [activeIndex, setActiveIndex] = useState(0);

  const handleViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems[0]?.index !== null && viewableItems[0]?.index !== undefined) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    []
  );

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

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
      <View className="mb-8 h-[45%] w-full items-center justify-center">
        <item.Image width={width * 0.8} height={width * 0.8} />
      </View>

      <View className="gap-3">
        <Text className="text-center text-2xl font-bold text-black">{item.title}</Text>
        <Text className="px-4 text-center text-base leading-6 text-gray-500">
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* 1. Header Area */}
      <View className="h-16 flex-row justify-end p-5">
        {/* Only show Skip if not on the last slide, usually better UX */}
        {activeIndex < ONBOARDING_SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleSkip}>
            <Text className="text-base font-medium text-gray-600">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 2. The Carousel Engine */}
      <FlatList
        data={ONBOARDING_SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false} // Prevents overscrolling on iOS for a "cleaner" feel
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
        scrollEventThrottle={32}
      />

      {/* 3. Footer Control Area */}
      <View className="px-6 pb-8 pt-4">
        
        {/* Pagination Dots */}
        <View className="flex-row justify-center gap-2 mb-8 h-4 items-center">
          {ONBOARDING_SLIDES.map((_, index) => {
             // Dynamic styling based on active state
             const isActive = activeIndex === index;
             return (
               <View
                 key={index}
                 className={`rounded-full transition-all duration-300 ${
                   isActive ? `w-8 h-2` : `w-2 h-2 bg-gray-300`
                 }`}
                 style={isActive ? { backgroundColor: BRAND_COLOR } : {}}
               />
             );
          })}

        </View>
        {/* Primary Action Button */}
        <Button
          className="w-full h-14 rounded-xl shadow-none active:bg-primary/90"
          style={{ backgroundColor: BRAND_COLOR }} 
          onPress={handleNext}
        >
          <Text className="text-white font-bold text-lg">
            {activeIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
