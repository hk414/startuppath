import { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Home, BookOpen, Lightbulb, GitBranch, Users, LogOut, Menu, Gamepad2, ZoomIn, ZoomOut, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import logo from "@/assets/startuppath-logo.jpg";
import DashboardHome from "./DashboardHome";
import JournalTab from "./JournalTab";
import PivotsTab from "./PivotsTab";
import MentorMatching from "./MentorMatching";
import Guidebook from "@/pages/Guidebook";

interface DashboardLayoutProps {
  user: User;
}

type Tab = "home" | "guidebook" | "journal" | "pivots" | "lessons" | "matching" | "challenges";

const DashboardLayout = ({ user }: DashboardLayoutProps) => {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [fontSize, setFontSize] = useState(100);
  const { toast } = useToast();
  const navigate = useNavigate();

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
  };

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
    { id: "matching" as Tab, label: "Mentors", icon: Users },
    { id: "challenges" as Tab, label: "Challenges", icon: Gamepad2 },
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
          {sidebarOpen ? (
            <div className="flex items-center gap-2">
              <img src={logo} alt="StartUpPath Logo" className="w-8 h-8 rounded-lg shadow-soft" />
              <h1 className="text-xl font-bold text-foreground">StartUpPath</h1>
            </div>
          ) : (
            <img src={logo} alt="StartUpPath Logo" className="w-8 h-8 rounded-lg shadow-soft mx-auto" />
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={!sidebarOpen ? "mx-auto mt-2" : ""}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Back to Home Button */}
        <div className={`p-4 border-b border-border ${!sidebarOpen ? 'flex justify-center' : ''}`}>
          <Button
            variant="outline"
            className={`w-full justify-start ${!sidebarOpen ? 'w-auto px-3' : ''}`}
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-5 h-5 flex-shrink-0" />
            {sidebarOpen && <span className="ml-3">Back to Home</span>}
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
          {/* Font Size Controls */}
          <div className={`flex items-center gap-1 border border-border rounded-lg p-1 ${!sidebarOpen ? 'flex-col' : ''}`}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={decreaseFontSize}
              aria-label="Decrease font size"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={increaseFontSize}
              aria-label="Increase font size"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
          
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
          {activeTab === "matching" && <MentorMatching userId={user.id} />}
          {activeTab === "challenges" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black bg-gradient-hero bg-clip-text text-transparent">
                    Startup Challenges Arena
                  </h2>
                  <p className="text-muted-foreground mt-1">
                    Play games, earn XP, and level up your entrepreneurial skills
                  </p>
                </div>
              </div>
              <iframe 
                src="/challenges" 
                className="w-full h-[calc(100vh-12rem)] border border-border rounded-2xl shadow-strong"
                title="Challenges"
              />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
