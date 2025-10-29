import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Coffee, User, Sparkles, Calendar, Mail, CheckCircle2, Users } from "lucide-react";

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

export const TeamFinderSection = () => {
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
    <div className="space-y-6 mt-8">
      {/* Header */}
      <div className="bg-gradient-hero/10 rounded-2xl p-8 border border-primary/20">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow">
            <Users className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-2xl font-heading font-bold text-foreground">
              🚀 Find Your Dream Team
            </h3>
            <p className="text-muted-foreground">
              Discover potential co-founders and team members
            </p>
          </div>
        </div>
      </div>

      {/* Challenges Section */}
      <Card className="p-6 bg-gradient-accent/5 border-secondary/20">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-secondary" />
          <h3 className="text-xl font-heading font-semibold">Weekly Challenges 🎯</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 
              className={`w-5 h-5 mt-0.5 ${
                completedChallenges.includes("scheduled_chat") 
                  ? "text-secondary" 
                  : "text-muted-foreground"
              }`} 
            />
            <div>
              <p className="font-medium text-foreground">Schedule Your First Coffee Chat</p>
              <p className="text-sm text-muted-foreground">
                Pick one team member and schedule a 30-min chat this week
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 mt-0.5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Write Your Introduction Message</p>
              <p className="text-sm text-muted-foreground">
                Craft a 2-line message explaining who you are and what you're building
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => setSelectedCategory(null)}
          size="sm"
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? "default" : "outline"}
            onClick={() => setSelectedCategory(cat)}
            size="sm"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Team Members Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredMembers.map((member) => {
          const isSelected = selectedMembers.find((m) => m.id === member.id);
          
          return (
            <Card
              key={member.id}
              className={`p-6 transition-all hover:shadow-glow cursor-pointer ${
                isSelected ? "border-primary shadow-glow" : ""
              }`}
              onClick={() => toggleMemberSelection(member)}
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-foreground mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{member.role}</p>
                  
                  <div className="flex flex-wrap gap-1 mb-3">
                    {member.expertise.slice(0, 3).map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-sm text-foreground mb-3 line-clamp-2">{member.bio}</p>
                  
                  <button
                    className="text-sm text-primary hover:underline"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({
                        title: "LinkedIn Profile",
                        description: "This is a demo profile. In a real app, this would link to their actual LinkedIn.",
                      });
                    }}
                  >
                    View LinkedIn Profile →
                  </button>
                </div>
              </div>
              
              {isSelected && (
                <div className="mt-4 pt-4 border-t border-border">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Selected
                  </Badge>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Coffee Chat Scheduler */}
      {selectedMembers.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Card className="p-6 shadow-strong bg-card border-primary/20">
            <div className="flex items-center gap-4">
              <Coffee className="w-6 h-6 text-primary" />
              <div>
                <p className="font-semibold text-foreground">
                  {selectedMembers.length} member{selectedMembers.length > 1 ? "s" : ""} selected
                </p>
                <p className="text-sm text-muted-foreground">Ready to schedule a coffee chat?</p>
              </div>
              <Button onClick={() => setShowCoffeeChat(true)} className="ml-4">
                Schedule Chat
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Coffee Chat Dialog */}
      <Dialog open={showCoffeeChat} onOpenChange={setShowCoffeeChat}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-primary" />
              Schedule Coffee Chat
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2 text-foreground">Selected Team Members:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((member) => (
                  <Badge key={member.id} variant="secondary">
                    {member.name} - {member.role}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="chat-date">Date</Label>
                <Input
                  id="chat-date"
                  type="date"
                  value={chatDetails.date}
                  onChange={(e) => setChatDetails({ ...chatDetails, date: e.target.value })}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <Label htmlFor="chat-time">Time</Label>
                <Input
                  id="chat-time"
                  type="time"
                  value={chatDetails.time}
                  onChange={(e) => setChatDetails({ ...chatDetails, time: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Duration</Label>
              <select
                id="duration"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={chatDetails.duration}
                onChange={(e) => setChatDetails({ ...chatDetails, duration: e.target.value })}
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>

            <div>
              <Label htmlFor="message">Introduction Message</Label>
              <Textarea
                id="message"
                placeholder={
                  selectedMembers[0]
                    ? generateCoffeePrompt(selectedMembers[0])
                    : "Write your introduction message..."
                }
                value={chatDetails.message}
                onChange={(e) => setChatDetails({ ...chatDetails, message: e.target.value })}
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                💡 Tip: Be genuine, mention what interested you about their profile, and suggest a specific topic
              </p>
            </div>

            <div className="bg-accent-light p-4 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2 text-foreground">
                <Mail className="w-4 h-4" />
                Sample Conversation Starters:
              </h4>
              <ul className="text-sm space-y-1 text-foreground">
                <li>• "What's your biggest lesson from [their previous company]?"</li>
                <li>• "How did you transition into [their role]?"</li>
                <li>• "What excites you most about early-stage startups?"</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCoffeeChat(false)}>
                Cancel
              </Button>
              <Button onClick={scheduleCoffeeChat}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Coffee Chat
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Networking Tips */}
      <Card className="p-6 bg-gradient-subtle">
        <h3 className="font-heading font-bold text-foreground mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Networking Tips 💡
        </h3>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex gap-3">
            <span className="text-primary font-bold">1.</span>
            <span>
              <strong>Be Clear About Your Ask:</strong> Are you looking for a co-founder, advisor, or just feedback?
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">2.</span>
            <span>
              <strong>Listen More Than You Talk:</strong> Ask about their experience and learn from their journey.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">3.</span>
            <span>
              <strong>Follow Up:</strong> Send a thank-you message within 24 hours. Reference something specific from your chat.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-primary font-bold">4.</span>
            <span>
              <strong>Offer Value:</strong> Think about how you can help them too - networking is a two-way street!
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
