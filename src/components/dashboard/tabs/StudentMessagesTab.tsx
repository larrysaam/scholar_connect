import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Upload, Send, Paperclip, Clock } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";

const StudentMessagesTab = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string | null>(null); // booking_id
  const [newMessage, setNewMessage] = useState("");

  // Use the real messages hook
  const {
    conversations,
    messages,
    loading,
    sendMessage,
    fetchMessages,
  } = useMessages();

  // Fetch messages when activeConversation (booking_id) changes
  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation);
    }
  }, [activeConversation, fetchMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && activeConversation) {
      // Find the conversation and get recipient_id (the researcher)
      const conv = conversations.find(c => c.booking_id === activeConversation);
      if (!conv) return;
      await sendMessage(conv.id, activeConversation, newMessage); // conv.id is provider_id
      setNewMessage("");
      fetchMessages(activeConversation);
    }
  };

  const handleFileUpload = () => {
    // Implementation for file upload (optional)
  };

  // Find the active conversation object
  const activeConv = conversations.find(conv => conv.booking_id === activeConversation);

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
                  key={conversation.booking_id}
                  onClick={() => setActiveConversation(conversation.booking_id)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${
                    activeConversation === conversation.booking_id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <img
                      src={conversation.avatar_url}
                      alt={conversation.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">
                          {conversation.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{conversation.last_message_at}</p>
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
                    src={activeConv?.avatar_url}
                    alt={activeConv?.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold">{activeConv?.name}</h3>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                {/* Messages */}
                <div className="h-96 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.sender_id === user?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs opacity-75">{message.created_at}</span>
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
