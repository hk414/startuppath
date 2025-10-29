import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface LeaderboardProps {
  currentUserId: string;
}

const Leaderboard = ({ currentUserId }: LeaderboardProps) => {
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('user_challenge_stats')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (!error && data) {
        setTopUsers(data);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelBadge = (level: string) => {
    const badges = {
      seed: { color: "text-green-600", bg: "bg-green-100 dark:bg-green-950", label: "🌱 Seed" },
      growth: { color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-950", label: "📈 Growth" },
      unicorn: { color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-950", label: "🦄 Unicorn" },
    };
    return badges[level as keyof typeof badges] || badges.seed;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Award className="w-6 h-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-hero/10 border-b border-border">
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Trophy className="w-7 h-7 text-primary" />
          Top 10 Entrepreneurs
        </CardTitle>
        <CardDescription>
          Monthly leaderboard - Rankings reset at the start of each month
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {topUsers.map((user, index) => {
            const rank = index + 1;
            const isCurrentUser = user.user_id === currentUserId;
            const levelBadge = getLevelBadge(user.level);

            return (
              <div
                key={user.id}
                className={`flex items-center gap-4 p-6 transition-colors ${
                  isCurrentUser ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-muted/30"
                }`}
              >
                <div className="flex-shrink-0 w-12 flex justify-center">
                  {getRankIcon(rank)}
                </div>

                <Avatar className="w-12 h-12 border-2 border-border">
                  <AvatarFallback className="bg-gradient-hero text-primary-foreground font-bold">
                    U{rank}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground truncate">
                      {isCurrentUser ? "You" : `Player ${rank}`}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-md font-semibold ${levelBadge.bg} ${levelBadge.color}`}>
                      {levelBadge.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {user.challenges_completed} challenges
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <Zap className="w-5 h-5 text-secondary" />
                  <span className="text-2xl font-black bg-gradient-accent bg-clip-text text-transparent">
                    {user.total_xp}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {topUsers.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p>No rankings yet. Be the first to play!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
