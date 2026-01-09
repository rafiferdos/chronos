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
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    } else {
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = () => router.replace('/(auth)/login');

  const renderItem = useCallback(
    ({ item }: { item: OnBoardingSlide }) => (
      <View style={{ width }} className="flex-1 px-6">
        {/* 
         Senior Approach: 
         - Removed hardcoded viewBox to let the SVG use its intrinsic viewBox.
         - Used preserveAspectRatio="xMidYMid meet" to ensure the entire image is visible without cropping.
         - Flex container ensures it takes available space.
      */}
        <View className="w-full flex-1 items-center justify-center py-6">
          <item.Image
            width="100%"
            height="100%"
            preserveAspectRatio="xMidYMid meet"
            style={{ flex: 1 }}
          />
        </View>

        <View className="items-center gap-4 pb-8">
          <Text className="text-center text-3xl font-bold tracking-tight text-foreground">
            {item.title}
          </Text>
          <Text className="px-2 text-center text-lg leading-7 text-muted-foreground">
            {item.description}
          </Text>
        </View>
      </View>
    ),
    [width]
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* 1. Header Area */}
      <View className="z-10 h-14 flex-row items-center justify-end px-6">
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className={activeIndex === ONBOARDING_SLIDES.length - 1 ? 'opacity-0' : 'opacity-100'}
          disabled={activeIndex === ONBOARDING_SLIDES.length - 1}>
          <Text className="text-base font-semibold text-primary">Skip</Text>
        </TouchableOpacity>
      </View>

      {/* 2. The Carousel Engine */}
      <FlatList
        data={ONBOARDING_SLIDES}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={flatListRef}
        scrollEventThrottle={32}
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {/* 3. Footer Control Area */}
      <View className="justify-end px-6 pb-12 pt-4">
        {/* Pagination Dots */}
        <View className="mb-8 h-4 flex-row items-center justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <View
                key={index}
                className={`rounded-full ${
                  isActive ? `h-2 w-8` : `h-2 w-2 bg-muted-foreground/20`
                }`}
                style={isActive ? { backgroundColor: BRAND_COLOR } : {}}
              />
            );
          })}
        </View>

        {/* Primary Action Button */}
        <Button
          className="h-14 w-full rounded-2xl shadow-none active:opacity-90"
          style={{ backgroundColor: BRAND_COLOR }}
          onPress={handleNext}>
          <Text className="text-lg font-bold text-white">
            {activeIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
