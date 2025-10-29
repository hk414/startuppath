import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Sparkles, Search, MessageCircle, Calendar } from "lucide-react";

const MentorMatching = ({ userId }: { userId: string }) => {
  const [role, setRole] = useState<"mentee" | "mentor" | null>(null);
  const [expertise, setExpertise] = useState("");
  const [stage, setStage] = useState("");
  const [bio, setBio] = useState("");

  const stages = ["Ideation", "MVP Development", "Early Traction", "Growth", "Scaling"];
  const expertiseAreas = [
    "Product Development",
    "Marketing & Growth",
    "Fundraising",
    "Team Building",
    "Sales",
    "Technology",
    "Strategy",
    "Operations",
  ];

  // Mock mentor data
  const suggestedMentors = [
    {
      id: 1,
      name: "Sarah Chen",
      expertise: "Product Development",
      stage: "Growth",
      bio: "10+ years building SaaS products. Scaled 2 startups to $10M ARR.",
      matchScore: 95,
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      expertise: "Fundraising",
      stage: "Early Traction",
      bio: "Angel investor and founder. Raised $50M+ across 3 companies.",
      matchScore: 88,
    },
    {
      id: 3,
      name: "Emily Watson",
      expertise: "Marketing & Growth",
      stage: "MVP Development",
      bio: "Growth hacker who took 2 startups from 0 to 100k users.",
      matchScore: 82,
    },
  ];

  if (!role) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light border border-accent/20 text-accent text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Matching
          </div>
          <h2 className="text-4xl font-bold text-foreground">
            Mentor-Mentee Matching
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with experienced mentors or help other founders on their journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            className="p-8 cursor-pointer hover:shadow-strong transition-all hover:scale-[1.02] group"
            onClick={() => setRole("mentee")}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <User className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Find a Mentor</h3>
                <p className="text-muted-foreground">
                  Get matched with experienced founders who can guide you through your startup challenges
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  1-on-1 guidance sessions
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Industry-specific expertise
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Network introductions
                </li>
              </ul>
            </div>
          </Card>

          <Card
            className="p-8 cursor-pointer hover:shadow-strong transition-all hover:scale-[1.02] group"
            onClick={() => setRole("mentor")}
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform">
                <Sparkles className="w-7 h-7 text-secondary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-2">Become a Mentor</h3>
                <p className="text-muted-foreground">
                  Share your experience and help other founders succeed on their journey
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Give back to the community
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Build your network
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                  Stay sharp & inspired
                </li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (role === "mentor") {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Become a Mentor</h2>
            <p className="text-muted-foreground mt-1">Share your expertise with founders</p>
          </div>
          <Button variant="ghost" onClick={() => setRole(null)}>
            ← Back
          </Button>
        </div>

        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <Label>Your Expertise Area</Label>
              <Select value={expertise} onValueChange={setExpertise}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your main expertise" />
                </SelectTrigger>
                <SelectContent>
                  {expertiseAreas.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Startup Stage You Can Help With</Label>
              <Select value={stage} onValueChange={setStage}>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Your Bio & Experience</Label>
              <Textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Share your background, achievements, and what you can help founders with..."
                rows={6}
              />
            </div>

            <Button className="w-full" size="lg">
              Create Mentor Profile
            </Button>
          </div>
        </Card>

        <Card className="p-6 bg-accent-light border-accent/20">
          <h3 className="font-semibold text-foreground mb-2">Coming Soon! 🎉</h3>
          <p className="text-sm text-muted-foreground">
            This feature is under development. You'll be able to create your mentor profile, set availability, and connect with mentees automatically!
          </p>
        </Card>
      </div>
    );
  }

  // Mentee view
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Find Your Mentor</h2>
          <p className="text-muted-foreground mt-1">AI-matched mentors based on your needs</p>
        </div>
        <Button variant="ghost" onClick={() => setRole(null)}>
          ← Back
        </Button>
      </div>

      {/* Search Filters */}
      <Card className="p-6">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <Label>I Need Help With</Label>
            <Select value={expertise} onValueChange={setExpertise}>
              <SelectTrigger>
                <SelectValue placeholder="Select expertise area" />
              </SelectTrigger>
              <SelectContent>
                {expertiseAreas.map((area) => (
                  <SelectItem key={area} value={area}>
                    {area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>My Current Stage</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger>
                <SelectValue placeholder="Select your stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Find Mentors
            </Button>
          </div>
        </div>
      </Card>

      {/* Suggested Mentors */}
      <div>
        <h3 className="text-xl font-bold text-foreground mb-4">
          Recommended Mentors for You
        </h3>
        <div className="grid gap-4">
          {suggestedMentors.map((mentor) => (
            <Card key={mentor.id} className="p-6 hover:shadow-strong transition-shadow">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-hero flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {mentor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-foreground">
                        {mentor.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{mentor.expertise}</Badge>
                        <Badge variant="outline">{mentor.stage}</Badge>
                        <span className="text-xs text-primary font-medium">
                          {mentor.matchScore}% Match
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">{mentor.bio}</p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Connect
                  </Button>
                  <Button size="sm" variant="outline">
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-accent-light border-accent/20">
        <h3 className="font-semibold text-foreground mb-2">Coming Soon! 🎉</h3>
        <p className="text-sm text-muted-foreground">
          This feature is under development. Soon you'll be able to message mentors, book 1-on-1 sessions, and get personalized guidance based on your startup stage and pivot history!
        </p>
      </Card>
    </div>
  );
};

export default MentorMatching;
