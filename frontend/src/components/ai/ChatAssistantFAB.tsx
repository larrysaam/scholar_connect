
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle } from "lucide-react";
import { useChatAssistant } from "@/contexts/ChatAssistantContext";
import { Badge } from "@/components/ui/badge";

const ChatAssistantFAB = () => {
  const { isVisible, setIsVisible } = useChatAssistant();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="relative">
        <Button
          onClick={() => setIsVisible(!isVisible)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl border-2 border-white transition-all duration-300 hover:scale-110"
        >
          {isVisible ? (
            <MessageCircle className="h-6 w-6 text-white" />
          ) : (
            <Bot className="h-6 w-6 text-white" />
          )}
        </Button>
        
        {!isVisible && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
            AI
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ChatAssistantFAB;
