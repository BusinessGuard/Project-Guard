"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LuMoveLeft } from "react-icons/lu";
import { cn } from "@/lib/utils";
import { HeroContent } from "./home/components/HeroContent";

export default function Home() {
  const [showAuth, setShowAuth] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle OAuth callback redirect
  useEffect(() => {
    const code = searchParams.get('code');
    
    if (code) {
      // Redirect to callback route to exchange code for session
      window.location.href = `/auth/callback?code=${code}`;
    }
  }, [searchParams]);

  const handleTryNow = () => {
    setIsFading(true);
    setTimeout(() => {
      router.push("/create");
    }, 700);
  };

  return (
    <div className="relative h-screen overflow-hidden">
      {/* White overlay for Try Now button */}
      <div 
        className={`absolute inset-0 bg-white z-50 transition-opacity duration-700 ease-in-out ${
          isFading ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      
      <div 
        className={`flex h-screen transition-transform duration-700 ease-in-out ${
          isNavigating ? "-translate-x-1/2" : "translate-x-0"
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
          onClick={() => {
            setIsNavigating(true);
            setTimeout(() => {
              router.push("/login");
            }, 700);
          }}
        >
          Login
        </Button>

         <HeroContent onGetStarted={handleTryNow} showButton={!showAuth} />  
      </div>


      </div>
    </div>
  );
}
