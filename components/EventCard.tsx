import { cn } from '@/lib/utils';
import { Briefcase, Clock, HomeIcon } from 'lucide-react-native';
import { Text, View } from 'react-native';

interface EventCardProps {
  title: string;
  time: string;
  status: 'Pending' | 'Upcoming';
  themeColor?: 'red' | 'purple';
  variant?: 'pink' | 'purple';
  icon?: 'work' | 'home';
}

export function EventCard({ title, time, status, themeColor, variant, icon }: EventCardProps) {
  const resolvedTheme = themeColor ?? (variant === 'pink' ? 'red' : 'purple');
  const isPink = resolvedTheme === 'red';

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
        {/* status badge */}
        <View className={cn('rounded-full px-3 py-1', isPink ? 'bg-[#FFE4E4]' : 'bg-[#EDE9FE]')}>
          <Text className={cn('text-xs font-bold', isPink ? 'text-[#FF8A8A]' : 'text-[#8B5CF6]')}>
            {status}
          </Text>
        </View>
      </View>

      {/* time row */}
      <View className="flex-row items-center gap-2 pl-1 opacity-80">
        <Clock size={16} color="gray" />
        <Text className="font-medium text-gray-600">{time}</Text>
      </View>
    </View>
  );
}
