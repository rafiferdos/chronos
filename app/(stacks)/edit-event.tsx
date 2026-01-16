import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Calendar, Clock, ChevronDown, AlignLeft } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const REMINDER_OPTIONS = ['5 minutes before', '15 minutes before', '30 minutes before', '1 hour before'];
const REPEAT_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Annually'];
const MEMBER_OPTIONS = ['Jenny Wilson', 'Guy Hawkins', 'Jacob Jones', 'Cody Fisher', 'Ralph Edwards'];

export default function EditEventScreen() {
  const router = useRouter();
  const [isMeAssigned, setIsMeAssigned] = useState(true);
  const [reminders, setReminders] = useState(['5 minutes before', '5 minutes before']);
  const [showReminderIndex, setShowReminderIndex] = useState<number | null>(null);
  const [repeatValue, setRepeatValue] = useState('Daily');
  const [showRepeat, setShowRepeat] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<string[]>(['Jenny Wilson']);

  const memberSummary = useMemo(() => {
    if (selectedMembers.length === 0) return 'People who can see the event';
    if (selectedMembers.length === 1) return selectedMembers[0];
    return `${selectedMembers[0]} +${selectedMembers.length - 1}`;
  }, [selectedMembers]);

  const toggleMember = (name: string) => {
    setSelectedMembers((prev) => {
      if (prev.includes(name)) {
        return prev.filter((member) => member !== name);
      }
      return [...prev, name];
    });
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        {/* Header */}
        <View className="px-5 py-2 flex-row justify-between items-center mb-4">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Event</Text>
          <TouchableOpacity
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
            onPress={() => router.push('/(stacks)/notifications')}
          >
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-black mb-1">Edit New Event</Text>
            <Text className="text-gray-400 text-sm">Plan and organize your day easily</Text>
          </View>

          <View className="gap-5 pb-24">
            <View className="gap-2">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">Event Title</Text>
              <Input defaultValue="Ballet Class" className="bg-gray-50 border-gray-100 h-14" />
            </View>

            <View className="gap-3">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">Start Event</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3">
                  <Calendar size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-900 font-medium">Oct 28th</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3">
                  <Clock size={18} color="#F59E0B" />
                  <Text className="ml-2 text-gray-900 font-medium">10.00</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-3">
              <Text className="text-[#F87171] font-bold text-xs uppercase tracking-wide">End Event</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3">
                  <Calendar size={18} color="#9CA3AF" />
                  <Text className="ml-2 text-gray-900 font-medium">Oct 28th</Text>
                </TouchableOpacity>
                <TouchableOpacity className="flex-1 flex-row items-center bg-gray-50 border border-gray-100 h-14 rounded-xl px-3">
                  <Clock size={18} color="#F59E0B" />
                  <Text className="ml-2 text-gray-900 font-medium">10.00</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-2">
              <Text className="text-gray-500 font-medium text-sm">Include in Schedule</Text>
              <TouchableOpacity
                className="flex-row items-center justify-between bg-gray-50 border border-gray-100 h-14 rounded-xl px-3"
                onPress={() => setShowMembers((prev) => !prev)}
              >
                <Text className="text-gray-500">{memberSummary}</Text>
                <ChevronDown size={18} color="#9CA3AF" />
              </TouchableOpacity>
              {showMembers ? (
                <View className="rounded-xl border border-gray-100 bg-white p-3">
                  {MEMBER_OPTIONS.map((member) => {
                    const checked = selectedMembers.includes(member);
                    return (
                      <TouchableOpacity
                        key={member}
                        className="flex-row items-center justify-between py-2"
                        onPress={() => toggleMember(member)}
                      >
                        <Text className="text-gray-700 text-sm">{member}</Text>
                        <View
                          className={cn(
                            'h-4 w-4 rounded border items-center justify-center',
                            checked ? 'bg-[#5D4037] border-[#5D4037]' : 'border-gray-300'
                          )}
                        >
                          {checked ? <View className="h-2 w-2 bg-white rounded-sm" /> : null}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            <View className="gap-3">
              {reminders.map((value, index) => (
                <View key={`${value}-${index}`} className="gap-2">
                  <TouchableOpacity
                    className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-4"
                    onPress={() => setShowReminderIndex(showReminderIndex === index ? null : index)}
                  >
                    <View className="flex-row items-center gap-3">
                      <Bell size={18} color="#5D4037" />
                      <Text className="text-gray-700 font-medium">Set reminder</Text>
                    </View>
                    <ChevronDown size={18} color="#9CA3AF" />
                  </TouchableOpacity>
                  <View className="flex-row items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                    <Text className="text-sm text-gray-600">{value}</Text>
                    <ChevronDown size={16} color="#9CA3AF" />
                  </View>
                  {showReminderIndex === index ? (
                    <View className="rounded-xl border border-gray-100 bg-white p-3">
                      {REMINDER_OPTIONS.map((option) => (
                        <TouchableOpacity
                          key={option}
                          className="py-2"
                          onPress={() => {
                            setReminders((prev) =>
                              prev.map((item, idx) => (idx === index ? option : item))
                            );
                            setShowReminderIndex(null);
                          }}
                        >
                          <Text className="text-sm text-gray-700">{option}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>

            <View className="gap-2">
              <TouchableOpacity
                className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-4"
                onPress={() => setShowRepeat((prev) => !prev)}
              >
                <View className="flex-row items-center gap-3">
                  <Clock size={18} color="#5D4037" />
                  <Text className="text-gray-700 font-medium">Recurring</Text>
                </View>
                <ChevronDown size={18} color="#9CA3AF" />
              </TouchableOpacity>
              <View className="flex-row items-center justify-between bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
                <Text className="text-sm text-gray-600">{repeatValue}</Text>
                <ChevronDown size={16} color="#9CA3AF" />
              </View>
              {showRepeat ? (
                <View className="rounded-xl border border-gray-100 bg-white p-3">
                  {REPEAT_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option}
                      className="py-2"
                      onPress={() => {
                        setRepeatValue(option);
                        setShowRepeat(false);
                      }}
                    >
                      <Text className="text-sm text-gray-700">{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}
            </View>

            <TouchableOpacity 
              className="flex-row items-center gap-3 mt-1"
              onPress={() => setIsMeAssigned(!isMeAssigned)}
            >
              <View className={cn(
                "w-5 h-5 rounded border items-center justify-center",
                isMeAssigned ? "bg-[#5D4037] border-[#5D4037]" : "border-gray-300"
              )}>
                {isMeAssigned && <View className="w-2 h-2 bg-white rounded-sm" />}
              </View>
              <Text className="text-gray-600 font-medium">Assign this event to me as well</Text>
            </TouchableOpacity>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <AlignLeft size={16} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-sm">Note</Text>
              </View>
              <TextInput 
                multiline
                numberOfLines={4}
                placeholder="I have a meeting at 4pm, can you take Emma to her ballet class today?"
                textAlignVertical="top"
                className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-base min-h-[120px]"
              />
            </View>

            <View className="flex-row gap-3">
              <Button 
                className="bg-[#5D4037] h-14 rounded-2xl shadow-sm flex-1" 
                onPress={() => router.back()}
              >
                <Text className="text-white font-bold text-lg">Save</Text>
              </Button>
              <Button
                variant="outline"
                className="h-14 rounded-2xl flex-1 border-gray-200"
                onPress={() => router.back()}
              >
                <Text className="text-gray-600 font-bold text-lg">Cancel</Text>
              </Button>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
