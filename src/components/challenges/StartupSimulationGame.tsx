import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Rocket, TrendingUp, Users, DollarSign, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface StartupSimulationGameProps {
  userId: string;
  onXpEarned: () => void;
}

const StartupSimulationGame = ({ userId, onXpEarned }: StartupSimulationGameProps) => {
  const { toast } = useToast();
  const [isPlaying, setIsPlaying] = useState(false);
  const [round, setRound] = useState(1);
  const [stats, setStats] = useState({
    profit: 50,
    growth: 50,
    reputation: 50,
  });
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const scenarios = [
    {
      round: 1,
      question: "How should you price your product?",
      options: [
        { text: "Low price to attract users", impact: { profit: -10, growth: +20, reputation: +5 } },
        { text: "Medium competitive pricing", impact: { profit: +10, growth: +10, reputation: +10 } },
        { text: "Premium pricing strategy", impact: { profit: +20, growth: -5, reputation: +15 } },
      ]
    },
    {
      round: 2,
      question: "Your first hire should be...",
      options: [
        { text: "A senior developer", impact: { profit: -15, growth: +15, reputation: +10 } },
        { text: "A marketing specialist", impact: { profit: -10, growth: +20, reputation: +5 } },
        { text: "A business development lead", impact: { profit: +5, growth: +10, reputation: +15 } },
      ]
    },
    {
      round: 3,
      question: "Marketing strategy focus?",
      options: [
        { text: "Social media ads", impact: { profit: -10, growth: +25, reputation: +5 } },
        { text: "Content marketing & SEO", impact: { profit: +5, growth: +15, reputation: +20 } },
        { text: "Partnerships & referrals", impact: { profit: +10, growth: +10, reputation: +15 } },
      ]
    },
  ];

  const currentScenario = scenarios[round - 1];

  const startGame = () => {
    setIsPlaying(true);
    setRound(1);
    setStats({ profit: 50, growth: 50, reputation: 50 });
    setGameOver(false);
    setFinalScore(0);
  };

  const makeDecision = (impact: any) => {
    const newStats = {
      profit: Math.max(0, Math.min(100, stats.profit + impact.profit)),
      growth: Math.max(0, Math.min(100, stats.growth + impact.growth)),
      reputation: Math.max(0, Math.min(100, stats.reputation + impact.reputation)),
    };
    
    setStats(newStats);

    if (round < 3) {
      setRound(round + 1);
    } else {
      finishGame(newStats);
    }
  };

  const finishGame = async (finalStats: any) => {
    const score = Math.round((finalStats.profit + finalStats.growth + finalStats.reputation) / 3);
    setFinalScore(score);
    setGameOver(true);

    const xpEarned = Math.round(score / 2) + 25;

    try {
      await supabase.from('challenge_attempts').insert({
        user_id: userId,
        challenge_type: 'startup_simulation',
        xp_earned: xpEarned,
        response_data: { finalStats, score }
      });

      const { data: userStats } = await supabase
        .from('user_challenge_stats')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (userStats) {
        await supabase
          .from('user_challenge_stats')
          .update({
            total_xp: userStats.total_xp + xpEarned,
            challenges_completed: userStats.challenges_completed + 1
          })
          .eq('user_id', userId);
      }

      onXpEarned();

      toast({
        title: "🎉 Simulation Complete!",
        description: `Final Score: ${score}/100 | You earned ${xpEarned} XP!`,
      });
    } catch (error) {
      console.error('Error saving simulation:', error);
    }
  };

  return (
    <Card className="hover:shadow-strong transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Rocket className="w-6 h-6 text-accent" />
          Build Your Startup Simulation
        </CardTitle>
        <CardDescription>
          Make strategic decisions and grow your virtual startup
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isPlaying && !gameOver && (
          <Button onClick={startGame} size="lg" className="w-full" variant="hero">
            <Rocket className="w-5 h-5 mr-2" />
            Start Simulation
          </Button>
        )}

        {isPlaying && !gameOver && (
          <>
            <div className="bg-gradient-card border border-border rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-muted-foreground">Round {round}/3</span>
                <span className="text-sm font-semibold text-primary">Decision Time</span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Profit</span>
                      <span className="text-sm font-semibold">{stats.profit}%</span>
                    </div>
                    <Progress value={stats.profit} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Growth</span>
                      <span className="text-sm font-semibold">{stats.growth}%</span>
                    </div>
                    <Progress value={stats.growth} className="h-2" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Reputation</span>
                      <span className="text-sm font-semibold">{stats.reputation}%</span>
                    </div>
                    <Progress value={stats.reputation} className="h-2" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-muted/50 rounded-xl p-4 border border-border">
                <p className="text-lg font-semibold text-foreground">{currentScenario.question}</p>
              </div>

              <div className="space-y-2">
                {currentScenario.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => makeDecision(option.impact)}
                    variant="outline"
                    className="w-full h-auto py-4 px-6 text-left justify-start hover:bg-primary/5"
                  >
                    <span className="text-base">{option.text}</span>
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {gameOver && (
          <div className="text-center space-y-6 py-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-hero rounded-full shadow-glow mx-auto">
              <Rocket className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <div>
              <h3 className="text-3xl font-black mb-2">Simulation Complete!</h3>
              <p className="text-muted-foreground">Here's how your startup performed</p>
            </div>

            <div className="bg-gradient-card border border-border rounded-xl p-6 space-y-3 max-w-md mx-auto">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Final Profit</span>
                <span className="text-xl font-bold text-green-600">{stats.profit}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Final Growth</span>
                <span className="text-xl font-bold text-blue-600">{stats.growth}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Final Reputation</span>
                <span className="text-xl font-bold text-purple-600">{stats.reputation}%</span>
              </div>
              <div className="border-t border-border pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">Overall Score</span>
                  <span className="text-3xl font-black bg-gradient-hero bg-clip-text text-transparent">
                    {finalScore}/100
                  </span>
                </div>
              </div>
            </div>

            <Button onClick={startGame} size="lg" variant="hero" className="w-full max-w-md">
              Play Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StartupSimulationGame;
