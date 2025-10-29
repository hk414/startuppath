import { Card } from "@/components/ui/card";
import timelineIcon from "@/assets/timeline-icon.png";
import treeIcon from "@/assets/tree-icon.png";
import mentorIcon from "@/assets/mentor-icon.png";
import guidebookIcon from "@/assets/guidebook-icon.png";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: timelineIcon,
      title: t('features.timeline.title'),
      description: t('features.timeline.description'),
      gradient: "from-primary/10 to-primary-glow/10",
    },
    {
      icon: treeIcon,
      title: t('features.challenges.title'),
      description: t('features.challenges.description'),
      gradient: "from-secondary/10 to-secondary/20",
    },
    {
      icon: mentorIcon,
      title: t('features.mentor.title'),
      description: t('features.mentor.description'),
      gradient: "from-accent/10 to-accent/20",
    },
    {
      icon: guidebookIcon,
      title: t('features.guidebook.title'),
      description: t('features.guidebook.description'),
      gradient: "from-primary-glow/10 to-primary/10",
    },
  ];

  return (
    <section id="features" className="py-24 px-4 bg-background scroll-mt-20">
      <div className="container max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground">
            {t('features.title')}{" "}
            <span className="bg-gradient-accent bg-clip-text text-transparent">
              {t('features.titleHighlight')}
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className={`p-8 border-2 hover:border-primary/30 transition-all duration-300 hover:shadow-strong bg-gradient-to-br ${feature.gradient} group`}
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
