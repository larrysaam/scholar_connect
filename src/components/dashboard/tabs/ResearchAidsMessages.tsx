
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ResearchAidsMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(1);
  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();

  const [conversations, setConversations] = useState([
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      lastMessage: "Thank you for the analysis. Can we schedule a call?",
      time: "2 min ago",
      unread: 2,
      avatar: "/placeholder-avatar.jpg",
      project: "Statistical Analysis Project"
    },
    {
      id: 2,
      name: "Prof. Michael Chen",
      lastMessage: "The literature review looks great so far...",
      time: "1 hour ago",
      unread: 0,
      avatar: "/placeholder-avatar.jpg",
      project: "Climate Change Review"
    },
    {
      id: 3,
      name: "Dr. Marie Dubois",
      lastMessage: "When can you start the data collection?",
      time: "3 hours ago",
      unread: 1,
      avatar: "/placeholder-avatar.jpg",
      project: "Agricultural Study"
    }
  ]);

  const [allMessages, setAllMessages] = useState({
    1: [
      {
        id: 1,
        sender: "Dr. Sarah Johnson",
        content: "Hi Dr. Neba, I've reviewed your proposal for the statistical analysis. It looks comprehensive!",
        time: "10:30 AM",
        isMe: false
      },
      {
        id: 2,
        sender: "You",
        content: "Thank you! I'm excited to work on this project. When would you like to start?",
        time: "10:45 AM",
        isMe: true
      },
      {
        id: 3,
        sender: "Dr. Sarah Johnson",
        content: "We can start as soon as possible. I'll send you the dataset by tomorrow.",
        time: "11:00 AM",
        isMe: false
      },
      {
        id: 4,
        sender: "You",
        content: "Perfect! I've completed the initial analysis. Please find the results attached.",
        time: "2:15 PM",
        isMe: true
      },
      {
        id: 5,
        sender: "Dr. Sarah Johnson",
        content: "Thank you for the analysis. Can we schedule a call to discuss the findings?",
        time: "2:18 PM",
        isMe: false
      }
    ],
    2: [
      {
        id: 1,
        sender: "Prof. Michael Chen",
        content: "Hello! I need help with a comprehensive literature review on climate change impacts.",
        time: "9:00 AM",
        isMe: false
      },
      {
        id: 2,
        sender: "You",
        content: "I'd be happy to help with your literature review. What specific aspects are you focusing on?",
        time: "9:15 AM",
        isMe: true
      },
      {
        id: 3,
        sender: "Prof. Michael Chen",
        content: "The literature review looks great so far. Please continue with the current approach.",
        time: "Yesterday",
        isMe: false
      }
    ],
    3: [
      {
        id: 1,
        sender: "Dr. Marie Dubois",
        content: "I have an agricultural research project that needs data collection support.",
        time: "2 days ago",
        isMe: false
      },
      {
        id: 2,
        sender: "You",
        content: "I have experience with agricultural data collection. What's the scope of your project?",
        time: "2 days ago",
        isMe: true
      },
      {
        id: 3,
        sender: "Dr. Marie Dubois",
        content: "When can you start the data collection? We need to begin next week.",
        time: "3 hours ago",
        isMe: false
      }
    ]
  });

  const currentMessages = allMessages[selectedConversation as keyof typeof allMessages] || [];
  const selectedConv = conversations.find(conv => conv.id === selectedConversation);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      const newMsg = {
        id: currentMessages.length + 1,
        sender: "You",
        content: newMessage,
        time: currentTime,
        isMe: true
      };
      
      // Update messages for current conversation
      setAllMessages(prev => ({
        ...prev,
        [selectedConversation]: [...(prev[selectedConversation as keyof typeof prev] || []), newMsg]
      }));
      
      // Update conversation last message
      setConversations(prev => prev.map(conv => 
        conv.id === selectedConversation 
          ? { ...conv, lastMessage: newMessage, time: "now" }
          : conv
      ));
      
      setNewMessage("");
      
      toast({
        title: "Message sent",
        description: "Your message has been delivered"
      });
    }
  };

  const handleFileAttach = () => {
    toast({
      title: "File attachment",
      description: "File attachment feature will be implemented"
    });
  };

  const handleConversationSelect = (conversationId: number) => {
    setSelectedConversation(conversationId);
    // Mark as read
    setConversations(prev => prev.map(conv => 
      conv.id === conversationId 
        ? { ...conv, unread: 0 }
        : conv
    ));
  };

  return (
    <div className="h-[600px] flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 border-b">
          <h3 className="font-semibold mb-3">Messages</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                selectedConversation === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
              }`}
              onClick={() => handleConversationSelect(conversation.id)}
            >
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={conversation.avatar} alt={conversation.name} />
                  <AvatarFallback>{conversation.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium text-gray-900 truncate">{conversation.name}</p>
                    <p className="text-xs text-gray-500">{conversation.time}</p>
                  </div>
                  <p className="text-xs text-blue-600 mb-1">{conversation.project}</p>
                  <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>
                {conversation.unread > 0 && (
                  <Badge className="bg-red-600 text-white text-xs">
                    {conversation.unread}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConv?.avatar} alt={selectedConv?.name} />
              <AvatarFallback>{selectedConv?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{selectedConv?.name}</h4>
              <p className="text-sm text-gray-600">{selectedConv?.project}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isMe
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className={`text-xs mt-1 ${message.isMe ? "text-blue-100" : "text-gray-500"}`}>
                  {message.time}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" onClick={handleFileAttach}>
              <Paperclip className="h-4 w-4" />
            </Button>
            <Input
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAidsMessages;
