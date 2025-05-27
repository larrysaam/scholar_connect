
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

  const [messages, setMessages] = useState([
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
  ]);

  const { toast } = useToast();

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      // Add new message to messages
      const newMsg = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        time: currentTime,
        isMe: true
      };
      
      setMessages([...messages, newMsg]);
      
      // Update conversation last message
      setConversations(conversations.map(conv => 
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
              onClick={() => setSelectedConversation(conversation.id)}
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
              <AvatarImage src="/placeholder-avatar.jpg" alt="Dr. Sarah Johnson" />
              <AvatarFallback>SJ</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">Dr. Sarah Johnson</h4>
              <p className="text-sm text-gray-600">Statistical Analysis Project</p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
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
