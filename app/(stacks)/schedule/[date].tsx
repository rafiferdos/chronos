import { useLocalSearchParams, useRouter } from "expo-router";
import {addDays, format, parseISO} from 'date-fns'
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DailyScheduleScreen() {
  const router = useRouter()
  const { date } = useLocalSearchParams()
  
  const dateString = typeof date === 'string' ? date : format(new Date(), 'yyyy-MM-dd')
  const parsedDate = parseISO(dateString)

  const weekDates = Array.from({ length: 5 }).map((_, i) => addDays(parsedDate, i - 2));


  return (
    <View className="flex-1 bg-white">
      <SafeAreaView edges={['top']} className="flex-1">
        
      </SafeAreaView>
    </View>
  )
};
