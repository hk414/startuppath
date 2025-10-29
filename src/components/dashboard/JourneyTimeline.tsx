import { useState, useEffect } from "react";
import { Check, Circle, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface JourneyEntry {
  id: string;
  stage: string;
  status: string;
  notes?: string;
  achieved_at: string;
  created_at: string;
}

interface JourneyTimelineProps {
  userId: string;
}

const STAGES = [
  { value: "idea", label: "💡 Idea", description: "Brainstorming and ideation" },
  { value: "validation", label: "🔍 Validation", description: "Market research and validation" },
  { value: "building", label: "🛠️ Building", description: "Product development" },
  { value: "testing", label: "🧪 Testing", description: "User testing and feedback" },
  { value: "launch", label: "🚀 Launch", description: "Going live" },
  { value: "growth", label: "📈 Growth", description: "User acquisition and retention" },
  { value: "scaling", label: "🌟 Scaling", description: "Expanding and optimizing" },
];

const JourneyTimeline = ({ userId }: JourneyTimelineProps) => {
  const [currentStage, setCurrentStage] = useState<string>("idea");
  const [journeyHistory, setJourneyHistory] = useState<JourneyEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentStage();
    fetchJourneyHistory();
  }, [userId]);

  const fetchCurrentStage = async () => {
    const { data, error } = await supabase
      .from("user_current_stage")
      .select("current_stage")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching current stage:", error);
    } else if (data) {
      setCurrentStage(data.current_stage);
    }
  };

  const fetchJourneyHistory = async () => {
    const { data, error } = await supabase
      .from("journey_timeline")
      .select("*")
      .eq("user_id", userId)
      .order("achieved_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load journey history",
        variant: "destructive",
      });
    } else {
      setJourneyHistory(data || []);
    }
  };

  const handleStageUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    // Add to journey history
    const { error: historyError } = await supabase
      .from("journey_timeline")
      .insert({
        user_id: userId,
        stage: selectedStage as any,
        status: `Moved to ${STAGES.find(s => s.value === selectedStage)?.label}`,
        notes,
      });

    if (historyError) {
      toast({
        title: "Error",
        description: "Failed to update journey",
        variant: "destructive",
      });
      return;
    }

    // Update current stage
    const { error: stageError } = await supabase
      .from("user_current_stage")
      .upsert({
        user_id: userId,
        current_stage: selectedStage as any,
      });

    if (stageError) {
      toast({
        title: "Error",
        description: "Failed to update current stage",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Journey Updated! 🎉",
      description: `You're now at the ${STAGES.find(s => s.value === selectedStage)?.label} stage`,
    });

    setIsOpen(false);
    setNotes("");
    fetchCurrentStage();
    fetchJourneyHistory();
  };

  const openStageDialog = (stage: string) => {
    setSelectedStage(stage);
    setIsOpen(true);
  };

  const currentStageIndex = STAGES.findIndex(s => s.value === currentStage);
  const achievedStages = new Set(journeyHistory.map(entry => entry.stage));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-foreground mb-2">Your Startup Journey</h3>
        <p className="text-muted-foreground">Track your progress through each stage</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-12 bottom-12 w-0.5 bg-border" />
        
        <div className="space-y-8">
          {STAGES.map((stage, index) => {
            const isCurrent = stage.value === currentStage;
            const isAchieved = achievedStages.has(stage.value) || index <= currentStageIndex;
            const isPast = index < currentStageIndex;
            
            return (
              <div key={stage.value} className="relative flex items-start gap-6">
                {/* Stage marker */}
                <div className="relative z-10">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-glow scale-110"
                        : isAchieved
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isPast || isCurrent ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </div>
                </div>

                {/* Stage content */}
                <Card
                  className={`flex-1 p-4 transition-all cursor-pointer ${
                    isCurrent
                      ? "border-primary shadow-strong"
                      : "hover:shadow-soft"
                  }`}
                  onClick={() => openStageDialog(stage.value)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {stage.label}
                        {isCurrent && (
                          <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                            Current
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={(e) => {
                      e.stopPropagation();
                      openStageDialog(stage.value);
                    }}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Journey History */}
      {journeyHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-foreground mb-4">Journey History</h3>
          <div className="space-y-3">
            {journeyHistory.map((entry) => (
              <Card key={entry.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-lg">
                        {STAGES.find(s => s.value === entry.stage)?.label}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(entry.achieved_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium">{entry.status}</p>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Update Stage Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Update to {STAGES.find(s => s.value === selectedStage)?.label}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStageUpdate} className="space-y-4">
            <div>
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What prompted this stage change? Any key learnings?"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Stage</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JourneyTimeline;