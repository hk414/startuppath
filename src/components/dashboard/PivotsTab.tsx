import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import JourneyTimeline from "./JourneyTimeline";

interface Pivot {
  id: string;
  title: string;
  description: string;
  decision_made: string;
  reasoning?: string;
  outcome?: string;
  lessons_learned?: string;
  pivot_date: string;
  created_at: string;
}

interface PivotsTabProps {
  userId: string;
}

const PivotsTab = ({ userId }: PivotsTabProps) => {
  const [pivots, setPivots] = useState<Pivot[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingPivot, setEditingPivot] = useState<Pivot | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [decisionMade, setDecisionMade] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [outcome, setOutcome] = useState("");
  const [lessonsLearned, setLessonsLearned] = useState("");
  const [pivotDate, setPivotDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const { toast } = useToast();

  useEffect(() => {
    fetchPivots();
  }, [userId]);

  const fetchPivots = async () => {
    const { data, error } = await supabase
      .from("pivots")
      .select("*")
      .eq("user_id", userId)
      .order("pivot_date", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load pivots",
        variant: "destructive",
      });
    } else {
      setPivots(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const pivotData = {
      title,
      description,
      decision_made: decisionMade,
      reasoning,
      outcome,
      lessons_learned: lessonsLearned,
      pivot_date: pivotDate,
    };

    if (editingPivot) {
      const { error } = await supabase
        .from("pivots")
        .update(pivotData)
        .eq("id", editingPivot.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update pivot", variant: "destructive" });
      } else {
        toast({ title: "Success!", description: "Pivot updated" });
      }
    } else {
      const { error } = await supabase
        .from("pivots")
        .insert({ ...pivotData, user_id: userId });

      if (error) {
        toast({ title: "Error", description: "Failed to create pivot", variant: "destructive" });
      } else {
        toast({ title: "Success!", description: "Pivot documented" });
      }
    }

    resetForm();
    fetchPivots();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("pivots").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete pivot", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Pivot removed" });
      fetchPivots();
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDecisionMade("");
    setReasoning("");
    setOutcome("");
    setLessonsLearned("");
    setPivotDate(format(new Date(), "yyyy-MM-dd"));
    setEditingPivot(null);
    setIsOpen(false);
  };

  const startEdit = (pivot: Pivot) => {
    setEditingPivot(pivot);
    setTitle(pivot.title);
    setDescription(pivot.description);
    setDecisionMade(pivot.decision_made);
    setReasoning(pivot.reasoning || "");
    setOutcome(pivot.outcome || "");
    setLessonsLearned(pivot.lessons_learned || "");
    setPivotDate(pivot.pivot_date);
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-foreground">Pivot Tracker</h2>
        <p className="text-muted-foreground mt-1">Track your journey and document major decisions</p>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="timeline">Journey Timeline</TabsTrigger>
          <TabsTrigger value="pivots">Pivots & Decisions</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <JourneyTimeline userId={userId} />
        </TabsContent>

        <TabsContent value="pivots" className="mt-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-foreground">Documented Pivots</h3>
              <p className="text-muted-foreground mt-1">Major changes and key decisions</p>
            </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Document Pivot
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPivot ? "Edit Pivot" : "Document New Pivot"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Pivot Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Changed from B2C to B2B model"
                  required
                />
              </div>
              <div>
                <Label htmlFor="pivot-date">Date</Label>
                <Input
                  id="pivot-date"
                  type="date"
                  value={pivotDate}
                  onChange={(e) => setPivotDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What changed in your startup?"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="decision">Decision Made</Label>
                <Textarea
                  id="decision"
                  value={decisionMade}
                  onChange={(e) => setDecisionMade(e.target.value)}
                  placeholder="What did you decide to do?"
                  rows={3}
                  required
                />
              </div>
              <div>
                <Label htmlFor="reasoning">Reasoning (optional)</Label>
                <Textarea
                  id="reasoning"
                  value={reasoning}
                  onChange={(e) => setReasoning(e.target.value)}
                  placeholder="Why did you make this decision?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="outcome">Outcome (optional)</Label>
                <Textarea
                  id="outcome"
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value)}
                  placeholder="What happened as a result?"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="lessons">Lessons Learned (optional)</Label>
                <Textarea
                  id="lessons"
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  placeholder="What did you learn from this pivot?"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingPivot ? "Update" : "Save"} Pivot</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {pivots.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No pivots documented yet</p>
          <Button onClick={() => setIsOpen(true)}>Document your first pivot</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pivots.map((pivot) => (
            <Card key={pivot.id} className="p-6 hover:shadow-strong transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{pivot.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(pivot.pivot_date), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(pivot)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(pivot.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground font-medium mb-1">What Changed:</p>
                  <p className="text-foreground">{pivot.description}</p>
                </div>
                
                <div>
                  <p className="text-muted-foreground font-medium mb-1">Decision:</p>
                  <p className="text-foreground">{pivot.decision_made}</p>
                </div>
                
                {pivot.reasoning && (
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Why:</p>
                    <p className="text-foreground">{pivot.reasoning}</p>
                  </div>
                )}
                
                {pivot.outcome && (
                  <div>
                    <p className="text-muted-foreground font-medium mb-1">Outcome:</p>
                    <p className="text-foreground">{pivot.outcome}</p>
                  </div>
                )}
                
                {pivot.lessons_learned && (
                  <div className="mt-4 p-4 bg-accent-light rounded-lg">
                    <p className="text-accent font-medium mb-1">💡 Lessons Learned:</p>
                    <p className="text-foreground">{pivot.lessons_learned}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PivotsTab;
