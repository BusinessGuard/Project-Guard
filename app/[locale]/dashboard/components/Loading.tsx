'use client';
import { useEffect, useState } from "react";
import { HashLoader } from "react-spinners";

export function DashboardLoading() {
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
      <p className="mt-8 text-xl font-semibold text-black">Добро пожаловать</p>
      <p className="mt-8 text-xl font-semibold text-black">{seconds}s</p>
    </div>
  );
}