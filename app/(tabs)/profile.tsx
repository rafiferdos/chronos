import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Switch, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Bell, 
  User, 
  Edit3, 
  AlertCircle, 
  Lock, 
  FileText, 
  Users, 
  CreditCard, 
  Trash2, 
  LogOut,
  ChevronLeft
} from 'lucide-react-native';
import { ProfileMenuItem } from '@/components/ProfileMenuItem'; 

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <View className="flex-1 bg-gray-50/50">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* 1. Header */}
        <View className="px-6 py-4 flex-row justify-between items-center">
          <TouchableOpacity onPress={() => router.back()}>
            <ChevronLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-black">Profile</Text>
          <TouchableOpacity onPress={() => router.push('/(stacks)/notifications')}>
             <Bell size={24} color="black" />
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          
          {/* 2. User Info Card */}
          <View className="items-center mb-8 mt-4">
            <View className="w-24 h-24 rounded-full bg-gray-200 mb-4 border-4 border-white shadow-sm overflow-hidden">
               {/* Placeholder Image - Replace with real URI later */}
               <Image 
                 source={{ uri: 'https://i.pravatar.cc/300' }} 
                 className="w-full h-full"
               />
            </View>
            <Text className="text-xl font-bold text-gray-900">Emma Johnson</Text>
            <Text className="text-gray-500 text-sm">Mother</Text>
          </View>

          {/* 3. General Settings Group */}
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm shadow-gray-100">
            <ProfileMenuItem 
              icon={<Edit3 size={20} color="#5D4037" />} 
              label="Edit Profile" 
              onPress={() => router.push('/(stacks)/edit-profile')}
            />
            <ProfileMenuItem 
              icon={<AlertCircle size={20} color="#5D4037" />} 
              label="Alert" 
              onPress={() => {}}
            />
            <ProfileMenuItem 
              icon={<Bell size={20} color="#5D4037" />} 
              label="Notification" 
              hasBorder={false}
              // Custom Switch element overrides the chevron
              rightElement={
                <Switch 
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: '#767577', true: '#5D4037' }}
                  thumbColor={'#fff'}
                />
              }
            />
          </View>

          {/* 4. Privacy & Security Group */}
          <Text className="text-gray-500 font-bold mb-3 ml-2 text-xs uppercase tracking-wider">
            Privacy & Security
          </Text>
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm shadow-gray-100">
            <ProfileMenuItem 
              icon={<FileText size={20} color="#5D4037" />} 
              label="Privacy Policy" 
              onPress={() => router.push('/(stacks)/privacy')}
            />
            <ProfileMenuItem 
              icon={<Lock size={20} color="#5D4037" />} 
              label="Change Password" 
              onPress={() => router.push('/(auth)/change-password')}
            />
            <ProfileMenuItem 
              icon={<FileText size={20} color="#5D4037" />} 
              label="Terms & Condition" 
              hasBorder={false}
              onPress={() => router.push('/(stacks)/terms')}
            />
          </View>

          {/* 5. App Settings Group */}
          <Text className="text-gray-500 font-bold mb-3 ml-2 text-xs uppercase tracking-wider">
            App
          </Text>
          <View className="bg-white rounded-2xl p-4 mb-24 shadow-sm shadow-gray-100">
            <ProfileMenuItem 
              icon={<Users size={20} color="#5D4037" />} 
              label="Group Members" 
              onPress={() => {}}
            />
            <ProfileMenuItem 
              icon={<CreditCard size={20} color="#5D4037" />} 
              label="Manage Subscriptions" 
              onPress={() => router.push('/(stacks)/payment')}
            />
            <ProfileMenuItem 
              icon={<Trash2 size={20} color="#5D4037" />} 
              label="Delete Account" 
              onPress={() => {}}
            />
            <ProfileMenuItem 
              icon={<LogOut size={20} color="#EF4444" />} 
              label="Log Out" 
              isDestructive
              hasBorder={false}
              onPress={() => router.replace('/(auth)/login')}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}