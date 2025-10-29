import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileSetup from "@/components/matching/ProfileSetup";
import MentorBrowser from "@/components/matching/MentorBrowser";
import MatchRequests from "@/components/matching/MatchRequests";
import MatchesList from "@/components/matching/MatchesList";
import ChatWindow from "@/components/matching/ChatWindow";
import SessionScheduler from "@/components/matching/SessionScheduler";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MessageSquare, Plus, UserPlus } from "lucide-react";

interface MentorMatchingProps {
  userId: string;
}

const MentorMatching = ({ userId }: MentorMatchingProps) => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [hasMenteeProfile, setHasMenteeProfile] = useState(false);
  const [hasMentorProfile, setHasMentorProfile] = useState(false);
  const [menteeProfileId, setMenteeProfileId] = useState<string | null>(null);
  const [mentorProfileId, setMentorProfileId] = useState<string | null>(null);
  const [showProfileSetup, setShowProfileSetup] = useState(false);
  const [activeChatMatchId, setActiveChatMatchId] = useState<string | null>(null);
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [activeScheduleMatchId, setActiveScheduleMatchId] = useState<string | null>(null);
  const [stats, setStats] = useState({ matches: 0, sessions: 0, messages: 0 });

  useEffect(() => {
    checkProfile();
    fetchStats();
  }, [userId]);

  const checkProfile = async () => {
    // Check if user has a mentee profile
    const { data: menteeData } = await supabase
      .from("mentee_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    // Check if user has a mentor profile
    const { data: mentorData } = await supabase
      .from("mentor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    setHasMenteeProfile(!!menteeData);
    setHasMentorProfile(!!mentorData);
    setMenteeProfileId(menteeData?.id || null);
    setMentorProfileId(mentorData?.id || null);
    setHasProfile(!!menteeData || !!mentorData);
  };

  const fetchStats = async () => {
    const { data: menteeProfile } = await supabase
      .from("mentee_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    const { data: mentorProfile } = await supabase
      .from("mentor_profiles")
      .select("id")
      .eq("user_id", userId)
      .maybeSingle();

    let matchesCount = 0;
    let sessionsCount = 0;

    if (menteeProfile) {
      const { count: menteeMatches } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .eq("mentee_id", menteeProfile.id)
        .eq("status", "active");
      
      matchesCount += menteeMatches || 0;
    }

    if (mentorProfile) {
      const { count: mentorMatches } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true })
        .eq("mentor_id", mentorProfile.id)
        .eq("status", "active");
      
      matchesCount += mentorMatches || 0;
    }

    setStats({ matches: matchesCount, sessions: sessionsCount, messages: 0 });
  };

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
    checkProfile();
    fetchStats();
  };

  if (hasProfile === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasProfile || showProfileSetup) {
    return <ProfileSetup userId={userId} onComplete={handleProfileComplete} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          Mentor Matching
        </h1>
        {(hasMenteeProfile && !hasMentorProfile) || (hasMentorProfile && !hasMenteeProfile) ? (
          <Button onClick={() => setShowProfileSetup(true)} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Create {hasMentorProfile ? "Founder" : "Mentor"} Profile
          </Button>
        ) : null}
      </div>

      {/* Profile Status Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        {hasMenteeProfile && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                🚀
              </div>
              <div>
                <h3 className="font-semibold">Founder Profile</h3>
                <Badge variant="secondary" className="mt-1">Active</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You're seeking mentorship from experienced entrepreneurs.
            </p>
          </Card>
        )}
        
        {hasMentorProfile && (
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                🎓
              </div>
              <div>
                <h3 className="font-semibold">Mentor Profile</h3>
                <Badge variant="secondary" className="mt-1">Active</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              You're helping founders with your expertise and experience.
            </p>
          </Card>
        )}
      </div>

      {/* Stats Dashboard */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Matches</h3>
          </div>
          <p className="text-3xl font-bold">{stats.matches}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hasMentorProfile ? "Mentees connected" : "Mentors connected"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Sessions</h3>
          </div>
          <p className="text-3xl font-bold">{stats.sessions}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upcoming mentorship sessions
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Messages</h3>
          </div>
          <p className="text-3xl font-bold">{stats.messages}</p>
          <p className="text-sm text-muted-foreground mt-1">
            Unread messages
          </p>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="browse">
            <UserPlus className="w-4 h-4 mr-2" />
            {hasMenteeProfile ? "Find Mentors" : "Find Mentees"}
          </TabsTrigger>
          <TabsTrigger value="requests">
            <MessageSquare className="w-4 h-4 mr-2" />
            Requests
          </TabsTrigger>
          <TabsTrigger value="matches">
            <Users className="w-4 h-4 mr-2" />
            My Matches
          </TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="mt-6">
          {hasMenteeProfile && menteeProfileId && (
            <MentorBrowser menteeProfileId={menteeProfileId} />
          )}
          {!hasMenteeProfile && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                Mentor browsing coming soon for mentor profiles
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests" className="mt-6">
          <div className="space-y-6">
            {menteeProfileId && (
              <div>
                <h3 className="text-lg font-heading font-bold mb-4 text-foreground">
                  Requests You've Sent
                </h3>
                <MatchRequests profileId={menteeProfileId} isMentor={false} />
              </div>
            )}
            {mentorProfileId && (
              <div className={menteeProfileId ? "mt-8" : ""}>
                <h3 className="text-lg font-heading font-bold mb-4 text-foreground">
                  Requests from Mentees
                </h3>
                <MatchRequests profileId={mentorProfileId} isMentor={true} />
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="matches" className="mt-6">
          <div className="space-y-6">
            {menteeProfileId && (
              <div>
                <h3 className="text-lg font-heading font-bold mb-4 text-foreground">
                  Your Mentors
                </h3>
                <MatchesList
                  profileId={menteeProfileId}
                  isMentor={false}
                  onOpenChat={(matchId, otherUserId) => {
                    setActiveChatMatchId(matchId);
                    setActiveChatUserId(otherUserId);
                  }}
                  onScheduleSession={(matchId) => setActiveScheduleMatchId(matchId)}
                />
              </div>
            )}
            {mentorProfileId && (
              <div className={menteeProfileId ? "mt-8" : ""}>
                <h3 className="text-lg font-heading font-bold mb-4 text-foreground">
                  Your Mentees
                </h3>
                <MatchesList
                  profileId={mentorProfileId}
                  isMentor={true}
                  onOpenChat={(matchId, otherUserId) => {
                    setActiveChatMatchId(matchId);
                    setActiveChatUserId(otherUserId);
                  }}
                  onScheduleSession={(matchId) => setActiveScheduleMatchId(matchId)}
                />
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Chat Window Overlay */}
      {activeChatMatchId && activeChatUserId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <ChatWindow
              matchId={activeChatMatchId}
              currentUserId={userId}
              otherUserId={activeChatUserId}
              onClose={() => {
                setActiveChatMatchId(null);
                setActiveChatUserId(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Session Scheduler Overlay */}
      {activeScheduleMatchId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl">
            <SessionScheduler
              matchId={activeScheduleMatchId}
              onClose={() => {
                setActiveScheduleMatchId(null);
                fetchStats();
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorMatching;
