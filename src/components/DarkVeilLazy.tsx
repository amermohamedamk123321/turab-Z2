import dynamic from 'next/dynamic';
import { SkeletonLoader } from '@/components/SkeletonLoader';

const DarkVeil = dynamic(() => import('@/components/DarkVeil'), {
  loading: () => <SkeletonLoader className="w-full h-full bg-slate-900" />,
  ssr: false
});

export default DarkVeil;
