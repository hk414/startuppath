import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  created_at: string;
}

interface JournalTabProps {
  userId: string;
}

const JournalTab = ({ userId }: JournalTabProps) => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    fetchEntries();
  }, [userId]);

  const fetchEntries = async () => {
    const { data, error } = await supabase
      .from("journal_entries")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load journal entries",
        variant: "destructive",
      });
    } else {
      setEntries(data || []);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingEntry) {
      const { error } = await supabase
        .from("journal_entries")
        .update({ title, content, mood })
        .eq("id", editingEntry.id);

      if (error) {
        toast({ title: "Error", description: "Failed to update entry", variant: "destructive" });
      } else {
        toast({ title: "Success!", description: "Entry updated" });
      }
    } else {
      const { error } = await supabase
        .from("journal_entries")
        .insert({ user_id: userId, title, content, mood });

      if (error) {
        toast({ title: "Error", description: "Failed to create entry", variant: "destructive" });
      } else {
        toast({ title: "Success!", description: "Entry created" });
      }
    }

    resetForm();
    fetchEntries();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("journal_entries").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete entry", variant: "destructive" });
    } else {
      toast({ title: "Deleted", description: "Entry removed" });
      fetchEntries();
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setMood("");
    setEditingEntry(null);
    setIsOpen(false);
  };

  const startEdit = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setTitle(entry.title);
    setContent(entry.content);
    setMood(entry.mood || "");
    setIsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Daily Reflections</h2>
          <p className="text-muted-foreground mt-1">Document your thoughts and progress</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" onClick={() => resetForm()}>
              <Plus className="w-4 h-4" />
              New Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingEntry ? "Edit Entry" : "New Journal Entry"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's on your mind today?"
                  required
                />
              </div>
              <div>
                <Label htmlFor="mood">Mood (optional)</Label>
                <Input
                  id="mood"
                  value={mood}
                  onChange={(e) => setMood(e.target.value)}
                  placeholder="e.g., Excited, Challenged, Motivated"
                />
              </div>
              <div>
                <Label htmlFor="content">Reflection</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What did you learn today? What challenges did you face? What are you grateful for?"
                  rows={10}
                  required
                  className="resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">{editingEntry ? "Update" : "Save"} Entry</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {entries.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No journal entries yet</p>
          <Button onClick={() => setIsOpen(true)}>Create your first entry</Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {entries.map((entry) => (
            <Card key={entry.id} className="p-6 hover:shadow-strong transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-foreground">{entry.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {format(new Date(entry.created_at), "MMMM d, yyyy 'at' h:mm a")}
                    {entry.mood && <span className="ml-2">• {entry.mood}</span>}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(entry)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <p className="text-foreground whitespace-pre-wrap leading-relaxed">{entry.content}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default JournalTab;
