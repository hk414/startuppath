import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Check, X, Clock, Video, Eye } from "lucide-react";

interface MatchRequest {
  id: string;
  mentee_id: string;
  mentor_id: string;
  message: string;
  video_url: string | null;
  status: string;
  created_at: string;
  mentee_profiles?: {
    startup_name: string;
    industry: string;
    startup_stage: string;
  };
  mentor_profiles?: {
    title: string;
    company: string;
  };
}

interface MatchRequestsProps {
  profileId: string;
  isMentor: boolean;
}

const MatchRequests = ({ profileId, isMentor }: MatchRequestsProps) => {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewingVideo, setViewingVideo] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, [profileId, isMentor]);

  const fetchRequests = async () => {
    try {
      const query = supabase
        .from("match_requests")
        .select(`
          *,
          mentee_profiles(startup_name, industry, startup_stage),
          mentor_profiles(title, company)
        `);

      if (isMentor) {
        query.eq("mentor_id", profileId);
      } else {
        query.eq("mentee_id", profileId);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error("Error fetching requests:", error);
      toast({
        title: "Error",
        description: "Failed to load match requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (requestId: string, status: "accepted" | "rejected") => {
    try {
      const { error } = await supabase
        .from("match_requests")
        .update({ status })
        .eq("id", requestId);

      if (error) throw error;

      toast({
        title: status === "accepted" ? "Request Accepted! 🎉" : "Request Declined",
        description: status === "accepted" 
          ? "A new match has been created!" 
          : "The match request has been declined.",
      });

      fetchRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          {isMentor ? "No match requests yet" : "No sent requests yet"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <Card key={request.id} className="p-6 hover:shadow-glow transition-all">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isMentor ? (
                  <>
                    <h3 className="font-heading font-bold text-lg">
                      {request.mentee_profiles?.startup_name || "Founder"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.mentee_profiles?.industry} • {request.mentee_profiles?.startup_stage}
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="font-heading font-bold text-lg">
                      {request.mentor_profiles?.title || "Mentor"}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {request.mentor_profiles?.company}
                    </p>
                  </>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {new Date(request.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Badge
                variant={
                  request.status === "accepted"
                    ? "default"
                    : request.status === "rejected"
                    ? "destructive"
                    : "secondary"
                }
                className="ml-4"
              >
                {request.status}
              </Badge>
            </div>

            {request.message && (
              <div className="bg-muted/30 p-4 rounded-xl">
                <p className="text-sm text-foreground leading-relaxed">{request.message}</p>
              </div>
            )}

            {request.video_url && (
              <div className="bg-gradient-hero/10 p-4 rounded-xl border border-primary/20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewingVideo(request.video_url)}
                  className="gap-2"
                >
                  <Video className="w-4 h-4" />
                  View Video Introduction
                </Button>
              </div>
            )}

            {isMentor && request.status === "pending" && (
              <div className="flex gap-2 pt-2">
                <Button
                  onClick={() => handleRequest(request.id, "accepted")}
                  size="sm"
                  className="gap-2"
                >
                  <Check className="w-4 h-4" />
                  Accept
                </Button>
                <Button
                  onClick={() => handleRequest(request.id, "rejected")}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  Decline
                </Button>
              </div>
            )}
          </div>
        </Card>
      ))}

      {/* Video Viewer Dialog */}
      <Dialog open={!!viewingVideo} onOpenChange={(open) => !open && setViewingVideo(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Video Introduction</DialogTitle>
          </DialogHeader>
          {viewingVideo && (
            <div className="aspect-video rounded-xl overflow-hidden bg-muted">
              <video
                src={viewingVideo}
                controls
                autoPlay
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MatchRequests;
