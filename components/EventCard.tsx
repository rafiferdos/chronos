import { cn } from "@/lib/utils"
import { Briefcase, HomeIcon } from "lucide-react-native"
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
      
      {/* header row */}
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-row items-center gap-3">

          {/* icon circle */}
          <View className="h-10 w-10 rounded-full items-center justify-center bg-white/60">
            {
              icon === 'work' ? (
                <Briefcase size={18} color={isPink ? '#9B2C2C' : '#5B21B6'} />
              ) : (
                  <HomeIcon size={18} color={isPink ? '#9B2C2C' : '#5B21B6'} />
              )
            }

          </View>

        </View>

      </View>
    </View>
  )
}