import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, TriangleAlert } from 'lucide-react-native';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const DELETE_TOKEN = 'DELETE';

export default function DeleteAccountScreen() {
  const router = useRouter();
  const [acknowledged, setAcknowledged] = useState(false);
  const [confirmText, setConfirmText] = useState('');

  const canDelete = useMemo(() => {
    return acknowledged && confirmText.trim().toUpperCase() === DELETE_TOKEN;
  }, [acknowledged, confirmText]);

  return (
    <View className="flex-1 bg-gray-50/50">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-3">
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Delete Account</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="bg-white rounded-2xl p-5 shadow-sm shadow-gray-100">
            <View className="flex-row items-center gap-3 mb-4">
              <View className="w-11 h-11 rounded-full bg-red-50 items-center justify-center">
                <TriangleAlert size={20} color="#EF4444" />
              </View>
              <View>
                <Text className="text-base font-semibold text-gray-900">This action is permanent</Text>
                <Text className="text-xs text-gray-500">
                  Your events, schedules, and settings will be removed.
                </Text>
              </View>
            </View>

            <View className="rounded-xl bg-gray-50 px-4 py-3 mb-4">
              <Text className="text-xs text-gray-600">
                If you change your mind later, you&apos;ll need to create a new account.
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setAcknowledged(!acknowledged)}
              className="flex-row items-center gap-3 mb-4"
            >
              <View
                className={cn(
                  'h-5 w-5 rounded border items-center justify-center',
                  acknowledged ? 'bg-[#5D4037] border-[#5D4037]' : 'border-gray-300'
                )}
              >
                {acknowledged ? <View className="h-2 w-2 rounded-sm bg-white" /> : null}
              </View>
              <Text className="text-sm text-gray-600">
                I understand this action can&apos;t be undone.
              </Text>
            </TouchableOpacity>

            <View className="gap-2">
              <Text className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Type DELETE to confirm
              </Text>
              <TextInput
                value={confirmText}
                onChangeText={setConfirmText}
                autoCapitalize="characters"
                placeholder="DELETE"
                className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 text-base"
              />
            </View>
          </View>

          <View className="mt-6 mb-10">
            <Button
              className={cn(
                'h-14 rounded-2xl',
                canDelete ? 'bg-[#EF4444]' : 'bg-[#EF4444]/50'
              )}
              disabled={!canDelete}
              onPress={() => router.replace('/(auth)/login')}
            >
              <Text className="text-white font-bold text-lg">Delete my account</Text>
            </Button>

            <TouchableOpacity onPress={() => router.back()} className="mt-4">
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
