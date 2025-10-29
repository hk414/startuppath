import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import IdeaGeneratorGame from "@/components/challenges/IdeaGeneratorGame";
import ProblemSolverGame from "@/components/challenges/ProblemSolverGame";
import StartupSimulationGame from "@/components/challenges/StartupSimulationGame";
import Leaderboard from "@/components/challenges/Leaderboard";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Challenges = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [userStats, setUserStats] = useState<any>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setShowAuthDialog(true);
      return;
    }

    setUser(user);
    fetchUserStats(user.id);
  };

  const fetchUserStats = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_challenge_stats')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching stats:', error);
      return;
    }

    if (!data) {
      // Create initial stats
      const { data: newStats } = await supabase
        .from('user_challenge_stats')
        .insert({ user_id: userId })
        .select()
        .single();
      
      setUserStats(newStats);
    } else {
      setUserStats(data);
    }
  };

  const handleAuthRedirect = () => {
    navigate('/auth');
  };

  if (showAuthDialog && !user) {
    return (
      <AlertDialog open={showAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6 text-primary" />
              Join Startup Challenges
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <p className="text-base">
                Please log in or create an account to join Startup Challenges and track your progress!
              </p>
              <div className="flex gap-3">
                <Button onClick={handleAuthRedirect} className="flex-1">
                  Sign In / Sign Up
                </Button>
                <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                  Go Back
                </Button>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  if (!user || !userStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-lg sticky top-0 z-40">
        <div className="container max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl font-black bg-gradient-hero bg-clip-text text-transparent">
                  Startup Challenges Arena
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Play games, earn XP, and level up your entrepreneurial skills
                </p>
              </div>
            </div>

            {/* User Stats Badge */}
            <div className="flex items-center gap-6 bg-gradient-card border border-border rounded-2xl px-6 py-3 shadow-medium">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Level</div>
                <div className="text-lg font-bold text-primary uppercase">{userStats.level}</div>
              </div>
              <div className="w-px h-10 bg-border" />
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">Total XP</div>
                <div className="text-lg font-bold flex items-center gap-1">
                  <Zap className="w-4 h-4 text-secondary" />
                  {userStats.total_xp}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-12">
        <Tabs defaultValue="games" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 h-14">
            <TabsTrigger value="games" className="text-base">
              <Trophy className="w-5 h-5 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="leaderboard" className="text-base">
              <Zap className="w-5 h-5 mr-2" />
              Leaderboard
            </TabsTrigger>
          </TabsList>

          <TabsContent value="games" className="space-y-6">
            <div className="grid gap-6">
              <IdeaGeneratorGame 
                userId={user.id} 
                onXpEarned={() => fetchUserStats(user.id)}
              />
              <ProblemSolverGame 
                userId={user.id} 
                onXpEarned={() => fetchUserStats(user.id)}
              />
              <StartupSimulationGame 
                userId={user.id} 
                onXpEarned={() => fetchUserStats(user.id)}
              />
            </div>
          </TabsContent>

          <TabsContent value="leaderboard">
            <Leaderboard currentUserId={user.id} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Challenges;
