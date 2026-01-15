import { Tabs, useRouter } from 'expo-router';
import { Calendar, Plus, User } from 'lucide-react-native';
import { Platform, TouchableOpacity, View } from 'react-native';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#5D4037',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingTop: 10,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          backgroundColor: 'white',
          borderTopWidth: 0,
          elevation: 0,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => <Calendar size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: '',
          tabBarButton: (props) => (
            <TouchableOpacity
              className="-top-7 items-center justify-center"
              onPress={() => router.push('/(stacks)/create-event')}
              activeOpacity={0.9}>
              <View className="h-14 w-14 items-center justify-center rounded-full bg-[#5D4037] shadow-lg shadow-black/30">
                <Plus size={28} color="white" />
              </View>
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
