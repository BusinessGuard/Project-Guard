import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
interface HeroContentProps {
  onGetStarted: () => void;
  showButton?: boolean;
}

export function HeroContent({ onGetStarted, showButton = true }: HeroContentProps) {
  return (
    <div className="space-y-8 max-w-xl">
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
  );
}
