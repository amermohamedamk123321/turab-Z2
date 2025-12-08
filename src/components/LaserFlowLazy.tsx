import dynamic from 'next/dynamic';

const LaserFlow = dynamic(() => import('@/components/LaserFlow'), {
  loading: () => <div className="w-full h-full bg-black" />,
  ssr: false
});

export default LaserFlow;