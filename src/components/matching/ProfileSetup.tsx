import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X } from "lucide-react";

interface ProfileSetupProps {
  userId: string;
  onComplete: () => void;
}

const ProfileSetup = ({ userId, onComplete }: ProfileSetupProps) => {
  const [profileType, setProfileType] = useState<"mentor" | "mentee" | null>(null);
  
  // Mentor fields
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [bio, setBio] = useState("");
  const [expertise, setExpertise] = useState<string[]>([]);
  const [industries, setIndustries] = useState<string[]>([]);
  const [yearsExp, setYearsExp] = useState("");
  const [availability, setAvailability] = useState("");
  const [timezone, setTimezone] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  
  // Mentee fields
  const [startupName, setStartupName] = useState("");
  const [startupStage, setStartupStage] = useState("");
  const [industry, setIndustry] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);

  const expertiseOptions = ["product", "marketing", "sales", "fundraising", "operations", "tech", "hr", "legal", "design"];
  const stageOptions = ["idea", "prototype", "early_growth", "scaling", "established"];

  const handleSubmit = async () => {
    try {
      if (profileType === "mentor") {
        const { error } = await supabase.from('mentor_profiles').insert({
          user_id: userId,
          title,
          company,
          bio,
          expertise_areas: expertise as any,
          industries,
          years_experience: parseInt(yearsExp),
          availability,
          timezone,
          linkedin_url: linkedinUrl,
          is_active: true
        } as any);

        if (error) throw error;
      } else {
        const { error } = await supabase.from('mentee_profiles').insert({
          user_id: userId,
          startup_name: startupName,
          startup_stage: startupStage as any,
          industry,
          goals,
          challenges,
          timezone
        } as any);

        if (error) throw error;
      }

      toast({
        title: "Profile Created! 🎉",
        description: `Your ${profileType} profile is ready.`,
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!profileType) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="max-w-2xl w-full p-8">
          <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
            Welcome to Mentor Matching!
          </h2>
          <p className="text-muted-foreground mb-8 text-center">
            Are you looking for mentorship or offering it?
          </p>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Card 
              className="p-6 cursor-pointer hover:shadow-strong transition-all hover:scale-[1.02]"
              onClick={() => setProfileType("mentee")}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">I'm a Founder</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Seeking guidance from experienced mentors
                  </p>
                </div>
              </div>
            </Card>

            <Card 
              className="p-6 cursor-pointer hover:shadow-strong transition-all hover:scale-[1.02]"
              onClick={() => setProfileType("mentor")}
            >
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-3xl">🎓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-foreground">I'm a Mentor</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Sharing my experience with startup founders
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          Create Your {profileType === "mentor" ? "Mentor" : "Founder"} Profile
        </h2>

        <div className="space-y-6">
          {profileType === "mentor" ? (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., CEO, VP of Product"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell founders about your experience..."
                  rows={4}
                />
              </div>

              <div>
                <Label>Expertise Areas</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {expertiseOptions.map((exp) => (
                    <Badge
                      key={exp}
                      variant={expertise.includes(exp) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (expertise.includes(exp)) {
                          setExpertise(expertise.filter(e => e !== exp));
                        } else {
                          setExpertise([...expertise, exp]);
                        }
                      }}
                    >
                      {exp}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="yearsExp">Years of Experience</Label>
                  <Input
                    id="yearsExp"
                    type="number"
                    value={yearsExp}
                    onChange={(e) => setYearsExp(e.target.value)}
                    placeholder="10"
                  />
                </div>
                <div>
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    placeholder="EST, PST, etc."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Availability</Label>
                <Input
                  id="availability"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  placeholder="e.g., Weekday evenings, Weekends"
                />
              </div>

              <div>
                <Label htmlFor="linkedin">LinkedIn URL (optional)</Label>
                <Input
                  id="linkedin"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>
            </>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="startupName">Startup Name</Label>
                  <Input
                    id="startupName"
                    value={startupName}
                    onChange={(e) => setStartupName(e.target.value)}
                    placeholder="Your startup"
                  />
                </div>
                <div>
                  <Label htmlFor="stage">Startup Stage</Label>
                  <Select value={startupStage} onValueChange={setStartupStage}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stage" />
                    </SelectTrigger>
                    <SelectContent>
                      {stageOptions.map((stage) => (
                        <SelectItem key={stage} value={stage}>
                          {stage.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input
                  id="industry"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  placeholder="e.g., FinTech, HealthTech, SaaS"
                  required
                />
              </div>

              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <Input
                  id="timezone"
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  placeholder="EST, PST, etc."
                />
              </div>
            </>
          )}

          <div className="flex gap-4 justify-end pt-4">
            <Button variant="outline" onClick={() => setProfileType(null)}>
              Back
            </Button>
            <Button onClick={handleSubmit}>
              Create Profile
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSetup;