import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { TeamFinderSection } from "@/components/guidebook/TeamFinderSection";
import { 
  Lightbulb, 
  Users, 
  Wrench, 
  Megaphone, 
  DollarSign,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Award,
  BookOpen,
  Home,
  Mic,
  Square,
  Loader2
} from "lucide-react";

const stages = [
  {
    id: "idea",
    title: "Just brainstorming ideas 💡",
    icon: Lightbulb,
    color: "bg-primary",
  },
  {
    id: "product",
    title: "Building my first product 🛠️",
    icon: Wrench,
    color: "bg-accent",
  },
  {
    id: "team",
    title: "Finding a team 👥",
    icon: Users,
    color: "bg-secondary",
  },
  {
    id: "users",
    title: "Getting early users 📣",
    icon: Megaphone,
    color: "bg-primary-glow",
  },
  {
    id: "funding",
    title: "Looking for funding 💰",
    icon: DollarSign,
    color: "bg-accent",
  },
];

interface GuideSection {
  title: string;
  emoji: string;
  overview: string;
  steps: string[];
  challenge: string;
  proTip: string;
  deepDive?: string;
  badge: string;
}

const guideContent: Record<string, GuideSection[]> = {
  idea: [
    {
      title: "Finding Your Big Idea",
      emoji: "💡",
      overview: "Great startups solve real problems. Your mission? Find a problem worth solving!",
      steps: [
        "Look at your daily frustrations - what bugs you?",
        "Talk to 10 people about their biggest challenges",
        "Browse startup communities (Reddit, Twitter) for common complaints",
        "Ask: Would people pay to fix this problem?",
      ],
      challenge: "Write down 3 problems you've personally experienced this week. Pick the most annoying one!",
      proTip: "The best startup ideas often sound obvious in hindsight. Don't overthink it!",
      deepDive: "Pro founders validate ideas BEFORE building. Interview potential customers, create landing pages, or offer pre-sales to test demand.",
      badge: "Idea Hunter 🎯",
    },
    {
      title: "Validating Your Idea",
      emoji: "🔍",
      overview: "Before you quit your job, make sure people actually want what you're building!",
      steps: [
        "Create a simple landing page describing your solution",
        "Share it with 50 people in your target audience",
        "Run a small ad campaign ($50-100) to gauge interest",
        "Aim for 10% email signups - that's validation!",
      ],
      challenge: "Pitch your idea in ONE sentence. If you can't explain it simply, refine it!",
      proTip: "If people say 'interesting idea' but won't give you their email, it's not validated yet.",
      deepDive: "Study the 'Mom Test' by Rob Fitzpatrick - learn how to ask questions that reveal truth, not politeness.",
      badge: "Validator 🔬",
    },
  ],
  product: [
    {
      title: "Building Your MVP",
      emoji: "🛠️",
      overview: "Your MVP should be embarrassingly simple. If you're not a little embarrassed, you waited too long!",
      steps: [
        "List the ONE core feature that solves the main problem",
        "Cut everything else (seriously, everything)",
        "Build it in 2-4 weeks, not months",
        "Use no-code tools if possible (Bubble, Webflow, etc.)",
      ],
      challenge: "What's the absolute minimum feature set? Write it down in 3 bullet points max!",
      proTip: "Airbnb's MVP was just photos of apartments on a basic website. Instagram started as a simple photo filter app.",
      deepDive: "Read 'The Lean Startup' - it'll change how you think about building products.",
      badge: "Builder 🔨",
    },
    {
      title: "Getting Early Feedback",
      emoji: "💬",
      overview: "Your first users will tell you what's broken. Listen to them!",
      steps: [
        "Give your product to 10 people you know",
        "Watch them use it (in person or via video call)",
        "Don't explain anything - see where they get stuck",
        "Ask: 'What would make this worth paying for?'",
      ],
      challenge: "Schedule 5 user testing sessions this week. Take notes on every confusion!",
      proTip: "Users will tell you features they want. Your job is to understand the problem behind the request.",
      badge: "Feedback Pro 📊",
    },
  ],
  team: [
    {
      title: "Finding Co-Founders",
      emoji: "👥",
      overview: "The right co-founder can 10x your chances of success. Choose wisely!",
      steps: [
        "Look for complementary skills (tech + business, design + marketing)",
        "Test working together on a small project first",
        "Discuss expectations: equity, time commitment, exit plans",
        "Make sure you actually enjoy spending time together!",
      ],
      challenge: "List 5 people you'd want in the trenches with you. Why each one?",
      proTip: "Co-founder breakups kill more startups than bad ideas. Vet thoroughly!",
      deepDive: "Use YC's co-founder matching platform or attend startup events in your city.",
      badge: "Team Builder 🤝",
    },
    {
      title: "Keeping Motivation High",
      emoji: "🔥",
      overview: "Startups are marathons with sprint energy. Here's how to avoid burnout!",
      steps: [
        "Set weekly wins, not just long-term goals",
        "Celebrate small victories with your team",
        "Schedule regular 'state of the startup' check-ins",
        "Take at least one full day off per week (really!)",
      ],
      challenge: "What's one small win you can achieve today? Do it and celebrate!",
      proTip: "Motivation follows action, not the other way around. Start tiny, build momentum.",
      badge: "Motivator 💪",
    },
  ],
  users: [
    {
      title: "Finding Your First 100 Users",
      emoji: "🎯",
      overview: "Your first users won't find you. You need to hunt them down (politely)!",
      steps: [
        "Go where your users hang out (forums, Discord, LinkedIn groups)",
        "Offer genuine help first, mention your product second",
        "Create valuable content (blog posts, videos, tweets)",
        "Ask for intros from early supporters",
      ],
      challenge: "Post in 3 relevant communities this week. Add value before asking!",
      proTip: "Do things that don't scale. Personally message users, hop on calls, go to meetups.",
      deepDive: "Study how Dropbox, Airbnb, and Stripe got their first users - all different strategies!",
      badge: "Growth Hacker 📈",
    },
    {
      title: "Building Community",
      emoji: "💙",
      overview: "Your best marketing is happy users who tell their friends!",
      steps: [
        "Create a Discord/Slack for early users",
        "Respond to EVERY message personally at first",
        "Feature user success stories on social media",
        "Build in public - share your journey transparently",
      ],
      challenge: "Thank 10 users personally this week. Ask how you can help them succeed!",
      proTip: "Community isn't about numbers - 100 passionate users beats 10,000 passive ones.",
      badge: "Community Leader 🌟",
    },
  ],
  funding: [
    {
      title: "Bootstrapping vs. Fundraising",
      emoji: "💰",
      overview: "Funding isn't one-size-fits-all. Know your options!",
      steps: [
        "Bootstrap: Use revenue to grow (slower but you keep control)",
        "Friends & Family: Easier money but complicated relationships",
        "Angel Investors: $25k-$500k for early traction",
        "VCs: $1M+ for proven growth potential",
      ],
      challenge: "List your burn rate and runway. How long before you NEED funding?",
      proTip: "Raise money when you don't need it. Investors want to invest in momentum, not desperation.",
      deepDive: "Read 'Venture Deals' by Brad Feld before talking to any investors.",
      badge: "Fundraiser 🎪",
    },
    {
      title: "Pitching Like a Pro",
      emoji: "🎤",
      overview: "A great pitch tells a story, not just facts and figures!",
      steps: [
        "Hook: Start with the problem (make it personal)",
        "Solution: Show your product solving it (demo if possible)",
        "Traction: Prove people want it (users, revenue, growth)",
        "Ask: What you need and what you'll do with it",
      ],
      challenge: "Record yourself pitching. Watch it. Cringe. Improve. Repeat!",
      proTip: "Investors invest in people first, ideas second. Show why YOU'RE the one to build this.",
      deepDive: "Study successful Y Combinator Demo Day pitches on YouTube.",
      badge: "Pitch Master 🚀",
    },
  ],
};

const Guidebook = () => {
  const navigate = useNavigate();
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [expandedSection, setExpandedSection] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [pitchFeedback, setPitchFeedback] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [pitchText, setPitchText] = useState("");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const handleCompleteSection = (sectionIndex: number) => {
    const key = `${selectedStage}-${sectionIndex}`;
    const newCompleted = new Set(completedSections);
    if (newCompleted.has(key)) {
      newCompleted.delete(key);
    } else {
      newCompleted.add(key);
    }
    setCompletedSections(newCompleted);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 2 minutes
      setTimeout(() => {
        if (mediaRecorderRef.current?.state === 'recording') {
          stopRecording();
        }
      }, 120000);
    } catch (error) {
      toast({
        title: "Microphone Error",
        description: "Could not access microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const analyzePitch = async () => {
    if (!pitchText.trim()) {
      toast({
        title: "No pitch provided",
        description: "Please write your pitch or record one first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-pitch', {
        body: { pitch: pitchText }
      });

      if (error) throw error;

      setPitchFeedback(data.feedback);
      toast({
        title: "Analysis Complete! 🎯",
        description: "Check your personalized pitch feedback below.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze pitch. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const transcribeAndAnalyze = async () => {
    if (!audioBlob) {
      toast({
        title: "No recording found",
        description: "Please record your pitch first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      // Convert blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      const base64Audio = await new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64 = reader.result as string;
          resolve(base64.split(',')[1]);
        };
      });

      // Transcribe audio
      const { data: transcribeData, error: transcribeError } = await supabase.functions.invoke('transcribe-audio', {
        body: { audio: base64Audio }
      });

      if (transcribeError) throw transcribeError;

      const transcribedText = transcribeData.text;
      setPitchText(transcribedText);

      // Analyze the transcribed pitch
      const { data: analyzeData, error: analyzeError } = await supabase.functions.invoke('analyze-pitch', {
        body: { pitch: transcribedText }
      });

      if (analyzeError) throw analyzeError;

      setPitchFeedback(analyzeData.feedback);
      toast({
        title: "Recording Analyzed! 🎯",
        description: "Your pitch has been transcribed and analyzed.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not transcribe or analyze recording.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!selectedStage) {
    return (
      <div className="min-h-screen bg-gradient-subtle p-6">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-6"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-light border border-accent/20 text-accent text-sm font-medium">
              <BookOpen className="w-4 h-4" />
              Your Personal Startup Guide
            </div>
            <h1 className="text-5xl font-bold text-foreground">
              Welcome to the Guidebook! 👋
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              I'm your friendly startup mentor. Let's navigate your journey together, one step at a time!
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4 text-center">
              Where are you right now?
            </h2>
            <div className="grid gap-4">
              {stages.map((stage) => (
                <Card
                  key={stage.id}
                  className="p-6 cursor-pointer hover:shadow-strong transition-all hover:scale-[1.02] group"
                  onClick={() => setSelectedStage(stage.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl ${stage.color} flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform`}>
                      <stage.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground">
                        {stage.title}
                      </h3>
                    </div>
                    <ChevronRight className="w-6 h-6 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentContent = guideContent[selectedStage] || [];
  const currentStage = stages.find((s) => s.id === selectedStage);
  const completionRate = currentContent.length > 0
    ? (Array.from(completedSections).filter(k => k.startsWith(selectedStage)).length / currentContent.length) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-subtle p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setSelectedStage(null)}
            className="mb-4"
          >
            ← Back to Stages
          </Button>
          
          <div className="flex items-center gap-4 mb-4">
            {currentStage && (
              <div className={`w-16 h-16 rounded-xl ${currentStage.color} flex items-center justify-center shadow-soft`}>
                <currentStage.icon className="w-8 h-8 text-primary-foreground" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {currentStage?.title}
              </h1>
              <p className="text-muted-foreground mt-1">
                {currentContent.length} chapters to master this stage
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-hero h-full transition-all duration-500 rounded-full"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {Math.round(completionRate)}% Complete
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-6">
          {currentContent.map((section, index) => {
            const isCompleted = completedSections.has(`${selectedStage}-${index}`);
            const isExpanded = expandedSection === index;

            return (
              <Card key={index} className="overflow-hidden" role="region">
                <div
                  className="p-6 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => setExpandedSection(isExpanded ? null : index)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">{section.emoji}</span>
                        <h3 className="text-2xl font-bold text-foreground">
                          {section.title}
                        </h3>
                        {isCompleted && (
                          <Badge className="bg-secondary text-secondary-foreground">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Done
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">{section.overview}</p>
                    </div>
                    <ChevronRight
                      className={`w-6 h-6 text-muted-foreground transition-transform ${
                        isExpanded ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                    {/* Action Steps */}
                    <div className="bg-primary/5 rounded-lg p-4">
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <span>📋</span> Action Steps
                      </h4>
                      <ul className="space-y-2">
                        {section.steps.map((step, i) => (
                          <li key={i} className="flex gap-2 text-sm text-foreground">
                            <span className="text-primary font-bold">{i + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Challenge */}
                    <div className="bg-accent-light rounded-lg p-4">
                      <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                        <span>🎯</span> Try This Challenge!
                      </h4>
                      <p className="text-foreground text-sm">{section.challenge}</p>
                    </div>

                    {/* Pro Tip */}
                    <div className="bg-secondary/10 rounded-lg p-4">
                      <h4 className="font-semibold text-secondary mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        Pro Tip
                      </h4>
                      <p className="text-foreground text-sm italic">{section.proTip}</p>
                    </div>

                    {/* Deep Dive */}
                    {section.deepDive && (
                      <div className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-foreground mb-2">
                          📚 Deep Dive
                        </h4>
                        <p className="text-muted-foreground text-sm">{section.deepDive}</p>
                      </div>
                    )}

                    {/* Team Finder - Only for "Finding Co-Founders" section */}
                    {selectedStage === 'team' && section.title === 'Finding Co-Founders' && (
                      <TeamFinderSection />
                    )}
                    {selectedStage === 'funding' && section.title === 'Pitching Like a Pro' && (
                      <div className="bg-gradient-hero/5 rounded-lg p-6 space-y-4">
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Mic className="w-5 h-5 text-primary" />
                          Practice Your Pitch (Up to 2 minutes)
                        </h4>
                        
                        <Textarea
                          placeholder="Type or paste your pitch here... (or record below)"
                          value={pitchText}
                          onChange={(e) => setPitchText(e.target.value)}
                          className="min-h-[120px]"
                        />

                        <div className="flex gap-2">
                          {!isRecording ? (
                            <Button
                              onClick={startRecording}
                              variant="outline"
                              className="flex-1"
                            >
                              <Mic className="w-4 h-4 mr-2" />
                              Record Pitch
                            </Button>
                          ) : (
                            <Button
                              onClick={stopRecording}
                              variant="destructive"
                              className="flex-1"
                            >
                              <Square className="w-4 h-4 mr-2" />
                              Stop Recording
                            </Button>
                          )}
                          
                          {audioBlob ? (
                            <Button
                              onClick={transcribeAndAnalyze}
                              disabled={isAnalyzing}
                              className="flex-1"
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                "Analyze Recording"
                              )}
                            </Button>
                          ) : (
                            <Button
                              onClick={analyzePitch}
                              disabled={isAnalyzing || !pitchText.trim()}
                              className="flex-1"
                            >
                              {isAnalyzing ? (
                                <>
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                  Analyzing...
                                </>
                              ) : (
                                "Get AI Feedback"
                              )}
                            </Button>
                          )}
                        </div>

                        {audioBlob && !isRecording && (
                          <div className="bg-secondary/10 rounded p-3">
                            <p className="text-sm text-foreground">
                              ✅ Recording saved! Click "Analyze Recording" to get AI feedback, or record again to replace.
                            </p>
                          </div>
                        )}

                        {pitchFeedback && (
                          <div className="bg-primary/5 rounded-lg p-4 border-l-4 border-primary">
                            <h5 className="font-semibold text-foreground mb-2">🎯 Your Pitch Feedback:</h5>
                            <div className="text-sm text-foreground whitespace-pre-wrap">{pitchFeedback}</div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Complete Button */}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompleteSection(index);
                      }}
                      variant={isCompleted ? "secondary" : "default"}
                      className="w-full"
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Completed - {section.badge}
                        </>
                      ) : (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Mark Complete & Earn Badge: {section.badge}
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Stage Navigation Buttons */}
        <div className="mt-8 flex gap-4">
          <Button
            variant="outline"
            size="lg"
            onClick={() => {
              const currentIndex = stages.findIndex(s => s.id === selectedStage);
              if (currentIndex > 0) {
                setSelectedStage(stages[currentIndex - 1].id);
                setExpandedSection(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={stages.findIndex(s => s.id === selectedStage) === 0}
            className="flex-1"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Previous Stage
          </Button>


          <Button
            variant="default"
            size="lg"
            onClick={() => {
              const currentIndex = stages.findIndex(s => s.id === selectedStage);
              if (currentIndex < stages.length - 1) {
                setSelectedStage(stages[currentIndex + 1].id);
                setExpandedSection(null);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            disabled={stages.findIndex(s => s.id === selectedStage) === stages.length - 1}
            className="flex-1"
          >
            Next Stage
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Completion Message */}
        {completionRate === 100 && (
          <Card className="mt-8 p-8 text-center bg-gradient-hero text-primary-foreground">
            <h2 className="text-3xl font-bold mb-4">
              🎉 Stage Complete!
            </h2>
            <p className="text-lg mb-6">
              You've mastered this stage! Ready for the next challenge?
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                const currentIndex = stages.findIndex(s => s.id === selectedStage);
                if (currentIndex < stages.length - 1) {
                  setSelectedStage(stages[currentIndex + 1].id);
                  setExpandedSection(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                  setSelectedStage(null);
                }
              }}
            >
              {stages.findIndex(s => s.id === selectedStage) === stages.length - 1 
                ? "Back to All Stages" 
                : "Go to Next Stage"}
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Guidebook;
