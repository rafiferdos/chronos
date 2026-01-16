import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Clock, TriangleAlert } from 'lucide-react-native';

export default function AlertScreen() {
  const router = useRouter();
  const [eventReminders, setEventReminders] = useState(true);
  const [scheduleChanges, setScheduleChanges] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);
  const [quietHours, setQuietHours] = useState(false);

  return (
    <View className="flex-1 bg-gray-50/50">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Alerts</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm shadow-gray-100">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 rounded-full bg-[#5D4037]/10 items-center justify-center">
                <Bell size={18} color="#5D4037" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">Notification alerts</Text>
                <Text className="text-xs text-gray-500">Choose what you want to be notified about</Text>
              </View>
            </View>

            <View className="gap-4">
              <SettingRow
                label="Event reminders"
                description="Get notified before events start"
                value={eventReminders}
                onChange={setEventReminders}
              />
              <SettingRow
                label="Schedule changes"
                description="Alerts when events move or update"
                value={scheduleChanges}
                onChange={setScheduleChanges}
              />
              <SettingRow
                label="Daily summary"
                description="Morning overview of your day"
                value={dailySummary}
                onChange={setDailySummary}
              />
            </View>
          </View>

          <View className="bg-white rounded-2xl p-4 mb-10 shadow-sm shadow-gray-100">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-10 h-10 rounded-full bg-[#5D4037]/10 items-center justify-center">
                <Clock size={18} color="#5D4037" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">Quiet hours</Text>
                <Text className="text-xs text-gray-500">Pause alerts during rest time</Text>
              </View>
            </View>

            <SettingRow
              label="Enable quiet hours"
              description="Mute notifications from 10 PM to 7 AM"
              value={quietHours}
              onChange={setQuietHours}
            />

            {quietHours ? (
              <View className="mt-4 rounded-xl bg-[#F9F6F3] px-4 py-3">
                <View className="flex-row items-center gap-2">
                  <TriangleAlert size={14} color="#5D4037" />
                  <Text className="text-xs text-gray-600">
                    Quiet hours are active. Priority alerts will still come through.
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function SettingRow({
  label,
  description,
  value,
  onChange,
}: {
  label: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="pr-4">
        <Text className="text-sm font-medium text-gray-900">{label}</Text>
        <Text className="text-xs text-gray-500 mt-1">{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: '#D1D5DB', true: '#5D4037' }}
        thumbColor="#fff"
      />
    </View>
  );
}
