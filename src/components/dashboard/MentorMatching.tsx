import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import ProfileSetup from "@/components/matching/ProfileSetup";

interface MentorMatchingProps {
  userId: string;
}

const MentorMatching = ({ userId }: MentorMatchingProps) => {
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);
  const [isMentor, setIsMentor] = useState(false);

  useEffect(() => {
    checkProfile();
  }, [userId]);

  const checkProfile = async () => {
    // Check if user has a mentee profile
    const { data: menteeData } = await supabase
      .from("mentee_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    // Check if user has a mentor profile
    const { data: mentorData } = await supabase
      .from("mentor_profiles")
      .select("id")
      .eq("user_id", userId)
      .single();

    setHasProfile(!!menteeData || !!mentorData);
    setIsMentor(!!mentorData);
  };

  const handleProfileComplete = () => {
    checkProfile();
  };

  if (hasProfile === null) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!hasProfile) {
    return <ProfileSetup userId={userId} onComplete={handleProfileComplete} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">
          {isMentor ? "Mentor Dashboard" : "Find Your Mentor"}
        </h1>
      </div>
      <div className="text-center py-12">
        <p className="text-muted-foreground">Mentor matching interface coming soon...</p>
      </div>
    </div>
  );
};

export default MentorMatching;
