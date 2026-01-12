import { cn } from '@/lib/utils';
import React, { ReactNode } from 'react';
import { Platform, TextInput, TouchableOpacity, View, type TextInputProps } from 'react-native';

export interface InputProps extends TextInputProps {
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  onEndIconPress?: () => void;
}

const Input = React.forwardRef<TextInput, InputProps>(
  ({ className, startIcon, endIcon, onEndIconPress, ...props }, ref) => {
    return (
      <View
        className={cn(
          'flex h-14 w-full flex-row items-center gap-2 rounded-xl border border-input bg-background px-3 shadow-sm shadow-black/5 dark:bg-input/30',
          props.editable === false && 'opacity-50',
          className
        )}>
        {startIcon && <View>{startIcon}</View>}

        <TextInput
          ref={ref}
          className={cn(
            'h-full flex-1 text-base leading-5 text-foreground',
            Platform.select({
              web: 'outline-none selection:bg-primary placeholder:text-muted-foreground',
              native: 'placeholder:text-muted-foreground/50',
            })
          )}
          placeholderTextColor={Platform.select({ ios: undefined, default: '#6b7280' })}
          {...props}
        />

        {endIcon &&
          (onEndIconPress ? (
            <TouchableOpacity onPress={onEndIconPress}>{endIcon}</TouchableOpacity>
          ) : (
            <View>{endIcon}</View>
          ))}
      </View>
    );
  }
);

Input.displayName = 'Input';

export { Input };
