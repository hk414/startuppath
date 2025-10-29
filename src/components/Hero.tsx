import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Users, Zap } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";
import scrollToSection from "@/utils/scrollToSection";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Background with Advanced Overlays */}
      <div className="absolute inset-0 z-0">
        {/* Background Image */}
        <img 
          src={heroBg} 
          alt="Startup journey network visualization" 
          className="w-full h-full object-cover opacity-10 dark:opacity-5"
        />
        
        {/* Multi-layered Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-accent-light/5 to-background" />
        <div className="absolute inset-0 bg-gradient-to-tr from-secondary-light/5 via-transparent to-primary/5" />
        
        {/* Premium Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Premium Decorative Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 border border-primary/10 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border border-secondary/10 rounded-full" />
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4 py-32 md:py-40">
        <div className="max-w-5xl mx-auto text-center space-y-10">
          {/* Premium Badge with Glow */}
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-accent-light to-primary/10 border border-primary/20 text-primary-deep dark:text-primary font-semibold shadow-glow backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-sm tracking-wide">Turn Every Pivot Into Shared Wisdom</span>
          </div>

          {/* Premium Main Heading with Better Typography */}
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.1] text-foreground animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
            Document Your{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Startup Journey
              </span>
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-hero blur-sm" />
            </span>
            <br />
            <span className="text-5xl md:text-7xl bg-gradient-to-r from-secondary via-secondary to-secondary/80 bg-clip-text text-transparent">
              Accelerate Innovation
            </span>
          </h1>

          {/* Premium Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
            Transform every decision, pivot, and breakthrough into{" "}
            <span className="text-foreground font-semibold">actionable insights</span> that power the entire entrepreneurial ecosystem.
          </p>

          {/* Premium CTA Buttons with Enhanced Styling */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pt-6 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
            <Button 
              variant="hero" 
              size="lg" 
              className="group shadow-glow hover:shadow-glow-secondary transition-all duration-300 px-8 py-7 text-lg font-semibold"
              onClick={() => scrollToSection('cta')}
            >
              <Zap className="w-5 h-5 mr-2" />
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-primary/30 hover:border-primary hover:bg-primary/5 shadow-medium hover:shadow-strong transition-all duration-300 px-8 py-7 text-lg font-semibold backdrop-blur-sm"
              onClick={() => scrollToSection('features')}
            >
              Explore Features
            </Button>
          </div>

          {/* Premium Stats Section with Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-20 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-700">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl" />
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="text-5xl font-black bg-gradient-hero bg-clip-text text-transparent mb-2">500+</div>
                <div className="text-sm font-medium text-muted-foreground tracking-wide">Startups Tracked</div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl" />
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-secondary/10 rounded-xl">
                    <Sparkles className="w-6 h-6 text-secondary" />
                  </div>
                </div>
                <div className="text-5xl font-black bg-gradient-accent bg-clip-text text-transparent mb-2">1.2K+</div>
                <div className="text-sm font-medium text-muted-foreground tracking-wide">Pivots Documented</div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-hero opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300 blur-xl" />
              <div className="relative bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-medium hover:shadow-strong transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-accent/10 rounded-xl">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                </div>
                <div className="text-5xl font-black bg-gradient-hero bg-clip-text text-transparent mb-2">300+</div>
                <div className="text-sm font-medium text-muted-foreground tracking-wide">Mentors Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Bottom Gradient with Enhanced Depth */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
    </section>
  );
};

export default Hero;
