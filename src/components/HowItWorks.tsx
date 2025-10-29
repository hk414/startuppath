import { CheckCircle2 } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Document Your Journey",
    description: "Start by logging your startup's pivots, decisions, and key milestones in an intuitive timeline format.",
  },
  {
    number: "02",
    title: "Visualize & Reflect",
    description: "See your decision trees come to life, analyze patterns, and receive AI-powered insights on your progress.",
  },
  {
    number: "03",
    title: "Connect & Learn",
    description: "Get matched with mentors, access relevant case studies, and share your lessons with the community.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 px-4 bg-gradient-subtle">
      <div className="container max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Three simple steps to transform your startup journey into shared wisdom
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12 relative">
          {/* Connecting Line (hidden on mobile) */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-accent to-secondary opacity-20" 
               style={{ top: '4rem', zIndex: 0 }} 
          />

          {steps.map((step, index) => (
            <div key={index} className="relative space-y-6 text-center md:text-left">
              {/* Number Badge */}
              <div className="relative inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-hero text-primary-foreground text-2xl font-bold shadow-glow mx-auto md:mx-0">
                {step.number}
              </div>

              {/* Content */}
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground flex items-center justify-center md:justify-start gap-2">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
