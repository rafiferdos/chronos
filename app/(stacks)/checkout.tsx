import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Check, Wallet } from 'lucide-react-native';
import { Input } from '@/components/ui/input'; 
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils'; 

export default function CheckoutScreen() {
  const router = useRouter();
  const [saveCard, setSaveCard] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('visa');
  const [addNewCard, setAddNewCard] = useState(false);

  const paymentMethods = useMemo(
    () => [
      { id: 'visa', label: 'Visa', detail: '•••• 4242', expiry: '09/28' },
      { id: 'mastercard', label: 'Mastercard', detail: '•••• 5512', expiry: '11/27' },
      { id: 'paypal', label: 'PayPal', detail: 'emma@family.app', expiry: '' },
    ],
    []
  );

  const handlePayment = () => {
    // Simulate API call
    setTimeout(() => {
      setShowSuccess(true);
    }, 1000);
  };

  const finishProcess = () => {
    setShowSuccess(false);
    router.replace('/(tabs)'); // Go back home
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
        <View className="px-5 py-4 flex-row items-center">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <ArrowLeft size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-black">Checkout</Text>
        </View>

        <ScrollView className="flex-1 px-6">
          <Text className="text-2xl font-bold mb-2">Select payment method</Text>
          <Text className="text-gray-500 mb-6 text-sm">
            Choose a saved method or add a new card to continue.
          </Text>

          <View className="gap-3 mb-8">
            {paymentMethods.map((method) => {
              const isSelected = selectedMethod === method.id && !addNewCard;
              return (
                <TouchableOpacity
                  key={method.id}
                  className={cn(
                    'flex-row items-center justify-between rounded-2xl border p-4',
                    isSelected ? 'border-[#5D4037] bg-[#F9F6F3]' : 'border-gray-100 bg-white'
                  )}
                  onPress={() => {
                    setSelectedMethod(method.id);
                    setAddNewCard(false);
                  }}
                  activeOpacity={0.9}
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                      <Wallet size={18} color="#5D4037" />
                    </View>
                    <View>
                      <Text className="text-sm font-semibold text-gray-900">
                        {method.label} {method.detail}
                      </Text>
                      {method.expiry ? (
                        <Text className="text-xs text-gray-500">Expires {method.expiry}</Text>
                      ) : (
                        <Text className="text-xs text-gray-500">Connected</Text>
                      )}
                    </View>
                  </View>
                  {isSelected ? (
                    <View className="h-6 w-6 rounded-full bg-[#5D4037] items-center justify-center">
                      <Check size={14} color="white" />
                    </View>
                  ) : (
                    <View className="h-6 w-6 rounded-full border border-gray-200" />
                  )}
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              className={cn(
                'flex-row items-center justify-between rounded-2xl border p-4',
                addNewCard ? 'border-[#5D4037] bg-[#F9F6F3]' : 'border-gray-100 bg-white'
              )}
              onPress={() => setAddNewCard(true)}
              activeOpacity={0.9}
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center">
                  <CreditCard size={18} color="#5D4037" />
                </View>
                <Text className="text-sm font-semibold text-gray-900">Add new card</Text>
              </View>
              {addNewCard ? (
                <View className="h-6 w-6 rounded-full bg-[#5D4037] items-center justify-center">
                  <Check size={14} color="white" />
                </View>
              ) : (
                <View className="h-6 w-6 rounded-full border border-gray-200" />
              )}
            </TouchableOpacity>
          </View>

          {/* Form */}
          {addNewCard ? (
            <View className="gap-5">
            <View className="gap-2">
               <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider">Card Holder Name</Text>
               <Input placeholder="Your full name" className="bg-gray-50 border-gray-100 h-14 rounded-xl" />
            </View>

            <View className="gap-2">
               <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider">Card Number</Text>
               <Input 
                 placeholder="0000 0000 0000 0000" 
                 keyboardType="numeric"
                 startIcon={<CreditCard size={20} color="gray" />}
                 className="bg-gray-50 border-gray-100 h-14 rounded-xl" 
               />
            </View>

            <View className="flex-row gap-4">
               <View className="flex-1 gap-2">
                 <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider">Valid Until</Text>
                 <Input placeholder="MM/YY" className="bg-gray-50 border-gray-100 h-14 rounded-xl" />
               </View>
               <View className="flex-1 gap-2">
                 <Text className="text-xs font-bold uppercase text-gray-400 tracking-wider">CVV</Text>
                 <Input placeholder="123" keyboardType="numeric" maxLength={3} className="bg-gray-50 border-gray-100 h-14 rounded-xl" />
               </View>
            </View>

            {/* Checkbox */}
            <TouchableOpacity 
              className="flex-row items-center gap-3 mt-2"
              onPress={() => setSaveCard(!saveCard)}
            >
               <View className={cn(
                  "w-5 h-5 rounded border items-center justify-center",
                  saveCard ? "bg-[#5D4037] border-[#5D4037]" : "border-gray-300"
               )}>
                  {saveCard && <View className="w-2 h-2 bg-white rounded-sm" />}
               </View>
               <Text className="text-gray-500 text-sm">Save card data for future payments</Text>
            </TouchableOpacity>

            <Button 
               className="bg-[#5D4037] h-14 rounded-full mt-6 shadow-sm"
               onPress={handlePayment}
            >
               <Text className="text-white font-bold text-lg">Proceed to confirm</Text>
            </Button>
          </View>
          ) : (
            <Button 
              className="bg-[#5D4037] h-14 rounded-full mt-2 shadow-sm"
              onPress={handlePayment}
            >
              <Text className="text-white font-bold text-lg">Pay with selected method</Text>
            </Button>
          )}

        </ScrollView>
      </SafeAreaView>

      {/* Success Modal Overlay */}
      <Modal transparent visible={showSuccess} animationType="fade">
        <View className="flex-1 bg-black/60 justify-center items-center px-6">
           <View className="bg-white w-full rounded-3xl p-8 items-center shadow-2xl">
              {/* Check Icon */}
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-6 shadow-lg shadow-blue-500/40">
                 <Check size={40} color="white" strokeWidth={4} />
              </View>

              <Text className="text-center text-gray-500 font-medium mb-8">
                 Your payment has been successful.
              </Text>

              <Button 
                 className="bg-[#5D4037] h-14 rounded-full w-full"
                 onPress={finishProcess}
              >
                 <Text className="text-white font-bold text-lg">Back to Home</Text>
              </Button>
           </View>
        </View>
      </Modal>

    </View>
  );
}