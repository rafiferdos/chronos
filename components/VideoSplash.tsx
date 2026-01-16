import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Keep the splash screen visible while we load
SplashScreen.preventAutoHideAsync();

const ONBOARDING_COMPLETED_KEY = 'chronos_onboarding_completed';

interface VideoSplashProps {
  onFinish: () => void;
  onSkip: () => void; // Called when user has already seen onboarding
}

const { width, height } = Dimensions.get('window');

export function VideoSplash({ onFinish, onSkip }: VideoSplashProps) {
  const [isReady, setIsReady] = useState(false);
  const [shouldShowVideo, setShouldShowVideo] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if user has already completed onboarding
    const checkOnboardingStatus = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
        if (completed === 'true') {
          // User has seen onboarding before, skip video
          SplashScreen.hideAsync();
          onSkip();
        } else {
          // New user, show video
          setShouldShowVideo(true);
        }
      } catch (error) {
        console.error('Error checking onboarding status', error);
        setShouldShowVideo(true);
      }
    };

    checkOnboardingStatus();
  }, [onSkip]);

  useEffect(() => {
    // Hide the native splash screen once our video component is ready
    if (isReady && shouldShowVideo) {
      SplashScreen.hideAsync();
    }
  }, [isReady, shouldShowVideo]);

  const onPlaybackStatusUpdate = useCallback((status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (!isReady) {
        setIsReady(true);
      }
      
      // When video finishes playing
      if (status.didJustFinish) {
        onFinish();
      }
    }
  }, [isReady, onFinish]);

  const onError = useCallback(() => {
    // If video fails to load, just proceed to onboarding
    console.log('Video splash error, proceeding to app');
    SplashScreen.hideAsync();
    onFinish();
  }, [onFinish]);

  // Still checking onboarding status
  if (shouldShowVideo === null) {
    return <View style={styles.container} />;
  }

  // User has completed onboarding, component will unmount via onSkip
  if (!shouldShowVideo) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <Video
        source={require('@/assets/videos/splash.mp4')}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={onPlaybackStatusUpdate}
        onError={onError}
      />
    </View>
  );
}

// Helper function to mark onboarding as completed
export async function markOnboardingCompleted() {
  try {
    await AsyncStorage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch (error) {
    console.error('Error marking onboarding completed', error);
  }
}

// Helper function to check if onboarding is completed (for use elsewhere)
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    const completed = await AsyncStorage.getItem(ONBOARDING_COMPLETED_KEY);
    return completed === 'true';
  } catch (error) {
    return false;
  }
}

// Helper function to reset onboarding (for testing)
export async function resetOnboarding() {
  try {
    await AsyncStorage.removeItem(ONBOARDING_COMPLETED_KEY);
  } catch (error) {
    console.error('Error resetting onboarding', error);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: width,
    height: height,
    position: 'absolute',
  },
});
