import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Camera } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function EditProfileScreen() {
  const router = useRouter();

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
          <Text className="text-xl font-bold text-black">Profile</Text>
          <TouchableOpacity className="w-10 h-10 bg-gray-50 rounded-full justify-center items-center">
            <Bell size={20} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6">
          
          {/* Avatar Upload Section */}
          <View className="items-center mb-10 mt-4">
             <View className="relative">
                <View className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-sm overflow-hidden">
                   <Image 
                     source={{ uri: 'https://i.pravatar.cc/300' }} 
                     className="w-full h-full"
                   />
                </View>
                {/* Camera Overlay Button */}
                <TouchableOpacity className="absolute bottom-0 right-0 bg-[#5D4037] w-9 h-9 rounded-full items-center justify-center border-2 border-white">
                   <Camera size={16} color="white" />
                </TouchableOpacity>
             </View>
          </View>

          {/* Form Fields */}
          <View className="gap-6">
            
            <View className="gap-2">
               <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Name</Text>
               <Input
                 defaultValue="Emma Johnson" 
                 className="h-14 bg-gray-50 border-gray-100"
               />
            </View>

            <View className="gap-2">
               <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Relation</Text>
               <Input 
                 defaultValue="Mother" 
                 className="h-14 bg-gray-50 border-gray-100"
               />
            </View>

            <View className="gap-2">
               <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Email</Text>
               <Input 
                 defaultValue="gt_tbb@hotmail.com" 
                 className="h-14 bg-gray-50 border-gray-100 text-gray-500"
                 editable={false} // Often emails are not editable easily
               />
            </View>

            {/* Save Button */}
            <Button
               className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-8" 
               onPress={() => router.back()}
            >
               <Text className="text-white font-bold text-lg">Save Changes</Text>
            </Button>

          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}