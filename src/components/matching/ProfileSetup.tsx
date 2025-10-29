import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { X, Crown, Lock, CheckCircle2, CreditCard } from "lucide-react";

interface ProfileSetupProps {
  userId: string;
  onComplete: () => void;
}

const ProfileSetup = ({ userId, onComplete }: ProfileSetupProps) => {
  const [profileType, setProfileType] = useState<"mentor" | "mentee" | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumStep, setPremiumStep] = useState<'info' | 'payment' | 'success'>('info');
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  
  
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
  const stageOptions = ["idea", "validation", "building", "testing", "launch", "growth", "scaling"];

  const handleSubmit = async () => {
    try {
      // Validation
      if (profileType === "mentor") {
        if (!title || expertise.length === 0) {
          toast({
            title: "Missing Information",
            description: "Please add your title and at least one expertise area.",
            variant: "destructive",
          });
          return;
        }
      } else {
        if (!industry || !startupStage) {
          const missing: string[] = [];
          if (!industry) missing.push("industry");
          if (!startupStage) missing.push("stage");
          toast({
            title: "Missing Information",
            description: `Please fill in: ${missing.join(", ")}. Goals and challenges are optional (press Enter to add).`,
            variant: "destructive",
          });
          return;
        }
      }

      if (profileType === "mentor") {
        const { error } = await supabase.from('mentor_profiles').insert({
          user_id: userId,
          title,
          company,
          bio,
          expertise_areas: expertise as any,
          industries,
          years_experience: parseInt(yearsExp) || null,
          availability,
          timezone,
          linkedin_url: linkedinUrl,
          is_active: true
        } as any);

        if (error) {
          console.error("Mentor profile error:", error);
          throw error;
        }
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

        if (error) {
          console.error("Mentee profile error:", error);
          throw error;
        }
      }

      toast({
        title: "Profile Created! 🎉",
        description: `Your ${profileType} profile is ready.`,
      });

      onComplete();
    } catch (error: any) {
      const errorMessage = error?.message || "Failed to create profile. Please try again.";
      toast({
        title: "Error Creating Profile",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Profile creation error:", error);
    }
  };

  const handlePayment = () => {
    setTimeout(() => {
      setPremiumStep('success');
      setTimeout(() => {
        setIsPremiumUser(true);
        setShowPremiumModal(false);
        setPremiumStep('info');
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setCardName("");
        toast({
          title: "Welcome to Premium! 🎉",
          description: "You now have access to mentor matching.",
        });
      }, 2000);
    }, 1500);
  };

  const handleMenteeSelection = () => {
    if (!isPremiumUser) {
      setShowPremiumModal(true);
      return;
    }
    setProfileType("mentee");
  };

  if (!profileType) {
    return (
      <>
        {/* Premium Modal */}
        <Dialog open={showPremiumModal} onOpenChange={(open) => {
          setShowPremiumModal(open);
          if (!open) {
            setPremiumStep('info');
            setCardNumber("");
            setExpiryDate("");
            setCvv("");
            setCardName("");
          }
        }}>
          <DialogContent className="sm:max-w-md">
            {premiumStep === 'info' && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <DialogTitle className="text-center text-2xl">Upgrade to Premium</DialogTitle>
                  <DialogDescription className="text-center space-y-4 pt-4">
                    <p className="text-base">
                      Unlock mentor matching and grow your startup with expert guidance.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p className="font-semibold text-foreground">Premium includes:</p>
                      <ul className="text-sm space-y-1 text-muted-foreground">
                        <li>🎓 Connect with experienced mentors</li>
                        <li>💬 Unlimited messaging with matches</li>
                        <li>📅 Schedule mentorship sessions</li>
                        <li>✨ AI-powered pivot insights</li>
                        <li>📊 Professional investor reports</li>
                      </ul>
                    </div>
                    <div className="pt-2">
                      <p className="text-2xl font-bold text-foreground">$29/month</p>
                      <p className="text-sm text-muted-foreground">Cancel anytime</p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowPremiumModal(false)}
                    className="flex-1"
                  >
                    Maybe Later
                  </Button>
                  <Button
                    onClick={() => setPremiumStep('payment')}
                    className="flex-1"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Continue
                  </Button>
                </div>
              </>
            )}

            {premiumStep === 'payment' && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-center text-2xl">Payment Details</DialogTitle>
                  <DialogDescription className="text-center">
                    Enter your payment information to complete upgrade
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Cardholder Name</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="card-number"
                        placeholder="1234 5678 9012 3456"
                        value={cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                          setCardNumber(formatted);
                        }}
                        maxLength={19}
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={expiryDate}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            setExpiryDate(value.slice(0, 2) + '/' + value.slice(2, 4));
                          } else {
                            setExpiryDate(value);
                          }
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setPremiumStep('info')}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={!cardName || cardNumber.length < 19 || expiryDate.length < 5 || cvv.length < 3}
                    className="flex-1"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Pay $29
                  </Button>
                </div>
              </>
            )}

            {premiumStep === 'success' && (
              <>
                <DialogHeader>
                  <div className="flex items-center justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-300">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                  </div>
                  <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
                  <DialogDescription className="text-center space-y-4 pt-4">
                    <p className="text-base text-foreground">
                      Welcome to Premium! 🎉
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You now have full access to mentor matching and all premium features.
                    </p>
                  </DialogDescription>
                </DialogHeader>
              </>
            )}
          </DialogContent>
        </Dialog>

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
                className="p-6 cursor-pointer hover:shadow-strong transition-all hover:scale-[1.02] relative"
                onClick={handleMenteeSelection}
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  {!isPremiumUser && (
                    <Badge variant="secondary" className="absolute top-3 right-3 text-xs">
                      <Crown className="w-3 h-3 mr-1" />
                      Premium
                    </Badge>
                  )}
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
                    <Badge variant="outline" className="mt-2">Free to join</Badge>
                  </div>
                </div>
              </Card>
            </div>
          </Card>
        </div>
      </>
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

              <div>
                <Label>Goals (optional)</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a goal (e.g., Raise seed funding)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = (e.currentTarget as HTMLInputElement).value.trim();
                          if (value && !goals.includes(value)) {
                            setGoals([...goals, value]);
                            (e.currentTarget as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Press Enter to add a goal</p>
                  <div className="flex flex-wrap gap-2">
                    {goals.map((goal, idx) => (
                      <Badge key={idx} variant="secondary">
                        {goal}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label>Challenges (optional)</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add a challenge (e.g., Finding product-market fit)"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const value = (e.currentTarget as HTMLInputElement).value.trim();
                          if (value && !challenges.includes(value)) {
                            setChallenges([...challenges, value]);
                            (e.currentTarget as HTMLInputElement).value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Press Enter to add a challenge</p>
                  <div className="flex flex-wrap gap-2">
                    {challenges.map((challenge, idx) => (
                      <Badge key={idx} variant="secondary">
                        {challenge}
                        <X
                          className="ml-1 h-3 w-3 cursor-pointer"
                          onClick={() => setChallenges(challenges.filter((_, i) => i !== idx))}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
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