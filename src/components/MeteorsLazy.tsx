import dynamic from 'next/dynamic';

const Meteors = dynamic(() => import('@/components/Meteors').then(mod => ({ default: mod.Meteors })), {
  loading: () => <div className="w-full h-full bg-transparent" />,
  ssr: false
});

export default Meteors;