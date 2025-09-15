
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Paperclip, Phone, Video } from "lucide-react";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: "text" | "file";
}

interface ChatSystemProps {
  researchAidId: string;
  researchAidName: string;
  researchAidImage?: string;
}

const ChatSystem = ({ researchAidId, researchAidName, researchAidImage }: ChatSystemProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      senderId: researchAidId,
      senderName: researchAidName,
      content: "Hello! I'm ready to help with your research project. What specific assistance do you need?",
      timestamp: new Date(),
      type: "text"
    }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "current-user",
        senderName: "You",
        content: newMessage,
        timestamp: new Date(),
        type: "text"
      };
      setMessages(prev => [...prev, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  return (
    <Card className="h-96 flex flex-col shadow-lg border-0 rounded-lg overflow-hidden">
      <CardHeader className="pb-2 bg-blue-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 border-2 border-blue-300">
              <AvatarImage src={researchAidImage} alt={researchAidName} />
              <AvatarFallback className="bg-blue-500 text-white font-medium">
                {researchAidName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg text-white font-medium">{researchAidName}</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-white hover:bg-blue-700">
              <Video className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 bg-gray-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
      }}>
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderId === "current-user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                  message.senderId === "current-user"
                    ? "bg-blue-500 text-white rounded-br-md"
                    : "bg-white text-gray-800 rounded-bl-md border"
                }`}
              >
                <p className="text-sm leading-relaxed break-words">{message.content}</p>
                <div className={`flex justify-end items-center mt-1 space-x-1`}>
                  <p className={`text-xs ${
                    message.senderId === "current-user" ? "text-blue-100" : "text-gray-500"
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {message.senderId === "current-user" && (
                    <div className="flex space-x-0.5">
                      <svg className="h-3 w-3 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <svg className="h-3 w-3 text-blue-100" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex items-center space-x-2 bg-white p-2 rounded-full border shadow-sm">
          <Button size="sm" variant="ghost" className="p-2 text-gray-600 hover:bg-gray-100 rounded-full">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Input
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1 border-0 focus:ring-0 bg-transparent"
          />
          <Button 
            size="sm" 
            onClick={handleSendMessage}
            className={`rounded-full p-2 ${
              newMessage.trim() 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-400'
            }`}
            disabled={!newMessage.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatSystem;
