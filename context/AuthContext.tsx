import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';

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
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const newUser = { email };
      setUser(newUser);
      await AsyncStorage.setItem('user_session', JSON.stringify(newUser));
      
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: `Signed in as ${email}`,
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign in failed',
        text2: 'Please try again',
      });
    }
  };

  const signUp = async (email: string) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const newUser = { email };
      setUser(newUser);
      await AsyncStorage.setItem('user_session', JSON.stringify(newUser));
      
      Toast.show({
        type: 'success',
        text1: 'Account created!',
        text2: 'Welcome to Chronos',
      });
      
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign up failed',
        text2: 'Please try again',
      });
    }
  };

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user_session');
      setUser(null);
      
      Toast.show({
        type: 'success',
        text1: 'Signed out',
        text2: 'See you soon!',
      });
      
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Sign out failed', error);
    }
  };

  const resetPassword = async (email: string) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    Toast.show({
      type: 'success',
      text1: 'Password reset',
      text2: 'You can now sign in',
    });
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
