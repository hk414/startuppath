import { Button } from "@/components/ui/button";
import { ArrowRight, Users } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container max-w-5xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-hero p-12 md:p-16 shadow-strong">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '32px 32px',
              color: 'white'
            }} />
          </div>

          {/* Content */}
          <div className="relative z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground text-sm font-medium">
              <Users className="w-4 h-4" />
              Join 500+ Startups Already Learning Together
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-primary-foreground max-w-3xl mx-auto leading-tight">
              Ready to Turn Your Startup Story Into Shared Wisdom?
            </h2>

            <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Start documenting your journey today and help build a living knowledge base for the next generation of founders.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button variant="accent" size="lg" className="group bg-card text-foreground hover:bg-card/90">
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Schedule a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
