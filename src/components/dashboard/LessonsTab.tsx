import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Lesson {
  id: string;
  title: string;
  category: string;
  lesson: string;
  context?: string;
  impact_level?: string;
  created_at: string;
}

interface LessonsTabProps {
  userId: string;
}

const categories = [
  "Product Development",
  "Marketing",
  "Sales",
  "Team Building",
  "Fundraising",
  "Customer Discovery",
  "Technology",
  "Strategy",
  "Operations",
  "Other",
];

const impactLevels = ["Low", "Medium", "High", "Critical"];

const LessonsTab = ({ userId }: LessonsTabProps) => {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [lesson, setLesson] = useState("");
  const [context, setContext] = useState("");
  const [impactLevel, setImpactLevel] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchLessons();
  }, [userId]);

  const fetchLessons = async () => {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load lessons",
        variant: "destructive",
      });
    } else {
      setLessons(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const lessonData = {
      title,
      category,
      lesson,
      context,
      impact_level: impactLevel,
    };

    if (editingLesson) {
      const { error } = await supabase
        .from("lessons")
        .update(lessonData)
        .eq("id", editingLesson.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update lesson", variant: "destructive" });
      } else {
        toast({ title: "Success!", description: "Lesson updated" });
      }
    } else {
      const { error } = await supabase
        .from("lessons")
        .insert({ ...lessonData, user_id: userId });

      if (error) {
        toast({ title: "Error", description: "Failed to create lesson", variant: "destructive" });
      } else {
        toast({ title: "Success!", description: "Lesson saved" });
      }
    }

    resetForm();
    fetchLessons();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("lessons").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete lesson", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Lesson removed" });
      fetchLessons();
    }
  };

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setLesson("");
    setContext("");
    setImpactLevel("");
    setEditingLesson(null);
    setIsOpen(false);
  };

  const startEdit = (lessonItem: Lesson) => {
    setEditingLesson(lessonItem);
    setTitle(lessonItem.title);
    setCategory(lessonItem.category);
    setLesson(lessonItem.lesson);
    setContext(lessonItem.context || "");
    setImpactLevel(lessonItem.impact_level || "");
    setIsOpen(true);
  };

  const getImpactColor = (level?: string) => {
    switch (level) {
      case "Critical":
        return "text-destructive";
      case "High":
        return "text-accent";
      case "Medium":
        return "text-primary";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Lessons Learned</h2>
          <p className="text-muted-foreground mt-1">Capture insights to avoid repeating mistakes</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              Add Lesson
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Edit Lesson" : "New Lesson Learned"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Brief title for this lesson"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="impact">Impact Level (optional)</Label>
                  <Select value={impactLevel} onValueChange={setImpactLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select impact" />
                    </SelectTrigger>
                    <SelectContent>
                      {impactLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="lesson">The Lesson</Label>
                <Textarea
                  id="lesson"
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  placeholder="What did you learn? What would you do differently?"
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label htmlFor="context">Context (optional)</Label>
                <Textarea
                  id="context"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="What was the situation? What happened?"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingLesson ? "Update" : "Save"} Lesson</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {lessons.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No lessons documented yet</p>
          <Button onClick={() => setIsOpen(true)}>Add your first lesson</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {lessons.map((lessonItem) => (
            <Card key={lessonItem.id} className="p-6 hover:shadow-strong transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{lessonItem.title}</h3>
                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                      {lessonItem.category}
                    </span>
                    {lessonItem.impact_level && (
                      <span className={`text-xs font-medium ${getImpactColor(lessonItem.impact_level)}`}>
                        {lessonItem.impact_level} Impact
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(lessonItem.created_at), "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(lessonItem)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(lessonItem.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 bg-accent-light rounded-lg">
                  <p className="text-foreground font-medium">💡 {lessonItem.lesson}</p>
                </div>
                
                {lessonItem.context && (
                  <div>
                    <p className="text-sm text-muted-foreground font-medium mb-1">Context:</p>
                    <p className="text-sm text-foreground">{lessonItem.context}</p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LessonsTab;
