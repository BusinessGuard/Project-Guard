"use client";
import { useState, useEffect } from "react";
import { useRouter } from "@/lib/navigation";
import { useTranslations } from "next-intl";
import { LuMoveLeft } from "react-icons/lu";
import { HeroContent } from "../home/HeroContent";
import { AuthForm } from "../home/AuthForm";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const tNav = useTranslations('nav');
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    document.title = `Project Guard AI | ${tNav('login')}`;
  }, [tNav]);

  const handleBack = () => {
    setIsNavigating(true);
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.history.length > 1) {
        router.back();
      } else {
        router.push('/');
      }
    }, 700);
  };

  return (
    <div className="relative h-screen xl:overflow-hidden">
      <div className={`grid grid-cols-1 xl:grid-cols-2 h-screen transition-transform duration-700 ease-in-out ${isNavigating ? "translate-x-full xl:translate-x-1/2" : "translate-x-0"}`}>
        <div className="relative hidden xl:flex items-center justify-between px-8 bg-white">
          <Button 
            variant="ghost"
            onClick={handleBack}
            className="absolute top-8 left-8 hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <LuMoveLeft className="size-10" />
          </Button>
          <HeroContent />
        </div>

        <div className="relative flex items-center justify-center bg-indigo-50 px-8 ">
          <Button
            variant="ghost"
            onClick={handleBack}
            className="absolute xl:hidden top-8 left-8 hover:scale-110 transition-all duration-300 cursor-pointer"
          >
            <LuMoveLeft className="size-10" />
          </Button>
          <AuthForm />
        </div>
      </div>
    </div>
  );
}
