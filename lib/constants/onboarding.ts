import { SvgProps } from 'react-native-svg';
import OnBoard1 from '@/assets/images/onboard-1.svg';
import OnBoard2 from '@/assets/images/onboard-2.svg';
import OnBoard3 from '@/assets/images/onboard-3.svg';

export interface OnBoardingSlide {
  id: string;
  Image: React.FC<SvgProps>;
  title: string;
  description: string;
}

export const ONBOARDING_SLIDES: OnBoardingSlide[] = [
  {
    id: '1',
    Image: OnBoard1,
    title: 'Welcome to Chronos',
    description:
      'Easily coordinate and manage activities, appointments, and events with your close circle — all in one streamlined platform.',
  },
  {
    id: '2',
    Image: OnBoard2,
    title: 'Easily Create Family Events',
    description:
      'Plan to manage your schedule with ease. Add activities such as school events, after-school classes, and appointments.',
  },
  {
    id: '3',
    Image: OnBoard3,
    title: 'Share Events with Your Family',
    description:
      'Invite teammates, family members, caregivers, and assistants to access your schedule. Stay organized and aligned on important events.',
  },
];
