import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, CheckCircle2 } from 'lucide-react-native';

const NOTIFICATIONS = [
  {
    id: '1',
    title: 'Event reminder',
    message: 'Ballet Class starts at 4:30 PM.',
    time: 'Just now',
    icon: Calendar,
    accent: '#5D4037',
    unread: true,
  },
  {
    id: '2',
    title: 'Schedule updated',
    message: 'Family Dinner moved to 6:30 PM.',
    time: '1h ago',
    icon: Bell,
    accent: '#8B5CF6',
    unread: true,
  },
  {
    id: '3',
    title: 'Task completed',
    message: 'Doctor Appointment marked as done.',
    time: 'Yesterday',
    icon: CheckCircle2,
    accent: '#16A34A',
    unread: false,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-5 py-2 flex-row items-center mb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center mr-3"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Notifications</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="gap-4 pb-8">
            {NOTIFICATIONS.map((item) => {
              const Icon = item.icon;
              return (
                <View
                  key={item.id}
                  className={`rounded-2xl border p-4 ${item.unread ? 'border-[#5D4037]/20 bg-[#F9F6F3]' : 'border-gray-100 bg-white'}`}
                >
                  <View className="flex-row items-start gap-3">
                    <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                      <Icon size={18} color={item.accent} />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-gray-900 font-semibold">{item.title}</Text>
                        <Text className="text-gray-400 text-xs">{item.time}</Text>
                      </View>
                      <Text className="text-gray-600 text-sm mt-1">{item.message}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
