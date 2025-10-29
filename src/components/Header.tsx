import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ZoomIn, ZoomOut } from "lucide-react";
import scrollToSection from "@/utils/scrollToSection";
import LanguageSelector from "@/components/LanguageSelector";
import { useLanguage } from "@/contexts/LanguageContext";
import { ThemeToggle } from "@/components/ThemeToggle";
import logo from "@/assets/startuppath-logo.jpg";

const Header = () => {
  const { t } = useLanguage();
  const [fontSize, setFontSize] = useState(100);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img src={logo} alt="StartUpPath Logo" className="w-10 h-10 rounded-lg shadow-soft" />
            <span className="text-xl font-bold text-foreground">StartUpPath</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {t('nav.features')}
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {t('nav.howItWorks')}
            </button>
            <button 
              onClick={() => window.location.href = '/guidebook'}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
            >
              {t('nav.guidebook')}
            </button>
            <button 
              onClick={() => window.location.href = '/challenges'}
              className="text-sm font-medium text-secondary hover:text-secondary/80 transition-colors cursor-pointer"
            >
              {t('nav.challenges')}
            </button>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-1 border border-border rounded-lg p-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={decreaseFontSize}
                aria-label="Decrease font size"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={increaseFontSize}
                aria-label="Increase font size"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            <LanguageSelector />
            <Button
              variant="ghost" 
              size="sm" 
              className="hidden md:inline-flex"
              onClick={() => window.location.href = '/auth'}
            >
              {t('nav.signIn')}
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="shadow-soft"
              onClick={() => window.location.href = '/dashboard'}
            >
              {t('nav.dashboard')}
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
