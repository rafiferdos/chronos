import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Toast } from 'toastify-react-native';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string) => Promise<void>;
  signUp: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for persisted user session
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user_session');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Failed to load user session', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signIn = async (email: string) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser = { email };
      setUser(newUser);
      await AsyncStorage.setItem('user_session', JSON.stringify(newUser));
      
      Toast.success('Welcome back!', 'top');
      router.replace('/');
    } catch (error) {
      Toast.error('Failed to sign in', 'top');
    }
  };

  const signUp = async (email: string) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newUser = { email };
      setUser(newUser);
      await AsyncStorage.setItem('user_session', JSON.stringify(newUser));
      
      Toast.success('Account created successfully!', 'top');
      router.replace('/');
    } catch (error) {
      Toast.error('Failed to create account', 'top');
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user_session');
      setUser(null);
      router.replace('/(auth)/login');
      Toast.success('Signed out successfully', 'top');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  const resetPassword = async (email: string) => {
    // Mock password reset logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Usually triggers an email, here we just acknowledge
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
      }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
