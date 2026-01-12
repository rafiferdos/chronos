import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'expo-router';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Text, TouchableOpacity, View } from 'react-native';
import * as z from 'zod';

import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// 1. Define the Validation Schema (Rules)
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

// Infer the type automatically
type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  // 2. Setup Form Engine
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log("Form Data:", data);
    // TODO: Call your Login API here
    router.replace('/');
  };

  return (
    <AuthLayout 
      title="Welcome Back" 
      subtitle="Sign in to access your Chronos schedule"
    >
      <View className="gap-5">
        
        {/* Email Field */}
        <View className="gap-1">
          <Text className="text-sm font-medium text-gray-700">Email Address</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="hello@example.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                startIcon={
                  // @ts-ignore
                  <Mail size={20} color="#6b7280" />
                }
                className={errors.email ? "border-red-500" : ""}
              />
            )}
          />
          {errors.email && <Text className="text-red-500 text-xs">{errors.email.message}</Text>}
        </View>

        {/* Password Field */}
        <View className="gap-1">
          <Text className="text-sm font-medium text-gray-700">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                startIcon={
                  // @ts-ignore
                  <Lock size={20} color="#6b7280" />
                }
                endIcon={
                  showPassword ? (
                    // @ts-ignore
                    <EyeOff size={20} color="#6b7280" />
                  ) : (
                    // @ts-ignore
                    <Eye size={20} color="#6b7280" />
                  )
                }
                onEndIconPress={() => setShowPassword(!showPassword)}
                className={errors.password ? "border-red-500" : ""}
              />
            )}
          />
          {errors.password && <Text className="text-red-500 text-xs">{errors.password.message}</Text>}
          
          {/* Forgot Password Link */}
          <TouchableOpacity 
            className="self-end mt-1"
            onPress={() => router.push('/(auth)/forgot-password')}
          >
            <Text className="text-[#5D4037] font-semibold text-sm">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <Button 
          className="bg-[#5D4037] h-12 rounded-xl mt-4" 
          onPress={handleSubmit(onSubmit)}
        >
          <Text className="text-white font-bold text-lg">Sign In</Text>
        </Button>

        {/* Toggle to Signup */}
        <View className="flex-row justify-center mt-6">
          <Text className="text-gray-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-[#5D4037] font-bold">Sign Up</Text>
          </TouchableOpacity>
        </View>

      </View>
    </AuthLayout>
  );
}