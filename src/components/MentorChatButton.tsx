import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import MentorChatWindow from "./MentorChatWindow";

const MentorChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            variant="hero"
            className="rounded-full w-16 h-16 shadow-glow group relative"
          >
            <MessageCircle className="w-7 h-7" />
            {/* Ping Animation */}
            <span className="absolute top-0 right-0 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-accent"></span>
            </span>
          </Button>
        )}
        
        {isOpen && (
          <Button
            onClick={() => setIsOpen(false)}
            size="lg"
            variant="secondary"
            className="rounded-full w-16 h-16 shadow-strong"
          >
            <X className="w-6 h-6" />
          </Button>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && <MentorChatWindow onClose={() => setIsOpen(false)} />}
    </>
  );
};

export default MentorChatButton;
