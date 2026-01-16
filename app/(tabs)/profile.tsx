import React, { useState } from 'react';
import { View, Text, ScrollView, Image, Switch, TouchableOpacity } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Bell, 
  Edit3, 
  AlertCircle, 
  Lock, 
  FileText, 
  Users, 
  CreditCard, 
  Trash2, 
  LogOut,
  ChevronLeft,
  Crown,
  Sparkles
} from 'lucide-react-native';
import { ProfileMenuItem } from '@/components/ProfileMenuItem'; 

export default function ProfileScreen() {
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const groupMembersHref = '/(stacks)/group-members' as Href;
  const alertHref = '/(stacks)/alert' as Href;
  const deleteAccountHref = '/(stacks)/delete-account' as Href;
  const logoutHref = '/(stacks)/logout' as Href;

  return (
    <View className="flex-1 bg-gray-50/50">
      <SafeAreaView edges={['top']} className="flex-1">
        
        {/* Header */}
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
          
          {/* User Info Card */}
          <View className="items-center mb-6 mt-4">
            <View className="w-24 h-24 rounded-full bg-gray-200 mb-4 border-4 border-white shadow-sm overflow-hidden">
               <Image 
                 source={{ uri: 'https://i.pravatar.cc/300' }} 
                 className="w-full h-full"
               />
            </View>
            <Text className="text-xl font-bold text-gray-900">Emma Johnson</Text>
            <Text className="text-gray-500 text-sm">Mother</Text>
          </View>

          {/* Premium Upgrade Banner */}
          <TouchableOpacity
            className="mb-6 overflow-hidden rounded-2xl"
            onPress={() => router.push('/(stacks)/payment')}
            activeOpacity={0.9}
          >
            <LinearGradient
              colors={['#5D4037', '#8B6914', '#D4A853']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="p-5"
            >
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Crown size={20} color="#FFD700" />
                    <Text className="text-white font-bold text-lg">Upgrade to Premium</Text>
                  </View>
                  <Text className="text-white/80 text-sm">
                    Unlock unlimited features & priority support
                  </Text>
                </View>
                <View className="bg-white/20 rounded-full p-3">
                  <Sparkles size={24} color="#FFD700" />
                </View>
              </View>
              <View className="flex-row items-center gap-2 mt-4">
                <View className="bg-white/20 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-medium">Ad-Free</Text>
                </View>
                <View className="bg-white/20 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-medium">Unlimited Members</Text>
                </View>
                <View className="bg-white/20 rounded-full px-3 py-1">
                  <Text className="text-white text-xs font-medium">Analytics</Text>
                </View>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          {/* General Settings Group */}
          <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm shadow-gray-100">
            <ProfileMenuItem 
              icon={<Edit3 size={20} color="#5D4037" />} 
              label="Edit Profile" 
              onPress={() => router.push('/(stacks)/edit-profile')}
            />
            <ProfileMenuItem 
              icon={<AlertCircle size={20} color="#5D4037" />} 
              label="Alert" 
              onPress={() => router.push(alertHref)}
            />
            <ProfileMenuItem 
              icon={<Bell size={20} color="#5D4037" />} 
              label="Notification" 
              hasBorder={false}
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

          {/* Privacy & Security Group */}
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

          {/* App Settings Group */}
          <Text className="text-gray-500 font-bold mb-3 ml-2 text-xs uppercase tracking-wider">
            App
          </Text>
          <View className="bg-white rounded-2xl p-4 mb-24 shadow-sm shadow-gray-100">
            <ProfileMenuItem 
              icon={<Users size={20} color="#5D4037" />} 
              label="Group Members" 
              onPress={() => router.push(groupMembersHref)}
            />
            <ProfileMenuItem 
              icon={<CreditCard size={20} color="#5D4037" />} 
              label="Manage Subscriptions" 
              onPress={() => router.push('/(stacks)/payment')}
            />
            <ProfileMenuItem 
              icon={<Trash2 size={20} color="#5D4037" />} 
              label="Delete Account" 
              onPress={() => router.push(deleteAccountHref)}
            />
            <ProfileMenuItem 
              icon={<LogOut size={20} color="#EF4444" />} 
              label="Log Out" 
              isDestructive
              hasBorder={false}
              onPress={() => router.push(logoutHref)}
            />
          </View>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
