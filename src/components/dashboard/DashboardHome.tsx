import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, GitBranch, Users, ArrowRight } from "lucide-react";

interface DashboardHomeProps {
  onNavigate: (section: "home" | "guidebook" | "journal" | "pivots" | "lessons" | "matching") => void;
}

const sections = [
  {
    id: "guidebook" as const,
    title: "Guidebook Library",
    description: "Step-by-step startup guides from idea to funding. Learn from successful founders and get actionable frameworks.",
    icon: BookOpen,
    color: "bg-primary",
    features: ["Interactive chapters", "Progress tracking", "Pro tips & challenges"],
  },
  {
    id: "journal" as const,
    title: "Pivot Tracker",
    description: "Document your startup journey with daily reflections, pivot histories, and lessons learned.",
    icon: GitBranch,
    color: "bg-accent",
    features: ["Daily journal", "Pivot documentation", "Lessons library"],
  },
  {
    id: "matching" as const,
    title: "Mentor Matching",
    description: "Connect with experienced mentors or help other founders based on your expertise and startup stage.",
    icon: Users,
    color: "bg-secondary",
    features: ["AI-powered matching", "1-on-1 sessions", "Community insights"],
  },
];

const DashboardHome = ({ onNavigate }: DashboardHomeProps) => {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Welcome to Your Startup Hub 🚀
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Everything you need to navigate your startup journey - from learning to documenting to connecting with mentors.
        </p>
      </div>

      {/* Main Sections */}
      <div className="grid md:grid-cols-3 gap-6">
        {sections.map((section) => (
          <Card
            key={section.id}
            className="p-6 hover:shadow-strong transition-all hover:scale-[1.02] cursor-pointer group"
            onClick={() => onNavigate(section.id)}
          >
            <div className="space-y-4">
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl ${section.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                <section.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                  {section.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {section.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {section.features.map((feature, idx) => (
                  <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button className="w-full group-hover:shadow-soft transition-shadow" variant="outline">
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="p-8 bg-gradient-subtle">
        <h3 className="text-xl font-bold text-foreground mb-6 text-center">
          Your Progress at a Glance
        </h3>
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-primary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Chapters Completed</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-accent mb-1">0</div>
            <div className="text-sm text-muted-foreground">Pivots Documented</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-secondary mb-1">0</div>
            <div className="text-sm text-muted-foreground">Mentor Sessions</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardHome;
