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
  initializeUser: (email: string, name?: string) => Promise<void>;
  updateUser: (updates: Partial<UserProfile>) => Promise<void>;
  resetUser: () => Promise<void>;
  clearUser: () => Promise<void>;
}

const STORAGE_KEY = 'chronos_user_profile';

// Generate a random avatar URL
const getRandomAvatar = () => {
  const seed = Math.random().toString(36).substring(7);
  return `https://i.pravatar.cc/300?u=${seed}`;
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
        }
      } catch (error) {
        console.error('Failed to load user', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  // Initialize a new user profile (called during sign-up or sign-in)
  const initializeUser = useCallback(async (email: string, name?: string) => {
    // Check if user already exists with this email
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (stored) {
      const existingUser = JSON.parse(stored) as UserProfile;
      // If same email, just update the user state and return
      if (existingUser.email === email) {
        setUser(existingUser);
        return;
      }
    }

    // Create new user profile
    const newUser: UserProfile = {
      id: `user_${Date.now()}`,
      name: name || email.split('@')[0], // Use name if provided, otherwise use email prefix
      email: email,
      relation: 'Family Member',
      phone: '',
      dateOfBirth: '',
      bio: '',
      avatarUrl: getRandomAvatar(),
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
    } catch (error) {
      console.error('Failed to initialize user', error);
      throw error;
    }
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
    if (!user) return;
    
    // Reset to basic info keeping email and name
    const resetUserData: UserProfile = {
      ...user,
      relation: 'Family Member',
      phone: '',
      dateOfBirth: '',
      bio: '',
      avatarUrl: getRandomAvatar(),
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      updatedAt: new Date().toISOString(),
    };
    
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(resetUserData));
      setUser(resetUserData);
    } catch (error) {
      console.error('Failed to reset user', error);
    }
  }, [user]);

  // Clear user completely (for logout)
  const clearUser = useCallback(async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setUser(null);
    } catch (error) {
      console.error('Failed to clear user', error);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, initializeUser, updateUser, resetUser, clearUser }}>
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
