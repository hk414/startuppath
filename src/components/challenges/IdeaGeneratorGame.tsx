import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb, RefreshCw, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const themes = [
  "AI + Health", "Sustainability + Travel", "Education + AR",
  "FinTech + Blockchain", "E-commerce + Social", "IoT + Agriculture",
  "Mental Health + VR", "Food Tech + Delivery", "HR + Automation",
  "Climate + Energy", "Gaming + Education", "Fashion + AI"
];

interface IdeaGeneratorGameProps {
  userId: string;
  onXpEarned: () => void;
}

const IdeaGeneratorGame = ({ userId, onXpEarned }: IdeaGeneratorGameProps) => {
  const { toast } = useToast();
  const [currentTheme, setCurrentTheme] = useState<string>("");
  const [idea, setIdea] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isActive, setIsActive] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const generateTheme = () => {
    const randomTheme = themes[Math.floor(Math.random() * themes.length)];
    setCurrentTheme(randomTheme);
    setIdea("");
    setFeedback(null);
    setTimeLeft(120);
    setIsActive(true);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const submitIdea = async () => {
    if (!idea.trim()) {
      toast({
        title: "Write your idea first!",
        description: "Please describe your startup idea before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simple AI feedback simulation (you can enhance this with actual AI)
      const wordCount = idea.split(' ').length;
      const hasKeywords = idea.toLowerCase().includes('solve') || idea.toLowerCase().includes('help') || idea.toLowerCase().includes('provide');
      
      let score = 50;
      let feedbackText = "";

      if (wordCount >= 30) score += 20;
      if (hasKeywords) score += 30;

      if (score >= 80) {
        feedbackText = "🌟 Excellent! Creative and well thought out. Your idea addresses a clear problem with a feasible solution.";
      } else if (score >= 60) {
        feedbackText = "👍 Good effort! The concept is interesting, but consider adding more detail about the problem you're solving.";
      } else {
        feedbackText = "💡 Keep brainstorming! Try to focus more on the specific problem and how your solution addresses it uniquely.";
      }

      setFeedback(feedbackText);

      // Award XP
      const xpEarned = 50;
      
      // Record attempt
      await supabase.from('challenge_attempts').insert({
        user_id: userId,
        challenge_type: 'idea_generator',
        xp_earned: xpEarned,
        response_data: { theme: currentTheme, idea, score }
      });

      // Update user stats
      const { data: stats } = await supabase
        .from('user_challenge_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (stats) {
        await supabase
          .from('user_challenge_stats')
          .update({
            total_xp: stats.total_xp + xpEarned,
            challenges_completed: stats.challenges_completed + 1
          })
          .eq('user_id', userId);
      }

      onXpEarned();

      toast({
        title: "🎉 Challenge Complete!",
        description: `You earned ${xpEarned} XP!`,
      });

    } catch (error) {
      console.error('Error submitting idea:', error);
      toast({
        title: "Error",
        description: "Failed to submit your idea. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setIsActive(false);
    }
  };

  return (
    <Card className="hover:shadow-strong transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-6 h-6 text-secondary" />
          Idea Generator Challenge
        </CardTitle>
        <CardDescription>
          Spin a random startup theme and pitch your idea in 2 minutes
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!currentTheme ? (
          <Button onClick={generateTheme} size="lg" className="w-full" variant="accent">
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Random Theme
          </Button>
        ) : (
          <>
            <div className="bg-gradient-hero/10 border border-primary/20 rounded-xl p-6 text-center">
              <div className="text-sm text-muted-foreground mb-2">Your Theme:</div>
              <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                {currentTheme}
              </div>
              {isActive && (
                <div className="mt-4 text-xl font-semibold text-secondary">
                  Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>

            <Textarea
              placeholder="Describe your startup idea here... What problem does it solve? Who is it for? What makes it unique?"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              disabled={!isActive || isSubmitting}
              className="min-h-[200px] text-base"
            />

            {feedback && (
              <div className="bg-accent-light border border-accent/20 rounded-xl p-4">
                <div className="text-sm font-semibold text-accent mb-2">AI Feedback:</div>
                <p className="text-foreground">{feedback}</p>
              </div>
            )}

            <div className="flex gap-3">
              {isActive && (
                <Button 
                  onClick={submitIdea} 
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Submit Idea
                </Button>
              )}
              <Button 
                onClick={generateTheme} 
                variant="outline"
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                New Theme
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default IdeaGeneratorGame;
