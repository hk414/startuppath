import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Calendar, Clock, X } from "lucide-react";

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
      const { error } = await supabase.from("mentorship_sessions").insert({
        match_id: matchId,
        scheduled_at: scheduledAt,
        duration_minutes: parseInt(duration),
        notes,
        meeting_link: meetingLink,
        status: "scheduled",
      });

      if (error) throw error;

      toast({
        title: "Session Scheduled! 📅",
        description: "Your mentorship session has been scheduled.",
      });

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
