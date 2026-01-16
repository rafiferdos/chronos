import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, Modal, FlatList, Alert, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Camera, User, Mail, Phone, Calendar, MapPin, Heart, AlertCircle, FileText, ChevronDown, ImageIcon, X } from 'lucide-react-native';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUser } from '@/context/UserContext';
import { format } from 'date-fns';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';

const RELATION_OPTIONS = ['Mother', 'Father', 'Guardian', 'Grandparent', 'Sibling', 'Caregiver', 'Other'];

const AVATAR_OPTIONS = [
  'https://i.pravatar.cc/300?img=1',
  'https://i.pravatar.cc/300?img=5',
  'https://i.pravatar.cc/300?img=9',
  'https://i.pravatar.cc/300?img=10',
  'https://i.pravatar.cc/300?img=16',
  'https://i.pravatar.cc/300?img=20',
  'https://i.pravatar.cc/300?img=25',
  'https://i.pravatar.cc/300?img=32',
  'https://i.pravatar.cc/300?img=33',
  'https://i.pravatar.cc/300?img=36',
  'https://i.pravatar.cc/300?img=41',
  'https://i.pravatar.cc/300?img=47',
];

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, isLoading: userLoading, updateUser } = useUser();

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [relation, setRelation] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  // UI state
  const [isSaving, setIsSaving] = useState(false);
  const [showRelationPicker, setShowRelationPicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showImageSourcePicker, setShowImageSourcePicker] = useState(false);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setRelation(user.relation || '');
      setPhone(user.phone || '');
      setDateOfBirth(user.dateOfBirth || '');
      setBio(user.bio || '');
      setAddress(user.address || '');
      setEmergencyContact(user.emergencyContact || '');
      setEmergencyPhone(user.emergencyPhone || '');
      setAvatarUrl(user.avatarUrl || '');
    }
  }, [user]);

  // Generate date options (past 100 years)
  const dateOptions = React.useMemo(() => {
    const options = [];
    const today = new Date();
    for (let year = today.getFullYear() - 18; year >= today.getFullYear() - 100; year--) {
      for (let month = 0; month < 12; month++) {
        const date = new Date(year, month, 15);
        options.push({
          value: format(date, 'yyyy-MM-dd'),
          label: format(date, 'MMMM yyyy'),
        });
      }
    }
    return options;
  }, []);

  // Request camera permissions
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Camera permission is needed to take photos. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Request media library permissions
  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Photo library permission is needed to select images. Please enable it in settings.',
        [{ text: 'OK' }]
      );
      return false;
    }
    return true;
  };

  // Take photo with camera
  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUrl(result.assets[0].uri);
        setShowImageSourcePicker(false);
        Toast.show({ type: 'success', text1: 'Photo captured', text2: 'Your new photo has been set' });
      }
    } catch (error) {
      console.error('Error taking photo:', error);
      Toast.show({ type: 'error', text1: 'Camera error', text2: 'Failed to take photo' });
    }
  };

  // Pick image from gallery
  const pickImage = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarUrl(result.assets[0].uri);
        setShowImageSourcePicker(false);
        Toast.show({ type: 'success', text1: 'Photo selected', text2: 'Your new photo has been set' });
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Toast.show({ type: 'error', text1: 'Gallery error', text2: 'Failed to select image' });
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Toast.show({ type: 'error', text1: 'Name required', text2: 'Please enter your name' });
      return;
    }

    setIsSaving(true);
    try {
      await updateUser({
        name: name.trim(),
        email: email.trim(),
        relation: relation.trim(),
        phone: phone.trim(),
        dateOfBirth,
        bio: bio.trim(),
        address: address.trim(),
        emergencyContact: emergencyContact.trim(),
        emergencyPhone: emergencyPhone.trim(),
        avatarUrl,
      });

      Toast.show({ type: 'success', text1: 'Profile updated', text2: 'Your changes have been saved' });
      router.back();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Failed to save', text2: 'Please try again' });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return 'Select date of birth';
    try {
      return format(new Date(dateStr), 'MMMM d, yyyy');
    } catch {
      return dateStr;
    }
  };

  if (userLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#5D4037" />
        <Text className="text-gray-500 mt-4">Loading profile...</Text>
      </View>
    );
  }

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
          <Text className="text-xl font-bold text-black">Edit Profile</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
          
          {/* Avatar Upload Section */}
          <View className="items-center mb-8 mt-2">
            <TouchableOpacity 
              className="relative"
              onPress={() => setShowImageSourcePicker(true)}
            >
              <View className="w-28 h-28 rounded-full bg-gray-100 border-4 border-white shadow-lg overflow-hidden">
                <Image 
                  source={{ uri: avatarUrl || 'https://i.pravatar.cc/300' }} 
                  className="w-full h-full"
                />
              </View>
              {/* Camera Overlay Button */}
              <View className="absolute bottom-0 right-0 bg-[#5D4037] w-9 h-9 rounded-full items-center justify-center border-2 border-white">
                <Camera size={16} color="white" />
              </View>
            </TouchableOpacity>
            <Text className="text-gray-400 text-sm mt-3">Tap to change photo</Text>
          </View>

          {/* Form Fields */}
          <View className="gap-5 pb-10">
            
            {/* Personal Information Section */}
            <Text className="text-[#5D4037] font-bold text-xs uppercase tracking-wider mb-1">
              Personal Information
            </Text>

            {/* Name */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <User size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Full Name</Text>
              </View>
              <Input
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            {/* Relation */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Heart size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Family Role</Text>
              </View>
              <TouchableOpacity
                className="h-14 bg-gray-50 border border-gray-100 rounded-xl px-4 flex-row items-center justify-between"
                onPress={() => setShowRelationPicker(true)}
              >
                <Text className={relation ? 'text-gray-900' : 'text-gray-400'}>
                  {relation || 'Select your role'}
                </Text>
                <ChevronDown size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Date of Birth */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Calendar size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Date of Birth</Text>
              </View>
              <TouchableOpacity
                className="h-14 bg-gray-50 border border-gray-100 rounded-xl px-4 flex-row items-center justify-between"
                onPress={() => setShowDatePicker(true)}
              >
                <Text className={dateOfBirth ? 'text-gray-900' : 'text-gray-400'}>
                  {formatDateDisplay(dateOfBirth)}
                </Text>
                <ChevronDown size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Bio */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <FileText size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Bio</Text>
              </View>
              <Input
                placeholder="Tell us about yourself..."
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                className="h-24 bg-gray-50 border-gray-100 py-3"
                style={{ textAlignVertical: 'top' }}
              />
            </View>

            {/* Contact Information Section */}
            <Text className="text-[#5D4037] font-bold text-xs uppercase tracking-wider mt-4 mb-1">
              Contact Information
            </Text>

            {/* Email */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Mail size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Email Address</Text>
              </View>
              <Input
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            {/* Phone */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Phone size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Phone Number</Text>
              </View>
              <Input
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            {/* Address */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <MapPin size={14} color="#9CA3AF" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Address</Text>
              </View>
              <Input
                placeholder="123 Main Street, City, State"
                value={address}
                onChangeText={setAddress}
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            {/* Emergency Contact Section */}
            <Text className="text-[#5D4037] font-bold text-xs uppercase tracking-wider mt-4 mb-1">
              Emergency Contact
            </Text>

            {/* Emergency Contact Name */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <AlertCircle size={14} color="#F59E0B" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Contact Name</Text>
              </View>
              <Input
                placeholder="Emergency contact name"
                value={emergencyContact}
                onChangeText={setEmergencyContact}
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            {/* Emergency Phone */}
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Phone size={14} color="#F59E0B" />
                <Text className="text-gray-500 font-medium text-xs uppercase tracking-wide">Emergency Phone</Text>
              </View>
              <Input
                placeholder="+1 (555) 987-6543"
                value={emergencyPhone}
                onChangeText={setEmergencyPhone}
                keyboardType="phone-pad"
                className="h-14 bg-gray-50 border-gray-100"
              />
            </View>

            {/* Save Button */}
            <Button
              className="bg-[#5D4037] h-14 rounded-2xl shadow-sm mt-6" 
              onPress={handleSave}
              disabled={isSaving}
            >
              <Text className="text-white font-bold text-lg">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Text>
            </Button>

            <View className="h-8" />
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* Image Source Picker Modal */}
      <Modal visible={showImageSourcePicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setShowImageSourcePicker(false)}
        >
          <View className="bg-white rounded-t-3xl p-6 pb-10">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-900">Change Photo</Text>
              <TouchableOpacity 
                onPress={() => setShowImageSourcePicker(false)}
                className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center"
              >
                <X size={18} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <View className="gap-3">
              {/* Take Photo */}
              <TouchableOpacity
                className="flex-row items-center bg-[#F9F6F3] rounded-2xl p-4"
                onPress={takePhoto}
                activeOpacity={0.8}
              >
                <View className="w-12 h-12 bg-[#5D4037] rounded-full items-center justify-center mr-4">
                  <Camera size={22} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">Take Photo</Text>
                  <Text className="text-gray-500 text-sm">Use camera to capture a new photo</Text>
                </View>
              </TouchableOpacity>

              {/* Choose from Gallery */}
              <TouchableOpacity
                className="flex-row items-center bg-[#F9F6F3] rounded-2xl p-4"
                onPress={pickImage}
                activeOpacity={0.8}
              >
                <View className="w-12 h-12 bg-[#5D4037] rounded-full items-center justify-center mr-4">
                  <ImageIcon size={22} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">Choose from Gallery</Text>
                  <Text className="text-gray-500 text-sm">Select an existing photo from your device</Text>
                </View>
              </TouchableOpacity>

              {/* Choose Avatar */}
              <TouchableOpacity
                className="flex-row items-center bg-[#F9F6F3] rounded-2xl p-4"
                onPress={() => {
                  setShowImageSourcePicker(false);
                  setShowAvatarPicker(true);
                }}
                activeOpacity={0.8}
              >
                <View className="w-12 h-12 bg-[#5D4037] rounded-full items-center justify-center mr-4">
                  <User size={22} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-base">Choose Avatar</Text>
                  <Text className="text-gray-500 text-sm">Pick from preset avatar images</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Relation Picker Modal */}
      <Modal visible={showRelationPicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowRelationPicker(false)}
        >
          <View className="bg-white rounded-2xl w-80 overflow-hidden">
            <Text className="text-lg font-bold text-center py-4 border-b border-gray-100">
              Select Role
            </Text>
            {RELATION_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                className={`py-4 px-6 border-b border-gray-50 ${relation === option ? 'bg-[#F9F6F3]' : ''}`}
                onPress={() => {
                  setRelation(option);
                  setShowRelationPicker(false);
                }}
              >
                <Text className={`text-center ${relation === option ? 'text-[#5D4037] font-semibold' : 'text-gray-700'}`}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Date Picker Modal */}
      <Modal visible={showDatePicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowDatePicker(false)}
        >
          <View className="bg-white rounded-2xl w-80 max-h-96 overflow-hidden">
            <Text className="text-lg font-bold text-center py-4 border-b border-gray-100">
              Date of Birth
            </Text>
            <FlatList
              data={dateOptions}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => {
                const isSelected = dateOfBirth?.startsWith(item.value.substring(0, 7));
                return (
                  <TouchableOpacity
                    className={`py-3 px-6 ${isSelected ? 'bg-[#F9F6F3]' : ''}`}
                    onPress={() => {
                      setDateOfBirth(item.value);
                      setShowDatePicker(false);
                    }}
                  >
                    <Text className={`text-center ${isSelected ? 'text-[#5D4037] font-semibold' : 'text-gray-700'}`}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarPicker} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setShowAvatarPicker(false)}
        >
          <View className="bg-white rounded-2xl w-80 p-6 overflow-hidden">
            <Text className="text-lg font-bold text-center mb-4">
              Choose Avatar
            </Text>
            <View className="flex-row flex-wrap justify-center gap-3">
              {AVATAR_OPTIONS.map((url, index) => (
                <TouchableOpacity
                  key={index}
                  className={`w-16 h-16 rounded-full overflow-hidden border-2 ${avatarUrl === url ? 'border-[#5D4037]' : 'border-transparent'}`}
                  onPress={() => {
                    setAvatarUrl(url);
                    setShowAvatarPicker(false);
                  }}
                >
                  <Image source={{ uri: url }} className="w-full h-full" />
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              className="mt-4 py-3"
              onPress={() => setShowAvatarPicker(false)}
            >
              <Text className="text-center text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
