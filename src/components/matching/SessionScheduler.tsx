import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, X, Video } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useGoogleAuth } from "@/hooks/useGoogleAuth";

interface SessionSchedulerProps {
  matchId: string;
  onClose: () => void;
}

const SessionScheduler = ({ matchId, onClose }: SessionSchedulerProps) => {
  const [scheduledAt, setScheduledAt] = useState("");
  const [duration, setDuration] = useState("60");
  const [notes, setNotes] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [mentorEmail, setMentorEmail] = useState("");
  const [menteeEmail, setMenteeEmail] = useState("");
  const [addToCalendar, setAddToCalendar] = useState(true);

  const { isGoogleConnected, googleAccessToken, connectGoogle } = useGoogleAuth();

  useEffect(() => {
    fetchMatchDetails();
  }, [matchId]);

  const fetchMatchDetails = async () => {
    const { data: matchData } = await supabase
      .from("matches")
      .select(`
        mentee:mentee_profiles(user_id),
        mentor:mentor_profiles(user_id)
      `)
      .eq("id", matchId)
      .single();

    if (matchData) {
      // Fetch user emails
      const { data: { user } } = await supabase.auth.getUser();
      const currentUserEmail = user?.email || "";

      const menteeUserId = (matchData as any).mentee?.user_id;
      const mentorUserId = (matchData as any).mentor?.user_id;

      if (menteeUserId) {
        const { data: menteeUser } = await supabase.auth.admin.getUserById(menteeUserId);
        setMenteeEmail(menteeUser?.user?.email || "");
      }

      if (mentorUserId) {
        const { data: mentorUser } = await supabase.auth.admin.getUserById(mentorUserId);
        setMentorEmail(mentorUser?.user?.email || "");
      }
    }
  };

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduledAt) {
      toast({
        title: "Missing Information",
        description: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create session in database
      const { data: sessionData, error: sessionError } = await supabase
        .from("mentorship_sessions")
        .insert({
          match_id: matchId,
          scheduled_at: scheduledAt,
          duration_minutes: parseInt(duration),
          notes,
          meeting_link: meetingLink,
          status: "scheduled",
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Create Google Calendar event if user opted in
      if (addToCalendar) {
        if (!isGoogleConnected || !googleAccessToken) {
          toast({
            title: "Google Calendar not connected",
            description: "Connect Google to add a calendar invite with a Meet link.",
          });
        } else {
          const startTime = new Date(scheduledAt).toISOString();
          const endTime = new Date(
            new Date(scheduledAt).getTime() + parseInt(duration) * 60000
          ).toISOString();

          const { data: calendarData, error: calendarError } = await supabase.functions.invoke(
            'create-calendar-event',
            {
              body: {
                summary: 'Mentorship Session',
                description: notes || 'Scheduled mentorship session',
                startTime,
                endTime,
                attendees: [mentorEmail, menteeEmail].filter(Boolean),
                accessToken: googleAccessToken,
              },
            }
          );

          if (!calendarError && calendarData?.meetLink) {
            // Update session with Google Meet link
            await supabase
              .from("mentorship_sessions")
              .update({ meeting_link: calendarData.meetLink })
              .eq("id", sessionData.id);

            toast({
              title: "Session Scheduled! 📅",
              description: "Added to calendar with Google Meet link.",
            });
          } else {
            console.error('Calendar error:', calendarError);
            toast({
              title: "Session Scheduled! 📅",
              description: "Your mentorship session has been scheduled.",
            });
          }
        }
      } else {
        toast({
          title: "Session Scheduled! 📅",
          description: "Your mentorship session has been scheduled.",
        });
      }

      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to schedule session",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold">Schedule Session</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={handleSchedule} className="space-y-4">
        <div>
          <Label htmlFor="datetime">Date & Time</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="datetime"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              className="pl-10"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="duration">Duration (minutes)</Label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="pl-10"
              min="15"
              step="15"
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="meeting-link">Meeting Link (optional)</Label>
          <Input
            id="meeting-link"
            type="url"
            placeholder="https://zoom.us/j/..."
            value={meetingLink}
            onChange={(e) => setMeetingLink(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="notes">Agenda / Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="What do you want to discuss in this session?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          rows={4}
          />
        </div>

        <div className="flex items-center space-x-2 p-4 bg-secondary/10 rounded-lg">
          <Checkbox
            id="add-to-calendar"
            checked={addToCalendar}
            onCheckedChange={(checked) => setAddToCalendar(checked as boolean)}
          />
          <div className="flex-1">
            <Label
              htmlFor="add-to-calendar"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Add to Google Calendar
            </Label>
            <p className="text-sm text-muted-foreground mt-1">
              Automatically create calendar event and generate Google Meet link
            </p>
          </div>
        </div>

        {addToCalendar && !isGoogleConnected && (
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-foreground mb-2">
                  Connect Google Calendar
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Link your Google account to add events and generate Meet links automatically.
                </p>
                <Button type="button" variant="outline" size="sm" onClick={connectGoogle}>
                  Connect Google
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-4">
          <Button type="submit" disabled={loading} className="flex-1">
            Schedule Session
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default SessionScheduler;
