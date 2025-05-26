
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Upload, Send, Paperclip, Clock } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderType: "student" | "researcher";
  content: string;
  timestamp: string;
  hasAttachment: boolean;
  attachmentName?: string;
}

interface Conversation {
  id: string;
  researcher: {
    name: string;
    title: string;
    imageUrl: string;
  };
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  sessionRelated: boolean;
  sessionDate?: string;
}

const StudentMessagesTab = () => {
  const [activeConversation, setActiveConversation] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");

  const [conversations] = useState<Conversation[]>([
    {
      id: "1",
      researcher: {
        name: "Dr. Marie Ngono Abega",
        title: "GIS Research Fellow",
        imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png"
      },
      lastMessage: "I've reviewed your research proposal draft. Here are my suggestions...",
      timestamp: "2 hours ago",
      unreadCount: 2,
      sessionRelated: true,
      sessionDate: "Tomorrow, 2:00 PM"
    },
    {
      id: "2",
      researcher: {
        name: "Prof. James Akinyemi",
        title: "Public Health Professor",
        imageUrl: "/lovable-uploads/35d6300d-047f-404d-913c-ec65831f7973.png"
      },
      lastMessage: "Thank you for the session today. Please find the additional resources attached.",
      timestamp: "1 day ago",
      unreadCount: 0,
      sessionRelated: true,
      sessionDate: "Completed: Yesterday"
    }
  ]);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      senderId: "researcher_1",
      senderName: "Dr. Marie Ngono Abega",
      senderType: "researcher",
      content: "Hello John! I'm looking forward to our session tomorrow. I've reviewed the research outline you shared.",
      timestamp: "1 day ago",
      hasAttachment: false
    },
    {
      id: "2",
      senderId: "student_1",
      senderName: "John",
      senderType: "student",
      content: "Thank you Dr. Ngono! I have a few specific questions about the methodology section. Should I prepare them beforehand?",
      timestamp: "1 day ago",
      hasAttachment: false
    },
    {
      id: "3",
      senderId: "researcher_1",
      senderName: "Dr. Marie Ngono Abega",
      senderType: "researcher",
      content: "Absolutely! Please prepare your questions. I've also attached a methodology checklist that might help you structure your thoughts.",
      timestamp: "3 hours ago",
      hasAttachment: true,
      attachmentName: "methodology_checklist.pdf"
    },
    {
      id: "4",
      senderId: "researcher_1",
      senderName: "Dr. Marie Ngono Abega",
      senderType: "researcher",
      content: "I've reviewed your research proposal draft. Here are my suggestions for improvement...",
      timestamp: "2 hours ago",
      hasAttachment: false
    }
  ]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Implementation for sending message
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleFileUpload = () => {
    // Implementation for file upload
    console.log("File upload clicked");
  };

  const activeConv = conversations.find(conv => conv.id === activeConversation);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Messages & File Exchange</h2>
        <p className="text-gray-600">Communicate with your booked researchers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <span>Conversations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                    activeConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={conversation.researcher.imageUrl}
                      alt={conversation.researcher.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">
                          {conversation.researcher.name}
                        </h4>
                        {conversation.unreadCount > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600">{conversation.researcher.title}</p>
                      {conversation.sessionRelated && (
                        <p className="text-xs text-blue-600 mt-1">
                          📅 {conversation.sessionDate}
                        </p>
                      )}
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.lastMessage}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {activeConv ? (
            <div className="flex flex-col h-full">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  <img
                    src={activeConv.researcher.imageUrl}
                    alt={activeConv.researcher.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{activeConv.researcher.name}</h3>
                    <p className="text-sm text-gray-600">{activeConv.researcher.title}</p>
                    {activeConv.sessionRelated && (
                      <p className="text-xs text-blue-600">Session: {activeConv.sessionDate}</p>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderType === 'student' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderType === 'student'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        {message.hasAttachment && (
                          <div className="mt-2 p-2 bg-white bg-opacity-20 rounded flex items-center space-x-2">
                            <Paperclip className="h-4 w-4" />
                            <span className="text-xs">{message.attachmentName}</span>
                          </div>
                        )}
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">{message.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end space-x-2">
                    <Button variant="outline" size="sm" onClick={handleFileUpload}>
                      <Upload className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={2}
                        className="resize-none"
                      />
                    </div>
                    <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share drafts, research outlines, and documents securely
                  </p>
                </div>
              </CardContent>
            </div>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>

      {/* Response Time Notice */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3 text-blue-600">
            <Clock className="h-5 w-5" />
            <div>
              <p className="font-medium">Response Time Guidelines</p>
              <p className="text-sm text-gray-600">
                Researchers typically respond within 24 hours. Messages are consultation-related only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentMessagesTab;
