import dynamic from 'next/dynamic';

const DarkVeil = dynamic(() => import('@/components/DarkVeil'), {
  loading: () => <div className="w-full h-full bg-slate-900" />,
  ssr: false
});

export default DarkVeil;