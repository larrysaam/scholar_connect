
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Send, 
  Minimize2, 
  Maximize2, 
  X, 
  Lightbulb,
  HelpCircle,
  Sparkles,
  MessageCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  type: "user" | "assistant";
  timestamp: Date;
  suggestions?: string[];
  category?: "guidance" | "qa" | "suggestion" | "help";
}

interface ChatAssistantProps {
  userType: "student" | "researcher" | "research-aide";
  currentTab?: string;
}

const IntelligentChatAssistant = ({ userType, currentTab }: ChatAssistantProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isMinimized, setIsMinimized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Welcome message based on user type and current tab
  useEffect(() => {
    const welcomeMessage = getWelcomeMessage(userType, currentTab);
    if (messages.length === 0) {
      setMessages([{
        id: "welcome",
        content: welcomeMessage.content,
        type: "assistant",
        timestamp: new Date(),
        suggestions: welcomeMessage.suggestions,
        category: "guidance"
      }]);
    }
  }, [userType, currentTab]);

  const getWelcomeMessage = (type: string, tab?: string) => {
    const tabSpecific = tab ? getTabSpecificGuidance(type, tab) : null;
    
    const baseMessages = {
      student: {
        content: `Hi there! I'm your AI assistant. I'm here to help you navigate the platform, find researchers, book consultations, and maximize your learning experience. ${tabSpecific?.content || "What can I help you with today?"}`,
        suggestions: tabSpecific?.suggestions || [
          "How do I find the right researcher?",
          "What's the consultation process?",
          "How do I prepare for a session?",
          "Platform features overview"
        ]
      },
      researcher: {
        content: `Welcome! I'm here to assist you with managing consultations, optimizing your profile, and growing your research practice on the platform. ${tabSpecific?.content || "How can I help you today?"}`,
        suggestions: tabSpecific?.suggestions || [
          "How to optimize my profile?",
          "Managing consultation requests",
          "Building my reputation",
          "Payment and earnings guide"
        ]
      },
      "research-aide": {
        content: `Hello! I'm your AI helper for managing jobs, delivering quality work, and building your professional reputation. ${tabSpecific?.content || "What would you like to know?"}`,
        suggestions: tabSpecific?.suggestions || [
          "How to find quality jobs?",
          "Best practices for deliverables",
          "Building client relationships",
          "Managing deadlines effectively"
        ]
      }
    };

    return baseMessages[type] || baseMessages.student;
  };

  const getTabSpecificGuidance = (userType: string, tab: string) => {
    const guidance = {
      student: {
        "find-researcher": {
          content: "I see you're looking for researchers. Let me help you find the perfect match!",
          suggestions: [
            "Search filters and criteria",
            "How to evaluate researchers",
            "Understanding researcher profiles",
            "Booking consultation tips"
          ]
        },
        "session-booking": {
          content: "Ready to book a session? I'll guide you through the process.",
          suggestions: [
            "Choosing the right session type",
            "Preparing for your consultation",
            "What to expect during booking",
            "Payment and scheduling"
          ]
        },
        "ai-assistant": {
          content: "Exploring our AI features? These tools can supercharge your research!",
          suggestions: [
            "How AI matching works",
            "Using AI scheduling",
            "Getting topic recommendations",
            "Maximizing AI benefits"
          ]
        }
      },
      researcher: {
        "consultation-services": {
          content: "Let's optimize your consultation services and attract more students.",
          suggestions: [
            "Setting competitive rates",
            "Creating compelling service descriptions",
            "Managing availability",
            "Improving consultation quality"
          ]
        },
        "performance": {
          content: "Want to boost your performance metrics? I can help with that!",
          suggestions: [
            "Understanding rating factors",
            "Improving response times",
            "Building student satisfaction",
            "Growing your reputation"
          ]
        }
      },
      "research-aide": {
        "job-requests": {
          content: "Looking at job opportunities? Let me help you find the best matches.",
          suggestions: [
            "Evaluating job quality",
            "Writing winning proposals",
            "Understanding requirements",
            "Pricing your services"
          ]
        },
        "files-deliverables": {
          content: "Managing deliverables effectively is key to success. Let me guide you.",
          suggestions: [
            "Quality standards",
            "File formatting tips",
            "Meeting deadlines",
            "Client communication"
          ]
        }
      }
    };

    return guidance[userType]?.[tab];
  };

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const responses = getContextualResponses(userMessage, userType, currentTab);
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    return {
      id: Date.now().toString(),
      content: randomResponse.content,
      type: "assistant",
      timestamp: new Date(),
      suggestions: randomResponse.suggestions,
      category: randomResponse.category
    };
  };

  const getContextualResponses = (message: string, userType: string, tab?: string) => {
    const lowerMessage = message.toLowerCase();

    // Platform navigation help
    if (lowerMessage.includes("navigate") || lowerMessage.includes("find") || lowerMessage.includes("where")) {
      return [{
        content: "I can help you navigate the platform! Use the sidebar to access different sections. Each tab has specific functionality - would you like me to explain any particular area?",
        suggestions: ["Dashboard overview", "Key features guide", "Quick start tips"],
        category: "guidance" as const
      }];
    }

    // User-specific responses
    if (userType === "student") {
      if (lowerMessage.includes("researcher") || lowerMessage.includes("find expert")) {
        return [{
          content: "To find the perfect researcher: 1) Use advanced filters (field, rating, price), 2) Read profiles carefully, 3) Check reviews and ratings, 4) Consider availability and response time. Would you like specific tips for your research area?",
          suggestions: ["Search strategies", "Evaluating profiles", "Booking tips"],
          category: "guidance" as const
        }];
      }
      
      if (lowerMessage.includes("consultation") || lowerMessage.includes("session")) {
        return [{
          content: "For successful consultations: 1) Prepare specific questions beforehand, 2) Share relevant documents in advance, 3) Be clear about your goals, 4) Take notes during the session. Want help preparing for your next consultation?",
          suggestions: ["Preparation checklist", "Question templates", "Follow-up strategies"],
          category: "help" as const
        }];
      }
    }

    if (userType === "researcher") {
      if (lowerMessage.includes("profile") || lowerMessage.includes("optimize")) {
        return [{
          content: "To optimize your profile: 1) Complete all sections thoroughly, 2) Add recent publications and achievements, 3) Set competitive but fair rates, 4) Upload a professional photo, 5) Keep availability updated. Your profile completeness affects visibility!",
          suggestions: ["Profile checklist", "Rate setting guide", "Visibility tips"],
          category: "suggestion" as const
        }];
      }
      
      if (lowerMessage.includes("student") || lowerMessage.includes("consultation")) {
        return [{
          content: "Building great student relationships: 1) Respond promptly to inquiries, 2) Set clear expectations, 3) Provide valuable insights during sessions, 4) Follow up when appropriate, 5) Maintain professionalism. Happy students lead to better ratings!",
          suggestions: ["Communication best practices", "Session management", "Building reputation"],
          category: "guidance" as const
        }];
      }
    }

    if (userType === "research-aide") {
      if (lowerMessage.includes("job") || lowerMessage.includes("work")) {
        return [{
          content: "Finding quality jobs: 1) Look for detailed job descriptions, 2) Check client ratings and history, 3) Ensure clear deliverable requirements, 4) Communicate before accepting, 5) Build long-term client relationships. Quality over quantity wins!",
          suggestions: ["Job evaluation criteria", "Proposal writing", "Client communication"],
          category: "guidance" as const
        }];
      }
      
      if (lowerMessage.includes("deliverable") || lowerMessage.includes("quality")) {
        return [{
          content: "Delivering excellent work: 1) Understand requirements fully before starting, 2) Maintain high quality standards, 3) Meet deadlines consistently, 4) Communicate progress regularly, 5) Ask for clarification when needed. Your reputation depends on consistency!",
          suggestions: ["Quality standards", "Time management", "Client updates"],
          category: "help" as const
        }];
      }
    }

    // General platform help
    return [{
      content: "I'm here to help with any platform-related questions! I can assist with navigation, features, best practices, and troubleshooting. What specific area would you like to explore?",
      suggestions: ["Platform features", "Best practices", "Getting started", "Troubleshooting"],
      category: "qa" as const
    }];
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      type: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const aiResponse = await generateAIResponse(inputMessage);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "guidance": return <Lightbulb className="h-3 w-3" />;
      case "qa": return <HelpCircle className="h-3 w-3" />;
      case "suggestion": return <Sparkles className="h-3 w-3" />;
      case "help": return <MessageCircle className="h-3 w-3" />;
      default: return <Bot className="h-3 w-3" />;
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case "guidance": return "bg-blue-100 text-blue-700";
      case "qa": return "bg-green-100 text-green-700";
      case "suggestion": return "bg-purple-100 text-purple-700";
      case "help": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px]">
      <Card className="h-full flex flex-col shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5" />
              <CardTitle className="text-lg">AI Assistant</CardTitle>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex items-start space-x-2 max-w-[85%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {message.type === "user" ? (
                        <AvatarFallback className="bg-blue-100 text-blue-600">U</AvatarFallback>
                      ) : (
                        <AvatarFallback className="bg-purple-100 text-purple-600">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      )}
                    </Avatar>
                    
                    <div className="space-y-2">
                      <div className={`rounded-lg p-3 ${
                        message.type === "user" 
                          ? "bg-blue-600 text-white ml-2" 
                          : "bg-gray-100 text-gray-800 mr-2"
                      }`}>
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        {message.category && message.type === "assistant" && (
                          <Badge className={`mt-2 text-xs ${getCategoryColor(message.category)}`}>
                            {getCategoryIcon(message.category)}
                            <span className="ml-1 capitalize">{message.category}</span>
                          </Badge>
                        )}
                      </div>
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="space-y-1">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="text-xs h-7 mr-1 mb-1 hover:bg-blue-50 hover:border-blue-200"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-purple-100 text-purple-600">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                placeholder="Ask me anything about the platform..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputMessage.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntelligentChatAssistant;
