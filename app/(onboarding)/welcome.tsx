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

  const renderItem = useCallback(
    ({ item }: { item: OnBoardingSlide }) => (
      <View style={{ width }} className="items-center justify-center px-6">
        {/* Image Container */}
        <View className="mb-10 h-[50%] w-full items-center justify-center">
          <item.Image width={width * 0.85} height={width * 0.85} />
        </View>

        <View className="items-center gap-4">
          <Text className="text-center text-3xl font-bold tracking-tight text-foreground">
            {item.title}
          </Text>
          <Text className="px-4 text-center text-lg leading-7 text-muted-foreground">
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
      <View className="h-16 flex-row items-center justify-end px-6">
        <TouchableOpacity
          onPress={handleSkip}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className={activeIndex === ONBOARDING_SLIDES.length - 1 ? 'opacity-0' : 'opacity-100'}
          disabled={activeIndex === ONBOARDING_SLIDES.length - 1}>
          <Text className="text-base font-medium text-muted-foreground">Skip</Text>
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
      />

      {/* 3. Footer Control Area */}
      <View className="px-6 pb-8 pt-4">
        {/* Pagination Dots */}
        <View className="mb-8 h-4 flex-row items-center justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, index) => {
            const isActive = activeIndex === index;
            return (
              <View
                key={index}
                className={`rounded-full ${
                  isActive ? `h-2 w-8` : `h-2 w-2 bg-muted-foreground/30`
                }`}
                style={isActive ? { backgroundColor: BRAND_COLOR } : {}}
              />
            );
          })}
        </View>

        {/* Primary Action Button */}
        <Button
          className="h-14 w-full rounded-xl shadow-sm active:opacity-90"
          style={{ backgroundColor: BRAND_COLOR }}
          onPress={handleNext}>
          <Text className="text-lg font-semibold text-white">
            {activeIndex === ONBOARDING_SLIDES.length - 1 ? 'Get Started' : 'Next'}
          </Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
