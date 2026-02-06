"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { LuMoveLeft } from "react-icons/lu";
import { Sparkles, Rocket, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { HeroContent } from "./home/HeroContent";
import { createClient } from "@/lib/supabase/client";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function Home() {
  const t = useTranslations('home');
  const tNav = useTranslations('nav');
  const [showAuth, setShowAuth] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [imageTransform, setImageTransform] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
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

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setIsAuthenticated(!!user);
    };
    checkAuth();
  }, []);

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleTryNow = () => {
    setIsFading(true);
    setTimeout(() => {
      router.push("/create");
    }, 700);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!imageContainerRef.current) return;
    
    // Отменяем предыдущий кадр анимации, если он есть
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    
    // Используем requestAnimationFrame для плавного обновления
    animationFrameRef.current = requestAnimationFrame(() => {
      if (!imageContainerRef.current) return;
      
      const container = imageContainerRef.current;
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Вычисляем смещение от центра (от -1 до 1)
      const moveX = (x - centerX) / centerX;
      const moveY = (y - centerY) / centerY;
      
      // Параллакс эффект: изображение движется в противоположную сторону от курсора
      const parallaxX = moveX * 30; // Максимальное смещение 20px
      const parallaxY = moveY * 30;
      
      // Добавляем небольшой scale при наведении
      setImageTransform(`translate(${parallaxX}px, ${parallaxY}px) scale(1.15)`);
    });
  };

  const handleMouseLeave = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setImageTransform('');
  };

  return (
    <div className="relative  lg:h-screen lg:overflow-hidden">
        <div className={`absolute inset-0 bg-white z-50 transition-opacity duration-700 ease-in-out ${isFading ? "opacity-100" : "opacity-0 pointer-events-none"}`}/>
      
      <div className={`flex flex flex-col lg:flex-row h-screen transition-transform duration-700 ease-in-out ${  isNavigating ? "-translate-x-full lg:-translate-x-1/2" : "lg:translate-x-0"}`}>

        <div 
          ref={imageContainerRef}
          className="relative h-full transition-all duration-700 ease-in-out min-h-[500px] lg:min-h-full py-30 w-full lg:w-1/2 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <div
            className="absolute inset-0 transition-transform duration-1000 ease-out"
            style={{
              transform: imageTransform || 'scale(1.1)',
            }}
          >
            <Image
              src="/images/poster.webp"
              alt="Business Canvas"
              fill
              className="object-cover"
              priority
            />
          </div>
        
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-black/50" />
        
          {/* Content on image */}
          <div className="relative z-10 h-full flex flex-col items-center md:items-start px-5 md:px-12 justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-medium mb-2">
              <Sparkles className="size-4" />
              {t('badge')}
            </div>

            <h1 className="text-4xl xl:text-7xl font-bold text-white mb-2">{t('title')}</h1>
            <p className="text-md md:text-2xl text-white/90 mb-10">{t('subtitle')}</p>

            <div className="flex gap-4 pt-2 ">
              <Button
                onClick={handleTryNow}
                size="lg"
                className="gap-2 text-lg px-8 py-6 bg-white text-gray-900 hover:bg-white/90 cursor-pointer"
              >
                <Rocket className="w-6 h-6" />
                {t('ctaButton')}
              </Button>
            </div>
          </div>
        </div>
      
      <div className="flex lg:hidden items-center justify-between w-full my-10 px-8 gap-4">
        <LanguageSwitcher />
        <Button className="active:bg-black/60  cursor-pointer text-lg flex-1 py-6 " onClick={() => {
          setIsNavigating(true);
          setTimeout(() => {
            router.push(isAuthenticated ? "/dashboard" : "/login");
          }, 700);
        }}>
          {isAuthenticated ? tNav('dashboard') : tNav('login')}
        </Button>
      </div>
        <div className={`relative flex items-center justify-center px-8 bg-white transition-all duration-700 ease-in-out ${showAuth ? "w-full lg:w-1/2" : "w-full lg:w-1/2" }`}>
          <LuMoveLeft onClick={() => setShowAuth(false)} className={cn("hidden lg:block size-10 absolute hover:scale-110 transition-all duration-300 top-8 left-8 cursor-pointer", showAuth ? "opacity-100" : "opacity-0")} />

          <div className={cn("absolute hidden lg:flex items-center left-8 justify-between  top-8 right-8", showAuth ? "opacity-0" : "opacity-100")}>
            <LanguageSwitcher />
            <Button 
              variant="ghost"
              className="hover:scale-110 transition-all duration-300 hover:bg-white cursor-pointer text-lg flex items-center gap-2"
              onClick={() => {
                setIsNavigating(true);
                setTimeout(() => {
                  router.push(isAuthenticated ? "/dashboard" : "/login");
                }, 700);
              }}
            >
              {isAuthenticated ? (
                <>
                  <LayoutDashboard className="w-5 h-5" />
                  {tNav('dashboard')}
                </>
              ) : (
                tNav('login')
              )}
            </Button>
          </div>

          <HeroContent />  
        </div>
      </div>
    </div>
  );
}
