'use client';

import { useEffect, useState } from 'react';
import { HashLoader } from 'react-spinners';
import { useRouter } from '@/lib/navigation';

interface LoadingScreenProps {
  text: string;
}

export function LoadingScreen({ text }: LoadingScreenProps) {
  const router = useRouter();
  const [seconds, setSeconds] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [duration] = useState(() => Math.floor(Math.random() * 11) + 15); // 15-25 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((prev) => {
        const next = prev + 1;
        if (next >= duration) {
          setIsComplete(true);
          clearInterval(interval);
          // Show "Готово" for 1.5 seconds, then redirect
          setTimeout(() => {
            router.push('/dashboard');
          }, 1500);
          return duration;
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [duration, router]);

  // Reset when component mounts
  useEffect(() => {
    setSeconds(0);
    setIsComplete(false);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {!isComplete ? (
        <>
          <HashLoader color="#000000" size={60} />
          <p className="mt-8 text-xl font-semibold text-black">{text} {seconds}s</p>
        </>
      ) : (
        <>
          <div className="text-6xl mb-4">✓</div>
          <p className="text-2xl font-semibold text-black">Готово!</p>
        </>
      )}
    </div>
  );
}
