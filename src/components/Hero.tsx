import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import scrollToSection from "@/utils/scrollToSection";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t } = useLanguage();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Lovable-inspired Gradient Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 via-transparent to-blue-600/10" />
        
        {/* Premium Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/15 rounded-full blur-[140px]" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-32 md:py-40">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Premium Badge */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground/5 backdrop-blur-md border border-foreground/10 text-foreground font-semibold shadow-glow animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm tracking-wide">{t('hero.badge')}</span>
          </div>

          {/* Main Heading - Lovable Style */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.1] text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            {t('hero.title1')}{" "}
            <span className="relative inline-block bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {t('hero.title2')}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            {t('hero.subtitle')}{" "}
            <span className="text-foreground font-semibold">{t('hero.subtitleBold')}</span> {t('hero.subtitleEnd')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button 
              variant="default" 
              size="lg" 
              className="group shadow-glow-secondary transition-all duration-300 px-8 py-7 text-lg font-semibold bg-gradient-to-r from-primary to-primary-glow hover:shadow-glow"
              onClick={() => window.location.href = '/auth'}
            >
              {t('hero.ctaStart')}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-foreground/20 hover:border-foreground/40 hover:bg-foreground/5 shadow-medium hover:shadow-strong transition-all duration-300 px-8 py-7 text-lg font-semibold backdrop-blur-sm"
              onClick={() => scrollToSection('features')}
            >
              {t('hero.ctaExplore')}
            </Button>
          </div>

          {/* Stats - Simplified */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-2">500+</div>
              <div className="text-sm font-medium text-muted-foreground tracking-wide">{t('hero.stats.startups')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-secondary to-secondary/80 bg-clip-text text-transparent mb-2">1.2K+</div>
              <div className="text-sm font-medium text-muted-foreground tracking-wide">{t('hero.stats.pivots')}</div>
            </div>
            
            <div className="text-center">
              <div className="text-5xl font-black bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">300+</div>
              <div className="text-sm font-medium text-muted-foreground tracking-wide">{t('hero.stats.mentors')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
    </section>
  );
};

export default Hero;
