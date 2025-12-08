import dynamic from 'next/dynamic';

const LampContainer = dynamic(() => import('@/components/Lamp').then(mod => ({ default: mod.LampContainer })), {
  loading: () => <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800" />,
  ssr: false
});

export default LampContainer;