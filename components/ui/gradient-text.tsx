import { cn } from '@/lib/utils';
import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Platform, Text } from 'react-native';

type GradientTextProps = React.ComponentProps<typeof Text> & {
  colors?: string[];
};

export function GradientText({
  children,
  className,
  colors = ['#4f46e5', '#dc2626'],
  ...props
}: GradientTextProps) {
  if (Platform.OS === 'web') {
    return (
      <Text
        className={cn('text-transparent bg-clip-text bg-gradient-to-r', className)}
        {...props}
      >
        {children}
      </Text>
    );
  }

  return (
    <MaskedView
      maskElement={
        <Text className={className} {...props}>
          {children}
        </Text>
      }
    >
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text className={cn(className, 'opacity-0')} {...props}>
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
}
