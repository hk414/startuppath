import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Home, BookOpen, Lightbulb, GitBranch, Users, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import DashboardHome from "./DashboardHome";
import JournalTab from "./JournalTab";
import PivotsTab from "./PivotsTab";
import LessonsTab from "./LessonsTab";
import MentorMatching from "./MentorMatching";
import Guidebook from "@/pages/Guidebook";

interface DashboardLayoutProps {
  user: User;
}

type Tab = "home" | "guidebook" | "journal" | "pivots" | "lessons" | "matching";

const DashboardLayout = ({ user }: DashboardLayoutProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "Come back soon to continue your journey!",
    });
    navigate("/");
  };

  const tabs = [
    { id: "home" as Tab, label: "Home", icon: Home },
    { id: "guidebook" as Tab, label: "Guidebook", icon: BookOpen },
    { id: "journal" as Tab, label: "Journal", icon: GitBranch },
    { id: "pivots" as Tab, label: "Pivots", icon: Lightbulb },
    { id: "lessons" as Tab, label: "Lessons", icon: Lightbulb },
    { id: "matching" as Tab, label: "Mentors", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-card border-r border-border transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-foreground">Pivot Tracker</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-soft"
                  : "hover:bg-muted text-muted-foreground"
              }`}
            >
              <tab.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{tab.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-border space-y-2">
          {sidebarOpen && (
            <div className="px-4 py-2 text-sm text-muted-foreground">
              <p className="font-medium truncate">{user.email}</p>
            </div>
          )}
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleSignOut}
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-6 md:p-8">
          {activeTab === "home" && <DashboardHome onNavigate={setActiveTab} />}
          {activeTab === "guidebook" && <Guidebook />}
          {activeTab === "journal" && <JournalTab userId={user.id} />}
          {activeTab === "pivots" && <PivotsTab userId={user.id} />}
          {activeTab === "lessons" && <LessonsTab userId={user.id} />}
          {activeTab === "matching" && <MentorMatching userId={user.id} />}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
