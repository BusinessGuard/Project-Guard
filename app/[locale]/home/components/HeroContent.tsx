import { Separator } from "@/components/ui/separator";
import { RxExternalLink } from "react-icons/rx";
import { LandingContent } from "./LandingContent";

export function HeroContent() {
  return (
    <div className="flex flex-col justify-between h-full  lg:pt-25">
        <LandingContent />
        <div className="text-xs md:text-base flex items-center gap-4 self-center pb-10">
          <a href="https://projectguard-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">Demo <RxExternalLink className="size-4" /></a>
          <Separator orientation="vertical" className="!h-4 bg-black" />
          <a href="https://projectguardai.vercel.app/presentation" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">Presentation <RxExternalLink className="size-4" /></a>
          <Separator orientation="vertical" className="!h-4 bg-black" />
          <a href="https://projectguardai.vercel.app/investment" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">Investment proposal <RxExternalLink className="size-4" /></a>
        </div>
    </div>
  );
}
