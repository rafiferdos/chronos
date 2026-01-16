import React from 'react';
import { View, Text, TouchableOpacity, Switch } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils';


interface ProfileMenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  isDestructive?: boolean; // For "Log Out" red text
  rightElement?: React.ReactNode; // Custom element (like a Switch)
  hasBorder?: boolean; // Toggle bottom border
}

export function ProfileMenuItem({ 
  icon, 
  label, 
  onPress, 
  isDestructive, 
  rightElement,
  hasBorder = true
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={onPress ? 0.7 : 1}
      className={cn(
        "flex-row items-center justify-between py-4",
        hasBorder && "border-b border-gray-50"
      )}
    >
      <View className="flex-row items-center gap-4">
        {/* Icon Wrapper */}
        <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
          {icon}
        </View>
        
        {/* Label */}
        <Text className={cn(
          "text-base font-medium",
          isDestructive ? "text-red-500" : "text-gray-900"
        )}>
          {label}
        </Text>
      </View>

      {/* Right Side (Chevron or Switch) */}
      <View>
        {rightElement ? (
          rightElement
        ) : (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );
}