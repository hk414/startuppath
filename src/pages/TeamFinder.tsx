import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Coffee, User, Sparkles, Calendar, Mail, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: "Tech" | "Business" | "Design" | "Marketing";
  expertise: string[];
  bio: string;
  linkedinUrl: string;
  available: boolean;
}

const teamMembers: TeamMember[] = [
  {
    id: "1",
    name: "Jamie Parker",
    role: "Full-Stack Developer",
    category: "Tech",
    expertise: ["React", "Node.js", "AWS", "Mobile Development"],
    bio: "Ex-Google engineer with 8 years building scalable products. Love early-stage startups!",
    linkedinUrl: "https://linkedin.com/in/jamie-parker",
    available: true,
  },
  {
    id: "2",
    name: "Alex Chen",
    role: "AI/ML Engineer",
    category: "Tech",
    expertise: ["Python", "TensorFlow", "NLP", "Data Science"],
    bio: "PhD in AI, passionate about leveraging ML for social impact. Previously at OpenAI.",
    linkedinUrl: "https://linkedin.com/in/alex-chen",
    available: true,
  },
  {
    id: "3",
    name: "Morgan Lee",
    role: "Business Strategist",
    category: "Business",
    expertise: ["Growth Strategy", "Fundraising", "Operations", "B2B Sales"],
    bio: "Former McKinsey consultant. Helped 3 startups reach Series A. Let's talk strategy!",
    linkedinUrl: "https://linkedin.com/in/morgan-lee",
    available: true,
  },
  {
    id: "4",
    name: "Sam Rodriguez",
    role: "CFO / Finance Lead",
    category: "Business",
    expertise: ["Financial Modeling", "Investor Relations", "Unit Economics"],
    bio: "Ex-Goldman Sachs. Love helping founders understand their numbers.",
    linkedinUrl: "https://linkedin.com/in/sam-rodriguez",
    available: true,
  },
  {
    id: "5",
    name: "Taylor Nguyen",
    role: "Product Designer",
    category: "Design",
    expertise: ["UI/UX", "Figma", "User Research", "Design Systems"],
    bio: "Award-winning designer from Airbnb. Obsessed with delightful user experiences.",
    linkedinUrl: "https://linkedin.com/in/taylor-nguyen",
    available: true,
  },
  {
    id: "6",
    name: "Jordan Kim",
    role: "Brand Designer",
    category: "Design",
    expertise: ["Brand Identity", "Visual Design", "Storytelling"],
    bio: "Designed brands for 20+ startups. Let's make your startup unforgettable.",
    linkedinUrl: "https://linkedin.com/in/jordan-kim",
    available: true,
  },
  {
    id: "7",
    name: "Casey Rivera",
    role: "Growth Marketer",
    category: "Marketing",
    expertise: ["SEO", "Content Marketing", "Paid Ads", "Analytics"],
    bio: "Grew 2 startups from 0 to 100k users. Data-driven marketer who loves experimentation.",
    linkedinUrl: "https://linkedin.com/in/casey-rivera",
    available: true,
  },
  {
    id: "8",
    name: "Riley Thompson",
    role: "Social Media Expert",
    category: "Marketing",
    expertise: ["Community Building", "Influencer Marketing", "Social Strategy"],
    bio: "Built communities of 500k+ followers. Let's make your brand go viral!",
    linkedinUrl: "https://linkedin.com/in/riley-thompson",
    available: true,
  },
];

const TeamFinder = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedMembers, setSelectedMembers] = useState<TeamMember[]>([]);
  const [showCoffeeChat, setShowCoffeeChat] = useState(false);
  const [chatDetails, setChatDetails] = useState({
    date: "",
    time: "",
    message: "",
    duration: "30",
  });
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([]);

  const categories = ["Tech", "Business", "Design", "Marketing"];

  const toggleMemberSelection = (member: TeamMember) => {
    if (selectedMembers.find((m) => m.id === member.id)) {
      setSelectedMembers(selectedMembers.filter((m) => m.id !== member.id));
    } else {
      setSelectedMembers([...selectedMembers, member]);
    }
  };

  const generateCoffeePrompt = (member: TeamMember) => {
    const prompts = [
      `Hi ${member.name.split(" ")[0]}, I'd love to hear about your experience in ${member.role} and explore potential collaboration on my startup idea.`,
      `Hey ${member.name.split(" ")[0]}, I'm building a startup and would love to learn from your expertise in ${member.expertise[0]}. Would you be open to a quick coffee chat?`,
      `Hi ${member.name.split(" ")[0]}, I came across your profile and was impressed by your ${member.category.toLowerCase()} background. I'd love to discuss a potential partnership opportunity.`,
    ];
    return prompts[Math.floor(Math.random() * prompts.length)];
  };

  const scheduleCoffeeChat = () => {
    if (!chatDetails.date || !chatDetails.time) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time for your coffee chat.",
        variant: "destructive",
      });
      return;
    }

    const memberNames = selectedMembers.map((m) => m.name.split(" ")[0]).join(", ");
    
    toast({
      title: "Coffee Chat Scheduled! ☕",
      description: `Your ${chatDetails.duration}-minute chat with ${memberNames} is set for ${new Date(
        `${chatDetails.date}T${chatDetails.time}`
      ).toLocaleDateString()} at ${chatDetails.time}.`,
    });

    if (!completedChallenges.includes("scheduled_chat")) {
      setCompletedChallenges([...completedChallenges, "scheduled_chat"]);
    }

    setShowCoffeeChat(false);
    setSelectedMembers([]);
    setChatDetails({ date: "", time: "", message: "", duration: "30" });
  };

  const filteredMembers = selectedCategory
    ? teamMembers.filter((m) => m.category === selectedCategory)
    : teamMembers;

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/guidebook")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Guidebook
          </Button>
        </div>

        <div className="text-center space-y-3">
          <h1 className="text-4xl font-bold text-foreground">
            🚀 Team Finder
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover potential co-founders and team members. Build your dream team, one coffee chat at a time!
          </p>
        </div>

        {/* Challenges Section */}
        <Card className="p-6 bg-gradient-hero/5 border-primary/20">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
            <h2 className="text-xl font-semibold">Weekly Challenges 🎯</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div className={`p-4 rounded-lg border ${completedChallenges.includes("scheduled_chat") ? "bg-primary/10 border-primary" : "bg-background border-border"}`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold">Schedule Your First Coffee Chat</p>
                  <p className="text-sm text-muted-foreground">Connect with at least one team member this week</p>
                </div>
                {completedChallenges.includes("scheduled_chat") && (
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                )}
              </div>
            </div>
            <div className="p-4 rounded-lg border bg-background border-border">
              <p className="font-semibold">Write Your Introduction</p>
              <p className="text-sm text-muted-foreground">Practice your 2-line pitch to potential co-founders</p>
            </div>
          </div>
        </Card>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
          >
            All Roles
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Selected Members Bar */}
        {selectedMembers.length > 0 && (
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="font-semibold">
                  {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected
                </span>
              </div>
              <Button onClick={() => setShowCoffeeChat(true)} className="gap-2">
                <Coffee className="w-4 h-4" />
                Schedule Coffee Chat
              </Button>
            </div>
          </Card>
        )}

        {/* Team Members Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => {
            const isSelected = selectedMembers.find((m) => m.id === member.id);
            return (
              <Card
                key={member.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-strong ${
                  isSelected ? "border-primary bg-primary/5" : ""
                }`}
                onClick={() => toggleMemberSelection(member)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-white text-xl font-bold">
                      {member.name.charAt(0)}
                    </div>
                    <Badge variant={isSelected ? "default" : "secondary"}>
                      {member.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg">{member.name}</h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>

                  <p className="text-sm text-muted-foreground">{member.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {member.expertise.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(member.linkedinUrl, "_blank");
                      }}
                    >
                      <Mail className="w-4 h-4" />
                      LinkedIn Profile
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Networking Tips */}
        <Card className="p-6 bg-gradient-hero/5 border-accent/20">
          <h3 className="text-lg font-semibold mb-3">💡 Networking Tips</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>✨ Be authentic - share your genuine vision and passion</li>
            <li>🎯 Focus on mutual benefit - what value can you both bring?</li>
            <li>⏰ Respect their time - keep coffee chats to 30 minutes max</li>
            <li>📝 Follow up within 24 hours with a thank you message</li>
            <li>🤝 Think long-term - building relationships takes time</li>
          </ul>
        </Card>
      </div>

      {/* Coffee Chat Dialog */}
      <Dialog open={showCoffeeChat} onOpenChange={setShowCoffeeChat}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5" />
              Schedule Coffee Chat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm font-semibold mb-2">Selected Members:</p>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <Badge key={member.id}>{member.name}</Badge>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={chatDetails.date}
                  onChange={(e) =>
                    setChatDetails({ ...chatDetails, date: e.target.value })
                  }
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={chatDetails.time}
                  onChange={(e) =>
                    setChatDetails({ ...chatDetails, time: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={chatDetails.duration}
                onChange={(e) =>
                  setChatDetails({ ...chatDetails, duration: e.target.value })
                }
                min="15"
                step="15"
              />
            </div>

            <div>
              <Label htmlFor="message">Introduction Message</Label>
              <Textarea
                id="message"
                value={chatDetails.message}
                onChange={(e) =>
                  setChatDetails({ ...chatDetails, message: e.target.value })
                }
                placeholder={
                  selectedMembers.length > 0
                    ? generateCoffeePrompt(selectedMembers[0])
                    : "Write a brief introduction..."
                }
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-2">
                💡 Tip: Keep it brief, authentic, and mention specific areas you'd like to discuss
              </p>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button variant="outline" onClick={() => setShowCoffeeChat(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleCoffeeChat} className="gap-2">
                <Calendar className="w-4 h-4" />
                Schedule Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TeamFinder;
