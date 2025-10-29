import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProblemSolverGameProps {
  userId: string;
  onXpEarned: () => void;
}

const ProblemSolverGame = ({ userId, onXpEarned }: ProblemSolverGameProps) => {
  const { toast } = useToast();
  const [scenario, setScenario] = useState<any>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  useEffect(() => {
    loadScenario();
  }, []);

  const loadScenario = async () => {
    // Fetch all scenarios
    const { data: scenarios, error } = await supabase
      .from('problem_scenarios')
      .select('*');

    if (!error && scenarios && scenarios.length > 0) {
      // Filter out the current scenario if it exists
      const availableScenarios = scenario 
        ? scenarios.filter(s => s.id !== scenario.id)
        : scenarios;
      
      // If all scenarios have been used, reset to full list
      const scenarioPool = availableScenarios.length > 0 ? availableScenarios : scenarios;
      
      // Randomly select a scenario
      const randomIndex = Math.floor(Math.random() * scenarioPool.length);
      const selectedScenario = scenarioPool[randomIndex];
      
      setScenario(selectedScenario);
      setHasAnswered(false);
      setSelectedOption("");
    }
  };

  const submitAnswer = async () => {
    if (!selectedOption) return;

    const optionIndex = parseInt(selectedOption);
    const correct = optionIndex === scenario.correct_option_index;
    setIsCorrect(correct);
    setHasAnswered(true);

    const xpEarned = correct ? 50 : 25;

    try {
      await supabase.from('challenge_attempts').insert({
        user_id: userId,
        challenge_type: 'problem_solver',
        xp_earned: xpEarned,
        response_data: { scenario_id: scenario.id, selected: optionIndex, correct }
      });

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
        title: correct ? "🎉 Correct!" : "📚 Keep Learning!",
        description: `You earned ${xpEarned} XP!`,
      });
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  if (!scenario) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  const options = scenario.options as any[];

  return (
    <Card className="hover:shadow-strong transition-all duration-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          Problem Solver
        </CardTitle>
        <CardDescription>
          Choose the best strategy for this startup scenario
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-muted/50 rounded-xl p-6 border border-border">
          <div className="text-sm font-semibold text-primary mb-3">Scenario:</div>
          <p className="text-lg text-foreground leading-relaxed">{scenario.problem_text}</p>
        </div>

        <RadioGroup value={selectedOption} onValueChange={setSelectedOption} disabled={hasAnswered}>
          <div className="space-y-3">
            {options.map((option, index) => (
              <div key={index}>
                <div className={`flex items-start space-x-3 p-4 rounded-xl border-2 transition-all ${
                  hasAnswered
                    ? index === scenario.correct_option_index
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                      : selectedOption === index.toString()
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : "border-border bg-background"
                    : selectedOption === index.toString()
                    ? "border-primary bg-primary/5"
                    : "border-border bg-background hover:border-primary/50"
                }`}>
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                    {option.text}
                  </Label>
                  {hasAnswered && index === scenario.correct_option_index && (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  )}
                  {hasAnswered && selectedOption === index.toString() && index !== scenario.correct_option_index && (
                    <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  )}
                </div>
                
                {hasAnswered && (
                  <div className="ml-10 mt-2 p-3 bg-accent-light/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">{option.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </RadioGroup>

        {!hasAnswered ? (
          <Button 
            onClick={submitAnswer} 
            disabled={!selectedOption}
            className="w-full"
            size="lg"
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={loadScenario} 
            variant="outline"
            className="w-full"
            size="lg"
          >
            Try Another Scenario
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProblemSolverGame;
