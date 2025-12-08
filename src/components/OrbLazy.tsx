import dynamic from 'next/dynamic';
import { SkeletonLoader } from '@/components/SkeletonLoader';

const Orb = dynamic(() => import('@/components/Orb'), {
  loading: () => <SkeletonLoader className="w-full h-full rounded-full" />,
  ssr: false
});

export default Orb;
