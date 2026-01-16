import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  relation: string;
  phone: string;
  dateOfBirth: string;
  bio: string;
  avatarUrl: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  createdAt: string;
  updatedAt: string;
}

interface UserContextType {
  user: UserProfile | null;
  isLoading: boolean;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  resetUser: () => Promise<void>;
}

const STORAGE_KEY = 'chronos_user_profile';

const DEFAULT_USER: UserProfile = {
  id: 'user_1',
  name: 'Emma Johnson',
  email: 'emma.johnson@email.com',
  relation: 'Mother',
  phone: '+1 (555) 123-4567',
  dateOfBirth: '1985-06-15',
  bio: 'Busy mom of two, trying to keep everyone organized!',
  avatarUrl: 'https://i.pravatar.cc/300',
  address: '123 Family Lane, San Francisco, CA 94102',
  emergencyContact: 'John Johnson',
  emergencyPhone: '+1 (555) 987-6543',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // Initialize with default user
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
          setUser(DEFAULT_USER);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        setUser(DEFAULT_USER);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const updateUser = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    
    const updatedUser: UserProfile = {
      ...user,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error('Failed to update user', error);
      throw error;
    }
  }, [user]);

  const resetUser = useCallback(async () => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_USER));
      setUser(DEFAULT_USER);
    } catch (error) {
      console.error('Failed to reset user', error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, updateUser, resetUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
