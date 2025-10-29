import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Sparkles, TrendingUp, AlertCircle, Loader2, FileText, Download } from "lucide-react";
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
  const [aiInsights, setAiInsights] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [investorReport, setInvestorReport] = useState<string>("");
  const [showInvestorReport, setShowInvestorReport] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [startupName, setStartupName] = useState("");
  const [currentStage, setCurrentStage] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchPivots();
    fetchUserProfile();
  }, [userId]);

  const fetchUserProfile = async () => {
    const { data: menteeData } = await supabase
      .from("mentee_profiles")
      .select("startup_name, startup_stage")
      .eq("user_id", userId)
      .maybeSingle();

    if (menteeData) {
      setStartupName(menteeData.startup_name || "My Startup");
      setCurrentStage(menteeData.startup_stage || "growth");
    }
  };

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

  const generateAIInsights = async () => {
    if (pivots.length === 0) {
      toast({
        title: "No pivots to analyze",
        description: "Document some pivots first to get AI insights.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke('analyze-pivots', {
        body: { pivots }
      });

      if (error) throw error;

      setAiInsights(data.insights);
      toast({
        title: "Analysis Complete! ✨",
        description: "AI has analyzed your pivot history.",
      });
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not generate insights. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateInvestorReport = async () => {
    if (pivots.length === 0) {
      toast({
        title: "No pivots to analyze",
        description: "Document some pivots first to generate a report.",
        variant: "destructive",
      });
      return;
    }

    setGeneratingReport(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-investor-report', {
        body: { 
          pivots,
          startupName,
          currentStage 
        }
      });

      if (error) throw error;

      setInvestorReport(data.report);
      setShowInvestorReport(true);
      toast({
        title: "Report Generated! 📊",
        description: "Your investor presentation is ready.",
      });
    } catch (error: any) {
      toast({
        title: "Generation Failed",
        description: error.message || "Could not generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingReport(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([investorReport], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${startupName.replace(/\s+/g, '-')}-investor-report.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

       {/* AI Features Section - After Pivots */}
       {pivots.length > 0 && (
         <div className="space-y-4">
           {/* AI Insights Card */}
           <Card className="p-6 bg-gradient-hero/5 border-primary/20">
             <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                   <Sparkles className="w-5 h-5 text-primary" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-foreground">AI Insights</h3>
                   <p className="text-sm text-muted-foreground">Patterns and learnings from your pivot journey</p>
                 </div>
               </div>
               <Button 
                 onClick={generateAIInsights}
                 disabled={isAnalyzing}
                 size="sm"
                 className="gap-2"
               >
                 {isAnalyzing ? (
                   <>
                     <Loader2 className="w-4 h-4 animate-spin" />
                     Analyzing...
                   </>
                 ) : (
                   <>
                     <Sparkles className="w-4 h-4" />
                     Generate Insights
                   </>
                 )}
               </Button>
             </div>

             {aiInsights ? (
               <div className="space-y-4 mt-4">
                 <div className="prose prose-sm max-w-none">
                   <div className="bg-background/50 rounded-lg p-4 whitespace-pre-wrap text-foreground">
                     {aiInsights}
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-center py-8 text-muted-foreground">
                 <p>Click "Generate Insights" to get AI-powered analysis of your pivots</p>
               </div>
             )}
           </Card>

           {/* Investor Report Card */}
           <Card className="p-6 bg-gradient-hero/5 border-accent/20">
             <div className="flex items-start justify-between mb-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                   <FileText className="w-5 h-5 text-accent" />
                 </div>
                 <div>
                   <h3 className="text-lg font-semibold text-foreground">Investor Presentation</h3>
                   <p className="text-sm text-muted-foreground">Generate a compelling report for investors</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <Button 
                   onClick={generateInvestorReport}
                   disabled={generatingReport}
                   size="sm"
                   className="gap-2"
                 >
                   {generatingReport ? (
                     <>
                       <Loader2 className="w-4 h-4 animate-spin" />
                       Generating...
                     </>
                   ) : (
                     <>
                       <FileText className="w-4 h-4" />
                       Generate Report
                     </>
                   )}
                 </Button>
                 {investorReport && (
                   <Button 
                     onClick={downloadReport}
                     size="sm"
                     variant="outline"
                     className="gap-2"
                   >
                     <Download className="w-4 h-4" />
                     Download
                   </Button>
                 )}
               </div>
             </div>

             {showInvestorReport && investorReport ? (
               <div className="space-y-4 mt-4">
                 <div className="prose prose-sm max-w-none dark:prose-invert">
                   <div className="bg-background/50 rounded-lg p-6 border border-border">
                     <div className="whitespace-pre-wrap text-foreground">
                       {investorReport.split('\n').map((line, idx) => {
                         // Render markdown-style headers
                         if (line.startsWith('# ')) {
                           return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
                         } else if (line.startsWith('## ')) {
                           return <h2 key={idx} className="text-xl font-bold mt-5 mb-2">{line.slice(3)}</h2>;
                         } else if (line.startsWith('### ')) {
                           return <h3 key={idx} className="text-lg font-semibold mt-4 mb-2">{line.slice(4)}</h3>;
                         } else if (line.startsWith('**') && line.endsWith('**')) {
                           return <p key={idx} className="font-bold my-2">{line.slice(2, -2)}</p>;
                         } else if (line.trim() === '') {
                           return <br key={idx} />;
                         } else {
                           return <p key={idx} className="my-2">{line}</p>;
                         }
                       })}
                     </div>
                   </div>
                 </div>
               </div>
             ) : (
               <div className="text-center py-8 text-muted-foreground">
                 <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
                 <p className="mb-2">Generate a professional investor presentation</p>
                 <p className="text-xs">Showcases your journey, resilience, and strategic thinking</p>
               </div>
             )}
           </Card>
         </div>
       )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PivotsTab;
