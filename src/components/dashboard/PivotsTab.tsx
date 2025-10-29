import { useState, useEffect, useRef } from "react";
import { Plus, Edit2, Trash2, Sparkles, TrendingUp, Loader2, FileText, Download, Crown, Lock, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import JourneyTimeline from "./JourneyTimeline";
import ReactMarkdown from 'react-markdown';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pptxgen from 'pptxgenjs';

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
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumStep, setPremiumStep] = useState<'info' | 'payment' | 'success'>('info');
  const [isPremiumUser, setIsPremiumUser] = useState(() => {
    // Load premium status from localStorage
    return localStorage.getItem('isPremiumUser') === 'true';
  });
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const reportRef = useRef<HTMLDivElement>(null);
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
    if (!isPremiumUser) {
      setShowPremiumModal(true);
      return;
    }

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
    if (!isPremiumUser) {
      setShowPremiumModal(true);
      return;
    }

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

  const downloadPDF = async () => {
    if (!reportRef.current) return;

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`${startupName.replace(/\s+/g, '-')}-investor-report.pdf`);
      
      toast({
        title: "PDF Downloaded! 📄",
        description: "Your investor report has been saved.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const downloadPPTX = async () => {
    try {
      const pptx = new pptxgen();
      
      // Parse markdown into slides
      const sections = investorReport.split('\n## ').filter(s => s.trim());
      
      sections.forEach((section, idx) => {
        const slide = pptx.addSlide();
        const lines = section.split('\n').filter(l => l.trim());
        
        // Title (first line)
        const title = lines[0].replace(/^# /, '');
        slide.addText(title, {
          x: 0.5,
          y: 0.5,
          w: '90%',
          h: 1,
          fontSize: 32,
          bold: true,
          color: '363636',
        });

        // Content
        const content = lines.slice(1).join('\n');
        slide.addText(content, {
          x: 0.5,
          y: 1.8,
          w: '90%',
          h: 4.5,
          fontSize: 14,
          color: '666666',
          valign: 'top',
        });
      });

      await pptx.writeFile({ fileName: `${startupName.replace(/\s+/g, '-')}-investor-report.pptx` });
      
      toast({
        title: "PPTX Downloaded! 📊",
        description: "Your investor presentation has been saved.",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not generate PPTX. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setPremiumStep('success');
      setTimeout(() => {
        setIsPremiumUser(true);
        // Persist premium status to localStorage
        localStorage.setItem('isPremiumUser', 'true');
        setShowPremiumModal(false);
        setPremiumStep('info');
        // Reset form
        setCardNumber("");
        setExpiryDate("");
        setCvv("");
        setCardName("");
        toast({
          title: "Welcome to Premium! 🎉",
          description: "You now have permanent access to all premium features.",
        });
      }, 2000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-heading font-bold text-foreground">Pivots & Decisions</h2>
          <p className="text-muted-foreground">Track your journey and document strategic decisions</p>
        </div>
      </div>

      {/* Premium Modal */}
      <Dialog open={showPremiumModal} onOpenChange={(open) => {
        setShowPremiumModal(open);
        if (!open) {
          setPremiumStep('info');
          setCardNumber("");
          setExpiryDate("");
          setCvv("");
          setCardName("");
        }
      }}>
        <DialogContent className="sm:max-w-md">
          {premiumStep === 'info' && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                </div>
                <DialogTitle className="text-center text-2xl">Upgrade to Premium</DialogTitle>
                <DialogDescription className="text-center space-y-4 pt-4">
                  <p className="text-base">
                    Unlock AI Insights and Investor Reports with Premium.
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                    <p className="font-semibold text-foreground">Premium includes:</p>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>✨ AI-powered pivot analysis</li>
                      <li>📊 Professional investor reports</li>
                      <li>📄 Export to PDF, PPTX & Markdown</li>
                      <li>🎯 Personalized recommendations</li>
                    </ul>
                    </div>
                    <div className="pt-2">
                      <p className="text-2xl font-bold text-foreground">£10</p>
                      <p className="text-sm text-muted-foreground">One-time payment • Lifetime access</p>
                    </div>
                  </DialogDescription>
                </DialogHeader>
                <div className="flex gap-3 mt-4">
                  <Button
                  variant="outline"
                  onClick={() => setShowPremiumModal(false)}
                  className="flex-1"
                >
                  Maybe Later
                </Button>
                <Button
                  onClick={() => setPremiumStep('payment')}
                  className="flex-1"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Continue
                </Button>
              </div>
            </>
          )}

          {premiumStep === 'payment' && (
            <>
              <DialogHeader>
                <DialogTitle className="text-center text-2xl">Payment Details</DialogTitle>
                <DialogDescription className="text-center">
                  Enter your payment information to complete upgrade
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="card-name">Cardholder Name</Label>
                  <Input
                    id="card-name"
                    placeholder="John Doe"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <div className="relative">
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, '');
                        const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
                        setCardNumber(formatted);
                      }}
                      maxLength={19}
                    />
                    <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      value={expiryDate}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        if (value.length >= 2) {
                          setExpiryDate(value.slice(0, 2) + '/' + value.slice(2, 4));
                        } else {
                          setExpiryDate(value);
                        }
                      }}
                      maxLength={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      maxLength={3}
                    />
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setPremiumStep('info')}
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  onClick={handlePayment}
                  disabled={!cardName || cardNumber.length < 19 || expiryDate.length < 5 || cvv.length < 3}
                  className="flex-1"
                >
                    <Lock className="w-4 h-4 mr-2" />
                    Pay £10
                  </Button>
              </div>
            </>
          )}

          {premiumStep === 'success' && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center animate-in zoom-in duration-300">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                <DialogTitle className="text-center text-2xl">Payment Successful!</DialogTitle>
                <DialogDescription className="text-center space-y-4 pt-4">
                  <p className="text-base text-foreground">
                    Welcome to Premium! 🎉
                  </p>
                    <p className="text-sm text-muted-foreground">
                      You now have permanent access to all premium features including AI Insights and Investor Reports.
                    </p>
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="timeline">Journey Timeline</TabsTrigger>
          <TabsTrigger value="pivots">Pivots & Decisions</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="mt-6">
          <JourneyTimeline userId={userId} />
        </TabsContent>

        <TabsContent value="pivots" className="mt-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-heading font-semibold text-foreground">Your Pivots</h3>
              <p className="text-sm text-muted-foreground">Document and track major strategic decisions</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => resetForm()}>
                  <Plus className="w-4 h-4 mr-2" />
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
            <Card className="p-12 text-center border-dashed">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-semibold text-foreground">No pivots documented yet</h4>
                <p className="text-sm text-muted-foreground">Start tracking your startup's evolution and strategic decisions</p>
                <Button onClick={() => setIsOpen(true)} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Document Your First Pivot
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {pivots.map((pivot) => (
                <Card key={pivot.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-heading font-semibold text-foreground mb-1">{pivot.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(pivot.pivot_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEdit(pivot)}
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(pivot.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Description</p>
                      <p className="text-sm text-foreground">{pivot.description}</p>
                    </div>
                    
                    <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                      <p className="text-xs font-medium text-primary mb-1.5 uppercase tracking-wide">Decision Made</p>
                      <p className="text-sm text-foreground">{pivot.decision_made}</p>
                    </div>
                    
                    {pivot.reasoning && (
                      <div className="p-4 rounded-lg border border-border">
                        <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wide">Reasoning</p>
                        <p className="text-sm text-foreground">{pivot.reasoning}</p>
                      </div>
                    )}
                    
                    {pivot.outcome && (
                      <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/10">
                        <p className="text-xs font-medium text-secondary-foreground mb-1.5 uppercase tracking-wide">Outcome</p>
                        <p className="text-sm text-foreground">{pivot.outcome}</p>
                      </div>
                    )}
                    
                    {pivot.lessons_learned && (
                      <div className="bg-accent/5 p-4 rounded-lg border border-accent/10">
                        <p className="text-xs font-medium text-accent-foreground mb-1.5 uppercase tracking-wide flex items-center gap-1.5">
                          <span>💡</span>
                          Lessons Learned
                        </p>
                        <p className="text-sm text-foreground">{pivot.lessons_learned}</p>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* AI Features - Side by Side Grid */}
          {pivots.length > 0 && (
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {/* AI Insights Card */}
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-semibold text-foreground">AI Insights</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Patterns from your pivot journey</p>
                  </div>
                </div>
                
                <Button 
                  onClick={generateAIInsights}
                  disabled={isAnalyzing}
                  className="w-full"
                  size="lg"
                  variant={!isPremiumUser ? "outline" : "default"}
                >
                  {!isPremiumUser ? (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Unlock with Premium
                    </>
                  ) : isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate Insights
                    </>
                  )}
                </Button>

                {aiInsights && (
                  <div className="mt-4 bg-background/60 rounded-lg p-4 border border-border max-h-96 overflow-y-auto">
                    <ReactMarkdown
                      components={{
                        h2: ({node, ...props}) => <h2 className="text-lg font-heading font-semibold mt-3 mb-2 text-foreground first:mt-0" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-base font-heading font-medium mt-2 mb-1.5 text-foreground" {...props} />,
                        p: ({node, ...props}) => <p className="my-2 text-sm text-foreground" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 space-y-1 text-sm text-foreground" {...props} />,
                        li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                      }}
                    >
                      {aiInsights}
                    </ReactMarkdown>
                  </div>
                )}
              </Card>

              {/* Investor Report Card */}
              <Card className="p-6 bg-gradient-to-br from-secondary/5 to-transparent border-secondary/20">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-secondary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-heading font-semibold text-foreground">Investor Report</h3>
                      <Badge variant="secondary" className="text-xs">
                        <Crown className="w-3 h-3 mr-1" />
                        Premium
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Generate professional presentation</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    onClick={generateInvestorReport}
                    disabled={generatingReport}
                    className="w-full"
                    size="lg"
                    variant={!isPremiumUser ? "outline" : "default"}
                  >
                    {!isPremiumUser ? (
                      <>
                        <Lock className="w-4 h-4 mr-2" />
                        Unlock with Premium
                      </>
                    ) : generatingReport ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>
                  
                  {investorReport && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          size="lg"
                          variant="outline"
                          className="w-full"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Report
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-full">
                        <DropdownMenuItem onClick={downloadPDF}>
                          Download as PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadPPTX}>
                          Download as PPTX
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={downloadReport}>
                          Download as Markdown
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                {showInvestorReport && investorReport && (
                  <div className="mt-4 bg-background/60 rounded-lg p-4 border border-border max-h-96 overflow-y-auto">
                    <div ref={reportRef}>
                      <ReactMarkdown
                        components={{
                          h1: ({node, ...props}) => <h1 className="text-2xl font-heading font-bold mt-0 mb-4 text-foreground" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-lg font-heading font-semibold mt-4 mb-2 text-foreground first:mt-0" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-base font-heading font-medium mt-3 mb-1.5 text-foreground" {...props} />,
                          p: ({node, ...props}) => <p className="my-2 text-sm text-foreground" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                          em: ({node, ...props}) => <em className="italic text-foreground" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc list-inside my-2 space-y-1 text-sm text-foreground" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal list-inside my-2 space-y-1 text-sm text-foreground" {...props} />,
                          li: ({node, ...props}) => <li className="text-foreground" {...props} />,
                        }}
                      >
                        {investorReport}
                      </ReactMarkdown>
                    </div>
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
