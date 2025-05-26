
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, Paperclip, Mic, Search } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  isFromMe: boolean;
}

interface Chat {
  id: string;
  studentName: string;
  studentAvatar?: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  projectTitle: string;
}

const mockChats: Chat[] = [
  {
    id: "1",
    studentName: "Kome Divine",
    lastMessage: "When can we schedule a call to discuss the data cleaning approach?",
    timestamp: "2 min ago",
    unreadCount: 2,
    projectTitle: "Urban Mobility Analysis"
  },
  {
    id: "2",
    studentName: "Sama Njoya",
    lastMessage: "Thank you for the quick response. I've uploaded the latest chapter.",
    timestamp: "1 hour ago",
    unreadCount: 0,
    projectTitle: "Climate Change Research"
  },
  {
    id: "3",
    studentName: "Paul Biya Jr.",
    lastMessage: "The GIS maps look great! Just need minor adjustments to the legend.",
    timestamp: "3 hours ago",
    unreadCount: 1,
    projectTitle: "Land Use Mapping"
  }
];

const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "student1",
    senderName: "Kome Divine",
    content: "Hi Dr. Neba, I hope you're doing well. I wanted to discuss the data cleaning approach for my survey data.",
    timestamp: "10:30 AM",
    isFromMe: false
  },
  {
    id: "2",
    senderId: "me",
    senderName: "Dr. Neba",
    content: "Hello Kome! I've reviewed your dataset. I recommend starting with outlier detection and then handling missing values. Would you like to schedule a call to discuss this in detail?",
    timestamp: "10:45 AM",
    isFromMe: true
  },
  {
    id: "3",
    senderId: "student1",
    senderName: "Kome Divine",
    content: "That sounds perfect! When can we schedule a call to discuss the data cleaning approach?",
    timestamp: "11:02 AM",
    isFromMe: false
  }
];

const ResearchAidsMessages = () => {
  const [selectedChat, setSelectedChat] = useState<Chat>(mockChats[0]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const filteredChats = mockChats.filter(chat => 
    chat.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Messages & Live Chat</h2>
        <p className="text-gray-600">Communicate with students and manage project discussions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                {filteredChats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                      selectedChat.id === chat.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={chat.studentAvatar} alt={chat.studentName} />
                        <AvatarFallback>
                          {chat.studentName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium truncate">{chat.studentName}</p>
                          {chat.unreadCount > 0 && (
                            <Badge className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                              {chat.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{chat.projectTitle}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                        <p className="text-xs text-gray-400 mt-1">{chat.timestamp}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat Messages */}
        <div className="lg:col-span-2">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.studentAvatar} alt={selectedChat.studentName} />
                  <AvatarFallback>
                    {selectedChat.studentName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{selectedChat.studentName}</CardTitle>
                  <p className="text-sm text-gray-600">{selectedChat.projectTitle}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-4">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {mockMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromMe ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.isFromMe
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.isFromMe ? "text-blue-100" : "text-gray-500"
                      }`}>
                        {message.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="flex items-center space-x-2 border-t pt-4">
                <Button size="sm" variant="outline">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Mic className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Features Info */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium">Real-time Chat</h4>
              <p className="text-sm text-gray-600">Instant messaging with students</p>
            </div>
            <div className="text-center">
              <Paperclip className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-medium">File Sharing</h4>
              <p className="text-sm text-gray-600">Share documents and attachments</p>
            </div>
            <div className="text-center">
              <Mic className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h4 className="font-medium">Voice Notes</h4>
              <p className="text-sm text-gray-600">Send voice messages for complex explanations</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResearchAidsMessages;
