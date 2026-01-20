import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { RxExternalLink } from "react-icons/rx";

interface HeroContentProps {
  onGetStarted: () => void;
  showButton?: boolean;
}

export function HeroContent({ onGetStarted, showButton = true }: HeroContentProps) {
  return (
    <div className="space-y-8 max-w-xl flex flex-col h-full">
      <div className="flex flex-col items-center justify-center my-auto">
        <h1 className="text-6xl lg:text-7xl font-bold text-black">
          Good to Great
        </h1>
        
        <p className="text-xl lg:text-2xl text-black/80">
          Some companies sooner or later become the best, and our app only helps make it inevitable!
        </p>

        <div className="pt-4">
            <Button 
              size="lg" 
              className={cn("text-lg px-8 py-6 bg-black hover:bg-black/90 text-white transition-all duration-300", showButton ? "opacity-100 cursor-pointer" : "opacity-0 pointer-events-none")}
              onClick={onGetStarted}
            >
              Try Now →
            </Button>
          </div>
      </div>
        <div className="flex items-center gap-4 self-end pb-10">
          <a href="https://projectguard-demo.vercel.app" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">Demo <RxExternalLink className="size-4" /></a>
          <Separator orientation="vertical" className="!h-4 bg-black" />
          <a href="https://projectguardai.vercel.app/presentation" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">Presentation <RxExternalLink className="size-4" /></a>
          <Separator orientation="vertical" className="!h-4 bg-black" />
          <a href="https://projectguardai.vercel.app/investment" target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">Investment proposal <RxExternalLink className="size-4" /></a>
        </div>
    </div>
  );
}
