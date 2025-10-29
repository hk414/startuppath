import { Card } from "@/components/ui/card";
import timelineIcon from "@/assets/timeline-icon.png";
import treeIcon from "@/assets/tree-icon.png";
import mentorIcon from "@/assets/mentor-icon.png";
import guidebookIcon from "@/assets/guidebook-icon.png";

const features = [
  {
    icon: timelineIcon,
    title: "Interactive Timeline",
    description: "Log every pivot, decision, and milestone in your startup journey with a visual timeline that brings your story to life.",
    gradient: "from-primary/10 to-primary-glow/10",
  },
  {
    icon: treeIcon,
    title: "Decision Trees",
    description: "Visualize how each choice led to outcomes, creating a clear map of cause and effect throughout your startup evolution.",
    gradient: "from-secondary/10 to-secondary/20",
  },
  {
    icon: mentorIcon,
    title: "AI Mentor Matching",
    description: "Get paired with experienced mentors based on your industry, startup stage, and unique pivot history for personalized guidance.",
    gradient: "from-accent/10 to-accent/20",
  },
  {
    icon: guidebookIcon,
    title: "Guidebook Library",
    description: "Access curated best practices, frameworks, and case studies from real startup journeys to accelerate your learning.",
    gradient: "from-primary-glow/10 to-primary/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            Everything You Need to{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              Learn and Grow
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            A complete platform designed to capture, analyze, and share the entrepreneurial journey
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-8 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-strong bg-gradient-to-br ${feature.gradient} group cursor-pointer`}
            >
              <div className="flex flex-col items-start gap-6">
                {/* Icon */}
                <div className="w-16 h-16 rounded-2xl bg-card shadow-soft flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <img 
                    src={feature.icon} 
                    alt={`${feature.title} icon`} 
                    className="w-10 h-10"
                  />
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
