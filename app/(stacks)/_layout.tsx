import { Stack } from 'expo-router';

export default function StacksLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="schedule/[date]" />
      <Stack.Screen
        name="create-event"
        options={{
          presentation: 'modal',
          animation: 'slide_from_bottom',
        }}
      />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="payment" />
      <Stack.Screen name="checkout" />
      <Stack.Screen name="privacy" />
      <Stack.Screen name="terms" />
      <Stack.Screen name="notifications" />
      <Stack.Screen name="alert" />
      <Stack.Screen name="delete-account" />
      <Stack.Screen name="logout" />
    </Stack>
  );
}
