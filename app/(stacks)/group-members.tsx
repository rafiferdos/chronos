import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Trash2 } from 'lucide-react-native';
import { Button } from '@/components/ui/button';  

// Mock Data
const MEMBERS = [
  { id: 1, name: 'Sarah Mitchell', email: 'sarahmit@gmail.com', img: 'https://i.pravatar.cc/150?u=1' },
  { id: 2, name: 'John Doe', email: 'johndoe@gmail.com', img: 'https://i.pravatar.cc/150?u=2' },
  { id: 3, name: 'Emma Watson', email: 'emma@gmail.com', img: 'https://i.pravatar.cc/150?u=3' },
];

export default function GroupMembersScreen() {
  const router = useRouter();
  const invitationHref = '/(stacks)/send-invitation' as Href;

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-2 flex-row justify-between items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
          {/* Right Icon spacer or Bell */}
          <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center">
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        <View className="px-6 mb-6">
           <Text className="text-xl font-bold text-black mb-2">Manage Members</Text>
           <Text className="text-gray-500 text-sm">View and manage who can see your family events.</Text>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
           <View className="gap-4">
              {MEMBERS.map((member) => (
                 <View key={member.id} className="flex-row items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
                    <View className="flex-row items-center gap-3">
                       <Image 
                          source={{ uri: member.img }} 
                          className="w-12 h-12 rounded-full bg-gray-200"
                       />
                       <View>
                          <Text className="font-bold text-black text-base">{member.name}</Text>
                          <Text className="text-gray-400 text-xs">{member.email}</Text>
                       </View>
                    </View>
                    <TouchableOpacity className="p-2">
                       <Trash2 size={18} color="#F87171" />
                    </TouchableOpacity>
                 </View>
              ))}
           </View>
        </ScrollView>

        {/* Bottom Button */}
        <View className="p-6 border-t border-gray-100">
           <Button 
              className="bg-[#5D4037] h-14 rounded-2xl shadow-sm"
              onPress={() => router.push(invitationHref)}
           >
              <Text className="text-white font-bold text-lg">Add Group Members</Text>
           </Button>
        </View>

      </SafeAreaView>
    </View>
  );
}