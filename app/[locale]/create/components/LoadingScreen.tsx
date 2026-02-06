'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { HashLoader } from 'react-spinners';

interface LoadingScreenProps {
  text: string;
}

export function LoadingScreen({ text }: LoadingScreenProps) {
  const tCommon = useTranslations('common');
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      <HashLoader color="#000000" size={60} />
      <p className="mt-8 text-xl font-semibold text-black">{text}</p>
      <p className="mt-2 text-lg text-gray-600">{seconds}s</p>
      <p className="mt-4 text-sm text-gray-500">{tCommon('mayTakeTime')}</p>
    </div>
  );
}
