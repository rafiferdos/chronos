import { cn } from "@/lib/utils"
import { View } from "react-native"

interface EventCardProps {
  title: string
  time: string
  status: "Pending" | "Upcoming"
  variant: 'pink' | 'purple'
  icon?: 'work' | 'home'
}

export function EventCard({
  title, time, status, variant, icon
}: EventCardProps) {
  const isPink = variant === 'pink'
  
  return (
    <View className={cn("mb-4 p-4 rounded-2xl border-l-4 shadow-sm", isPink ? 'bg-[#FFF0F0] border-[#FF8A8A]' : "bg-[#F5F3FF] border-[#A78BFA]")}>
      
    </View>
  )
}