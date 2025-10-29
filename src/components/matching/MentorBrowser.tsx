import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Search, Send } from "lucide-react";

interface MentorProfile {
  id: string;
  user_id: string;
  title: string;
  company: string;
  bio: string;
  expertise_areas: string[];
  industries: string[];
  years_experience: number;
  availability: string;
  timezone: string;
  linkedin_url: string;
}

interface MentorBrowserProps {
  menteeProfileId: string;
}

const MentorBrowser = ({ menteeProfileId }: MentorBrowserProps) => {
  const [mentors, setMentors] = useState<MentorProfile[]>([]);
  const [filteredMentors, setFilteredMentors] = useState<MentorProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [requestMessage, setRequestMessage] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null);

  useEffect(() => {
    fetchMentors();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMentors(mentors);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = mentors.filter(
        (mentor) =>
          mentor.title?.toLowerCase().includes(query) ||
          mentor.company?.toLowerCase().includes(query) ||
          mentor.bio?.toLowerCase().includes(query) ||
          mentor.expertise_areas?.some((exp) => exp.toLowerCase().includes(query)) ||
          mentor.industries?.some((ind) => ind.toLowerCase().includes(query))
      );
      setFilteredMentors(filtered);
    }
  }, [searchQuery, mentors]);

  const fetchMentors = async () => {
    try {
      const { data, error } = await supabase
        .from("mentor_profiles")
        .select("*")
        .eq("is_active", true);

      if (error) throw error;
      setMentors(data || []);
      setFilteredMentors(data || []);
    } catch (error) {
      console.error("Error fetching mentors:", error);
      toast({
        title: "Error",
        description: "Failed to load mentors",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendMatchRequest = async (mentorId: string) => {
    try {
      const { error } = await supabase.from("match_requests").insert({
        mentee_id: menteeProfileId,
        mentor_id: mentorId,
        message: requestMessage,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Request Sent! 🎉",
        description: "Your match request has been sent to the mentor.",
      });

      setRequestMessage("");
      setSelectedMentor(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send match request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading mentors...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search by expertise, industry, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredMentors.map((mentor) => (
          <Card key={mentor.id} className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{mentor.title}</h3>
                {mentor.company && (
                  <p className="text-sm text-muted-foreground">{mentor.company}</p>
                )}
              </div>

              {mentor.bio && (
                <p className="text-sm text-muted-foreground line-clamp-3">{mentor.bio}</p>
              )}

              {mentor.expertise_areas && mentor.expertise_areas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {mentor.expertise_areas.map((exp, idx) => (
                    <Badge key={idx} variant="secondary">
                      {exp}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4">
                <div className="text-sm text-muted-foreground">
                  {mentor.years_experience && `${mentor.years_experience} years exp`}
                  {mentor.timezone && ` • ${mentor.timezone}`}
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button onClick={() => setSelectedMentor(mentor.id)}>
                      <Send className="w-4 h-4 mr-2" />
                      Request Match
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Send Match Request</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Send a message to {mentor.title} explaining why you'd like them as a mentor.
                      </p>
                      <Textarea
                        placeholder="Tell them about your goals and why you think they'd be a great mentor..."
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        rows={5}
                      />
                      <Button
                        onClick={() => sendMatchRequest(mentor.id)}
                        disabled={!requestMessage.trim()}
                        className="w-full"
                      >
                        Send Request
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredMentors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            {searchQuery ? "No mentors found matching your search" : "No mentors available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MentorBrowser;
