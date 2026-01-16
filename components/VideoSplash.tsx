import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we load the video
SplashScreen.preventAutoHideAsync();

interface VideoSplashProps {
  onFinish: () => void;
}

const { width, height } = Dimensions.get('window');

export function VideoSplash({ onFinish }: VideoSplashProps) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Hide the native splash screen once our video component is ready
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

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
    // If video fails to load, just proceed to the app
    console.log('Video splash error, proceeding to app');
    SplashScreen.hideAsync();
    onFinish();
  }, [onFinish]);

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
