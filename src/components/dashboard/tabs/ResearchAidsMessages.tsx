import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Paperclip, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessages, Conversation, Message } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

const ResearchAidsMessages = () => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    selectedConversation, 
    setSelectedConversation, 
    sendMessage, 
    loadingConversations, 
    loadingMessages, 
    fetchConversations 
  } = useMessages();

  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selectedConversation && conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation, setSelectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      sendMessage(selectedConversation.id, newMessage);
      setNewMessage("");
    } else if (!selectedConversation) {
      toast({
        title: "Error",
        description: "Please select a conversation to send a message.",
        variant: "destructive"
      });
    }
  };

  const handleFileAttach = () => {
    toast({
      title: "File attachment",
      description: "File attachment feature will be implemented"
    });
  };

  const handleConversationSelect = (conversation: Conversation) => {
    setSelectedConversation(conversation);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-[600px] flex border rounded-lg overflow-hidden">
      {/* Conversations List */}
      <div className="w-1/3 border-r bg-white flex flex-col">
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
        
        <div className="overflow-y-auto flex-1">
          {loadingConversations ? (
            <p className="p-4 text-center text-gray-500">Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No conversations found.</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation?.id === conversation.id ? "bg-blue-50 border-l-4 border-l-blue-600" : ""
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="flex items-start space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar_url || "/placeholder-avatar.jpg"} alt={conversation.other_user_name} />
                    <AvatarFallback>{conversation.other_user_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900 truncate">{conversation.other_user_name}</p>
                      <p className="text-xs text-gray-500">{formatDate(conversation.last_message_at)}</p>
                    </div>
                    {/* Project name is not directly available in Conversation, might need to fetch from booking details */}
                    {/* <p className="text-xs text-blue-600 mb-1">{conversation.project}</p> */}
                    <p className="text-sm text-gray-600 truncate">{conversation.last_message}</p>
                  </div>
                  {/* Unread count is not directly available in Conversation, might need to implement */}
                  {/* {conversation.unread > 0 && (
                    <Badge className="bg-red-600 text-white text-xs">
                      {conversation.unread}
                    </Badge>
                  )} */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="p-4 border-b bg-white flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={selectedConversation?.avatar_url || "/placeholder-avatar.jpg"} alt={selectedConversation?.other_user_name} />
              <AvatarFallback>{selectedConversation?.other_user_name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-medium">{selectedConversation?.other_user_name || "Select a conversation"}</h4>
              {/* <p className="text-sm text-gray-600">{selectedConversation?.project}</p> */}
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loadingMessages ? (
            <p className="p-4 text-center text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="p-4 text-center text-gray-500">No messages in this conversation.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === user?.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.sender_id === user?.id ? "text-blue-100" : "text-gray-500"}`}>
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
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
              disabled={!selectedConversation}
            />
            <Button onClick={handleSendMessage} disabled={!selectedConversation || !newMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAidsMessages;