import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { MessageSquare, Calendar, ExternalLink } from "lucide-react";

interface Match {
  id: string;
  mentee_id: string;
  mentor_id: string;
  status: string;
  started_at: string;
  mentee_profiles?: {
    startup_name: string;
    industry: string;
    user_id: string;
  };
  mentor_profiles?: {
    title: string;
    company: string;
    user_id: string;
  };
}

interface MatchesListProps {
  profileId: string;
  isMentor: boolean;
  onOpenChat: (matchId: string, otherUserId: string) => void;
  onScheduleSession: (matchId: string) => void;
}

const MatchesList = ({ profileId, isMentor, onOpenChat, onScheduleSession }: MatchesListProps) => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, [profileId, isMentor]);

  const fetchMatches = async () => {
    try {
      const query = supabase
        .from("matches")
        .select(`
          *,
          mentee_profiles(startup_name, industry, user_id),
          mentor_profiles(title, company, user_id)
        `)
        .eq("status", "active");

      if (isMentor) {
        query.eq("mentor_id", profileId);
      } else {
        query.eq("mentee_id", profileId);
      }

      const { data, error } = await query.order("started_at", { ascending: false });

      if (error) throw error;
      setMatches(data || []);
    } catch (error) {
      console.error("Error fetching matches:", error);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          {isMentor ? "No mentees matched yet" : "No mentors matched yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {matches.map((match) => {
        const otherProfile = isMentor ? match.mentee_profiles : match.mentor_profiles;
        const otherUserId = otherProfile?.user_id || "";

        return (
          <Card key={match.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {isMentor ? (
                    <>
                      <h3 className="font-semibold">
                        {match.mentee_profiles?.startup_name || "Founder"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {match.mentee_profiles?.industry}
                      </p>
                    </>
                  ) : (
                    <>
                      <h3 className="font-semibold">
                        {match.mentor_profiles?.title || "Mentor"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {match.mentor_profiles?.company}
                      </p>
                    </>
                  )}
                </div>
                <Badge variant="default">Active</Badge>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => onOpenChat(match.id, otherUserId)}
                  size="sm"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
                <Button
                  onClick={() => onScheduleSession(match.id)}
                  variant="outline"
                  size="sm"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default MatchesList;
