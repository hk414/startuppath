import { Button } from "@/components/ui/button";
import { Compass, Menu } from "lucide-react";
import scrollToSection from "@/utils/scrollToSection";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-hero flex items-center justify-center shadow-soft">
              <Compass className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">Pivot Tracker</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Features
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('cta')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              Get Started
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex"
              onClick={() => window.location.href = '/auth'}
            >
              Sign In
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="shadow-soft"
              onClick={() => window.location.href = '/dashboard'}
            >
              Dashboard
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
