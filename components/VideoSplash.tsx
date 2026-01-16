import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { useEvent } from 'expo';
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
  const hasFinishedRef = useRef(false);

  // Create video player with expo-video
  const player = useVideoPlayer(require('@/assets/videos/splash.mp4'), (player) => {
    player.loop = false;
    player.play();
  });

  // Listen for playback status changes
  const { status } = useEvent(player, 'statusChange', { status: player.status });

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

  // Handle video status changes
  useEffect(() => {
    if (status === 'readyToPlay' && !isReady) {
      setIsReady(true);
    }
    
    // When video finishes playing (status becomes 'idle' after playing)
    if (status === 'idle' && isReady && shouldShowVideo && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      onFinish();
    }
    
    // Handle error
    if (status === 'error' && !hasFinishedRef.current) {
      hasFinishedRef.current = true;
      console.log('Video splash error, proceeding to app');
      SplashScreen.hideAsync();
      onFinish();
    }
  }, [status, isReady, shouldShowVideo, onFinish]);

  useEffect(() => {
    // Hide the native splash screen once our video component is ready
    if (isReady && shouldShowVideo) {
      SplashScreen.hideAsync();
    }
  }, [isReady, shouldShowVideo]);

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
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
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
