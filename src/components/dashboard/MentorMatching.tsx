import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileSetup from "@/components/matching/ProfileSetup";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare, Plus } from "lucide-react";

interface MentorMatchingProps {
  userId: string;
}

const MentorMatching = ({ userId }: MentorMatchingProps) => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [hasMenteeProfile, setHasMenteeProfile] = useState(false);
  const [hasMentorProfile, setHasMentorProfile] = useState(false);
  const [showProfileSetup, setShowProfileSetup] = useState(false);

  useEffect(() => {
    checkProfile();
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
    setHasProfile(!!menteeData || !!mentorData);
  };

  const handleProfileComplete = () => {
    setShowProfileSetup(false);
    checkProfile();
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

      {/* Dashboard Content */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Matches</h3>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-1">
            {hasMentorProfile ? "Mentees connected" : "Mentors connected"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Sessions</h3>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upcoming mentorship sessions
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-semibold">Messages</h3>
          </div>
          <p className="text-3xl font-bold">0</p>
          <p className="text-sm text-muted-foreground mt-1">
            Unread messages
          </p>
        </Card>
      </div>

      <Card className="p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-muted-foreground">
            Mentor matching, session scheduling, and messaging features are being developed.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MentorMatching;
