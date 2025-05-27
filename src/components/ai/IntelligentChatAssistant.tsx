
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, X, Send, Minimize2, Maximize2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  category?: string;
}

interface IntelligentChatAssistantProps {
  userType: "student" | "researcher" | "research-aide";
  currentTab?: string;
}

const IntelligentChatAssistant = ({ userType, currentTab }: IntelligentChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getSuggestions = () => {
    const baseSuggestions = [
      "How do I update my profile?",
      "What are the payment methods?",
      "How to contact support?",
      "Platform guidelines"
    ];

    const tabSpecificSuggestions: Record<string, string[]> = {
      "job-requests": [
        "How to apply for jobs?",
        "What makes a good proposal?",
        "How to set competitive rates?"
      ],
      "notifications": [
        "How to manage notifications?",
        "What do priority levels mean?",
        "How to update notification preferences?"
      ],
      "previous-works": [
        "How to showcase my portfolio?",
        "What files can I upload?",
        "How to add previous experience?"
      ]
    };

    return currentTab && tabSpecificSuggestions[currentTab] 
      ? [...tabSpecificSuggestions[currentTab], ...baseSuggestions.slice(0, 2)]
      : baseSuggestions;
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes("notification") && message.includes("priority")) {
      return `Notification priorities are determined automatically based on urgency and type:

**High Priority** (🔴):
- New job requests (immediate opportunities)
- Pending deliveries with approaching deadlines
- Urgent appointment reminders

**Medium Priority** (🟡):
- Payment confirmations
- Regular appointment reminders
- New messages from clients

**Low Priority** (🟢):
- General updates
- Profile views
- System announcements

You can filter notifications by priority in your notifications tab to focus on what's most important.`;
    }

    if (message.includes("portfolio") || message.includes("previous work")) {
      return `To add previous works to your portfolio:

1. **Click "Include Previous Work"** button
2. **Select Project Type** from dropdown:
   - Platform Project (work done through ScholarConnect)
   - Previous Experience (work done outside platform)
3. **Fill required fields**: Title, Description, Project Type
4. **Add optional details**: Institution, Duration, Outcomes
5. **Click "Add Work"** to save

Your portfolio helps clients understand your expertise and builds trust. Include diverse projects that showcase your skills!`;
    }

    if (message.includes("job") && message.includes("apply")) {
      return `Here's how to successfully apply for jobs:

1. **Read carefully** - Understand all requirements
2. **Write a personalized proposal** - Show you understand their needs
3. **Highlight relevant experience** - Reference similar past work
4. **Be specific about deliverables** - What exactly will you provide?
5. **Set realistic timelines** - Consider your current workload
6. **Ask clarifying questions** - Show engagement and professionalism

💡 **Pro tip**: Response time matters! Apply quickly but thoughtfully to quality opportunities.`;
    }

    // Default responses based on user type
    if (userType === "research-aide") {
      return `I'm here to help you navigate the Research Aids platform! 

Common topics I can assist with:
- Job applications and proposals
- Portfolio management
- Payment and earnings
- Client communication
- Platform guidelines

Feel free to ask specific questions about any feature or process. What would you like to know more about?`;
    }

    return "I'm here to help! Could you please be more specific about what you'd like to know?";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      text: inputValue,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const assistantMessage: Message = {
        id: `msg_${Date.now()}_assistant`,
        text: generateResponse(inputValue),
        sender: "assistant",
        timestamp: new Date(),
        category: "guidance"
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className={`w-96 shadow-xl transition-all duration-200 ${isMinimized ? 'h-16' : 'h-[500px]'}`}>
        <CardHeader className="flex flex-row items-center justify-between p-4 bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-sm font-medium flex items-center">
            <Bot className="h-4 w-4 mr-2" />
            AI Assistant
          </CardTitle>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 text-white hover:bg-blue-700"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className="flex flex-col h-[calc(500px-64px)] p-0">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Bot className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm">Hi! I'm your AI assistant.</p>
                  <p className="text-xs">How can I help you today?</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.sender === "assistant" && (
                        <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                      )}
                      <div className="flex-1">
                        <div className="text-sm whitespace-pre-wrap">{message.text}</div>
                        {message.category && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {message.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-blue-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 0 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
                <div className="flex flex-wrap gap-1">
                  {getSuggestions().slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="text-xs h-6 px-2"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask me anything..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default IntelligentChatAssistant;
