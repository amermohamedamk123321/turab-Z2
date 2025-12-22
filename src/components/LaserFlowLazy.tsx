import dynamic from 'next/dynamic';
import { SkeletonLoader } from '@/components/SkeletonLoader';

const LaserFlow = dynamic(() => import('@/components/LaserFlow'), {
  loading: () => <SkeletonLoader className="w-full h-full bg-black" />,
  ssr: false
});

export default LaserFlow;
