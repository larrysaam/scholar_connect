import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Send, X, Minimize2, Maximize2, Bot, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface IntelligentChatAssistantProps {
  userType: "student" | "researcher" | "research-aide";
  currentTab?: string;
}

const IntelligentChatAssistant = ({ userType, currentTab }: IntelligentChatAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getContextualSuggestions = () => {
    const baseQuestions = [
      "How can I improve my profile?",
      "What are the platform's best practices?",
      "How do I handle difficult situations?"
    ];

    if (userType === "researcher") {
      return [
        "How can I attract more consultation requests?",
        "What makes a good consultation session?",
        "How do I set competitive rates?",
        "How can I improve my response time?"
      ];
    } else if (userType === "research-aide") {
      return [
        "How can I find more job opportunities?",
        "What skills are most in demand?",
        "How do I build a strong portfolio?",
        "How can I improve my client ratings?"
      ];
    } else {
      return [
        "How do I find the right researcher?",
        "What should I prepare for my consultation?",
        "How do I get the most value from sessions?",
        "How does the payment system work?"
      ];
    }
  };

  const generateAIResponse = (userMessage: string) => {
    const responses = {
      profile: "To improve your profile, ensure you have a complete bio, relevant experience, and positive reviews. Consider adding specific expertise areas and updating your availability regularly.",
      consultation: "For better consultations, prepare an agenda, be punctual, take notes, and follow up with action items. Clear communication is key to successful sessions.",
      rates: "Research competitive rates in your field, consider your experience level, and start with introductory pricing to build reviews. You can adjust rates as you gain more positive feedback.",
      opportunities: "To find more opportunities, optimize your profile keywords, respond quickly to requests, maintain high ratings, and consider expanding your skill set based on market demand.",
      payment: "The platform uses secure payment processing. Payments are held in escrow until service completion, ensuring protection for both parties. Withdrawals are typically processed within 3-5 business days."
    };

    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('profile') || lowerMessage.includes('improve')) {
      return responses.profile;
    } else if (lowerMessage.includes('consultation') || lowerMessage.includes('session')) {
      return responses.consultation;
    } else if (lowerMessage.includes('rate') || lowerMessage.includes('price')) {
      return responses.rates;
    } else if (lowerMessage.includes('job') || lowerMessage.includes('opportunity')) {
      return responses.opportunities;
    } else if (lowerMessage.includes('payment') || lowerMessage.includes('money')) {
      return responses.payment;
    } else {
      return "I'm here to help! Feel free to ask about profile optimization, consultation best practices, pricing strategies, or any other platform-related questions.";
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(inputValue),
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg z-50"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <Card className={`fixed bottom-6 right-6 w-96 shadow-xl z-50 transition-all duration-300 ${
      isMinimized ? 'h-16' : 'h-[500px]'
    }`}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bot className="h-5 w-5 text-blue-600" />
            AI Assistant
          </CardTitle>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="flex flex-col h-full pb-4">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-64">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-sm">Hello! I'm your AI assistant. How can I help you today?</p>
                <div className="mt-4 space-y-2">
                  {getContextualSuggestions().slice(0, 2).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                      onClick={() => handleQuickQuestion(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {!message.isUser && <Bot className="h-4 w-4 mt-1 flex-shrink-0" />}
                    {message.isUser && <User className="h-4 w-4 mt-1 flex-shrink-0" />}
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {getContextualSuggestions().slice(0, 3).map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleQuickQuestion(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 min-h-[40px] max-h-[80px]"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                size="icon"
                className="h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
};

export default IntelligentChatAssistant;
