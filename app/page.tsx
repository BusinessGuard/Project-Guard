"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { HeroContent } from "@/components/home/HeroContent";
import { Button } from "@/components/ui/button";
import { LuMoveLeft } from "react-icons/lu";
import { cn } from "@/lib/utils";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  const handleTryNow = () => {
    setIsNavigating(true);
    setTimeout(() => {
      router.push("/project");
    }, 700);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      <div 
        className={`flex h-screen transition-transform duration-700 ease-in-out ${
          isNavigating ? "translate-x-full" : "translate-x-0"
        }`}
      >
      <div 
        className={`relative h-full transition-all duration-700 ease-in-out ${
          showAuth ? "w-0" : "w-1/2"
        }`}
      >
        <Image
          src="/images/poster.webp"
          alt="Business Canvas"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      <div className={`relative flex items-center justify-center px-8 bg-white transition-all duration-700 ease-in-out ${
        showAuth ? "w-1/2" : "w-1/2"
      }`}>
        <LuMoveLeft onClick={() => setShowAuth(false)} className={cn("size-10 absolute hover:scale-110 transition-all duration-300 top-8 left-8 cursor-pointer", showAuth ? "opacity-100" : "opacity-0")} />

        <Button 
          variant="ghost"
          className={cn("absolute top-8 right-8 hover:scale-110 transition-all duration-300 hover:bg-white cursor-pointer text-lg", showAuth ? "opacity-0" : "opacity-100")}
          onClick={() => setShowAuth(true)}
        >
          Login
        </Button>

         <HeroContent onGetStarted={handleTryNow} showButton={!showAuth} />  
      </div>

      <div 
        className={`flex items-center justify-center px-12 bg-indigo-50 transition-all duration-700 ease-in-out overflow-hidden ${
          showAuth ? "w-1/2 opacity-100" : "w-0 opacity-0"
        }`}
      >
        <AuthForm />
      </div>
      </div>
    </div>
  );
}
