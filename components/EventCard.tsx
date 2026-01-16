import { cn } from '@/lib/utils';
import { Briefcase, HomeIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface EventCardProps {
  title: string;
  time: string;
  status: 'Pending' | 'Upcoming';
  variant: 'pink' | 'purple';
  icon?: 'work' | 'home';
}

export function EventCard({ title, time, status, variant, icon }: EventCardProps) {
  const isPink = variant === 'pink';

  return (
    <View
      className={cn(
        'mb-4 rounded-2xl border-l-4 p-4 shadow-sm',
        isPink ? 'border-[#FF8A8A] bg-[#FFF0F0]' : 'border-[#A78BFA] bg-[#F5F3FF]'
      )}>
      {/* header row */}
      <View className="mb-4 flex-row items-start justify-between">
        <View className="flex-row items-center gap-3">
          {/* icon circle */}
          <View className="h-10 w-10 items-center justify-center rounded-full bg-white/60">
            {icon === 'work' ? (
              <Briefcase size={18} color={isPink ? '#9B2C2C' : '#5B21B6'} />
            ) : (
              <HomeIcon size={18} color={isPink ? '#9B2C2C' : '#5B21B6'} />
            )}
          </View>
          <Text className="text-lg font-bold text-gray-900">{title}</Text>
        </View>
      </View>
    </View>
  );
}
