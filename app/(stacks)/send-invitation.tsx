import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Plus } from 'lucide-react-native';
import { Input } from '@/components/ui/input';  
import { Button } from '@/components/ui/button';  

export default function SendInvitationScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
        <View className="px-5 py-2 flex-row items-center mb-6">
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center"
          >
            <ArrowLeft size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6">
           
           <View className="flex-row items-center gap-2 mb-8">
              <Plus size={24} color="black" />
              <Text className="text-xl font-bold text-black">Add Group Members</Text>
           </View>

           {/* Form Fields */}
           <View className="gap-6">
              
              <View className="gap-2">
                 <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Name</Text>
                 <Input placeholder="Emma Johnson" className="h-14 bg-gray-50 border-gray-100" />
              </View>

              <View className="gap-2">
                 <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Email</Text>
                 <Input placeholder="gt_tbb@gmail.com" keyboardType="email-address" className="h-14 bg-gray-50 border-gray-100" />
              </View>

              <View className="gap-2">
                 <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Password</Text>
                 <Input placeholder="*************" secureTextEntry className="h-14 bg-gray-50 border-gray-100" />
              </View>

              <Button 
                 className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-6"
                 onPress={() => router.back()} // In real app, this sends API request
              >
                 <Text className="text-white font-bold text-lg">Send Invitation</Text>
              </Button>

           </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}