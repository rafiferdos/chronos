import { View, Text } from 'react-native';
import { Button } from '@/components/ui/button';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();

  return (
    <View className="flex-1 items-center justify-center bg-white gap-5">
      <Text className="text-2xl font-bold text-gray-800">Welcome to Chronos</Text>
      
      <Button 
        onPress={() => router.push('/(onboarding)/welcome')}
        className="w-48 bg-[#5D4037]"
      >
        <Text className="text-white font-bold">Go to Onboarding</Text>
      </Button>

      <Button 
        onPress={() => router.push('/(auth)/login')}
        className="w-48 bg-gray-600"
      >
        <Text className="text-white font-bold">Go to Login</Text>
      </Button>
    </View>
  );
}
