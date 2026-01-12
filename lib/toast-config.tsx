import { BaseToast, ErrorToast, ToastConfig } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#5D4037',
        backgroundColor: '#5D4037',
        borderRadius: 12,
        height: 60,
        paddingHorizontal: 16,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#FFFFFF',
      }}
      text2Style={{
        fontSize: 13,
        color: '#FFFFFF',
        opacity: 0.9,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: '#ef4444',
        backgroundColor: '#fef2f2',
        borderRadius: 12,
        height: 60,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#dc2626',
      }}
      text2Style={{
        fontSize: 13,
        color: '#ef4444',
      }}
    />
  ),
  info: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: '#3b82f6',
        backgroundColor: '#eff6ff',
        borderRadius: 12,
        height: 60,
      }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: '600',
        color: '#1d4ed8',
      }}
      text2Style={{
        fontSize: 13,
        color: '#3b82f6',
      }}
    />
  ),
};
