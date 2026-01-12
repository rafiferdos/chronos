import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { Menu, User } from 'lucide-react-native';
import React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-background">
      {/* Custom Header */}
      <View className="flex-row items-center justify-between px-6 py-4 border-b border-border/50">
        <Text className="text-2xl font-bold text-foreground">Home</Text>
        
        <Button variant="ghost" size="icon" className="rounded-full">
           <User size={24} color="#5D4037" />
        </Button>
      </View>

      <View className="flex-1 items-center justify-center gap-6 p-6">
        <Text className="text-xl font-medium text-foreground">
          Welcome, {user?.email || 'Guest'}!
        </Text>
        
        <Text className="text-center text-muted-foreground">
          You are now logged in. This is the authenticated home screen.
        </Text>

        <Button 
          className="w-full bg-[#5D4037]" 
          onPress={signOut}
        >
          <Text className="text-white font-bold">Sign Out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}
