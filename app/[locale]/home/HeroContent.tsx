"use client";
import { useTranslations } from "next-intl";
import { Separator } from "@/components/ui/separator";
import { RxExternalLink } from "react-icons/rx";
import { LandingContent } from "./LandingContent";

export function HeroContent() {
  const t = useTranslations('home');
  
  return (
    <div className="flex flex-col justify-between h-full  lg:pt-25">
        <LandingContent />
        <div className="text-xs md:text-base flex items-center gap-4 self-center pb-10">
          <a href="https://project-guard-quick-score-v2.netlify.app?utm_source=main_site&utm_medium=footer_link" className="hover:underline flex items-center gap-2">
            {t('quickScore')} <RxExternalLink className="size-4" />
          </a>
          <Separator orientation="vertical" className="!h-4 bg-black" />
          <a href="https://projectguard-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
            {t('demo')} <RxExternalLink className="size-4" />
          </a>
        </div>
    </div>
  );
}
