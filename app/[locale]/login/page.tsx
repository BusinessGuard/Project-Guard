"use client";

import Image from "next/image";
import { useRouter } from "@/lib/navigation";
import { LuMoveLeft } from "react-icons/lu";
import { HeroContent } from "../home/components/HeroContent";
import { AuthForm } from "../home/components/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <div className=" h-screen grid grid-cols-2">
     
        <div className=" flex items-center justify-center col-span-1">
          <button
            onClick={handleBack}
            className="absolute top-8 left-8 hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <LuMoveLeft className="size-10" />
          </button>
          <HeroContent onGetStarted={() => {}} showButton={false} />
        </div>

      <div className=" flex items-center justify-center bg-indigo-50 px-8">
        <AuthForm />
      </div>
    </div>
  );
}
