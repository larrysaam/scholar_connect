import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Upload, Send, Paperclip, Clock, Check, CheckCheck } from "lucide-react";
import { useMessages } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { format } from 'date-fns';

const StudentMessagesTab = () => {
  const { user } = useAuth();
  const [activeConversation, setActiveConversation] = useState<string | null>(null); // id
  const [newMessage, setNewMessage] = useState("");

  // Use the real messages hook
  const {
    conversations,
    messages,
    sendMessage,
    fetchMessages,
    selectedConversation,
    setSelectedConversation,
    socketConnected,
    setMessages, // <-- add this line
  } = useMessages();

  // Get socket from useMessages' socketRef
  const socket = (window as any).socketRef?.current;

  // Find the active conversation object
  const activeConv = conversations.find(conv => conv.id === activeConversation);

  // When a conversation is selected, set it in the hook as well
  useEffect(() => {
    if (activeConversation) {
      setSelectedConversation(conversations.find(c => c.id === activeConversation) || null);
      fetchMessages(activeConversation);
    }
  }, [activeConversation, conversations, setSelectedConversation, fetchMessages]);

  // --- WhatsApp-style read receipt logic with socket and DB update ---
  useEffect(() => {
    if (activeConv && user) {
      // Find all messages sent to the current user that are not yet read
      const unreadMessages = messages.filter(
        (msg: any) => msg.recipient_id === user.id && msg.status !== 'read'
      );
      if (unreadMessages.length > 0 && socket) {
        // Emit socket event to mark as read (real-time, DB handled by socket server)
        socket.emit('markAsRead', {
          bookingId: activeConv.id,
          userId: user.id,
          messageIds: unreadMessages.map((m: any) => m.id),
        });
      }
    }
  }, [activeConv, user, messages, socket]);

  useEffect(() => {
    if (!socket) return;
    // Listen for real-time read receipts
    const handleMessageRead = (msg: any) => {
      setMessages((prev: any[]) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: msg.status } : m))
      );
    };
    socket.on('message_read', handleMessageRead);
    return () => {
      socket.off('message_read', handleMessageRead);
    };
  }, [socket, setMessages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && selectedConversation) {
      await sendMessage(selectedConversation.id, newMessage);
      setNewMessage("");
    }
  };

  const handleFileUpload = () => {
    // Implementation for file upload (optional)
  };

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-hidden">
      <div className="flex flex-col space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">Messages & File Exchange</h2>
        <p className="text-sm sm:text-base text-gray-600">Communicate with your booked researchers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1 max-h-[500px] lg:max-h-[600px]">
          <CardHeader className="p-3 sm:p-4">
            <CardTitle className="flex items-center space-x-2 text-sm sm:text-base">
              <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span>Conversations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-y-auto">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  onClick={() => setActiveConversation(conversation.id)}
                  className={`p-3 sm:p-4 cursor-pointer border-b hover:bg-gray-50 transition-colors ${
                    activeConversation === conversation.id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <img
                      src={(conversation as any).avatar_url || '/placeholder.svg'}
                      alt={conversation.other_user_name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-semibold text-xs sm:text-sm truncate">
                          {conversation.other_user_name}
                        </h4>
                        {(conversation as any).unread_count > 0 && (
                          <Badge className="bg-blue-500 text-white text-xs px-1.5 py-0.5">
                            {(conversation as any).unread_count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">
                        {conversation.last_message}
                      </p>
                      <span className="text-xs opacity-75">
                        {conversation.last_message_at ? new Date(conversation.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {conversations.length === 0 && (
                <div className="p-4 text-center text-gray-500">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-xs sm:text-sm">No conversations yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 max-h-[500px] lg:max-h-[600px]">
          {activeConv ? (
            <div className="flex flex-col h-full">
              <CardHeader className="border-b p-3 sm:p-4">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <img
                    src={(activeConv as any)?.avatar_url || '/placeholder.svg'}
                    alt={activeConv?.other_user_name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{activeConv?.other_user_name}</h3>
                    <p className="text-xs text-gray-500 truncate">You are chatting with {activeConv?.other_user_name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden">
                {/* Messages */}
                <div className="h-64 sm:h-80 lg:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {(() => {
                    const grouped: { [date: string]: any[] } = {};
                    messages.forEach((msg: any) => {
                      const date = msg.created_at ? new Date(msg.created_at) : null;
                      if (!date) return;
                      const dateKey = date.toDateString();
                      if (!grouped[dateKey]) grouped[dateKey] = [];
                      grouped[dateKey].push(msg);
                    });
                    const today = new Date();
                    const yesterday = new Date();
                    yesterday.setDate(today.getDate() - 1);
                    const getLabel = (dateKey: string) => {
                      const date = new Date(dateKey);
                      if (date.toDateString() === today.toDateString()) return 'Today';
                      if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
                      return format(date, 'MMM d, yyyy');
                    };
                    return Object.keys(grouped).sort((a, b) => new Date(a).getTime() - new Date(b).getTime()).map(dateKey => (
                      <div key={dateKey}>
                        <div className="flex items-center justify-center my-2">
                          <span className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">{getLabel(dateKey)}</span>
                        </div>
                        {grouped[dateKey].map((msg: any, idx: number) => (
                          <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === user?.id ? 'justify-end' : 'justify-start'}${idx !== 0 ? ' mt-1' : ''}`}
                          >
                            <div
                              className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 py-2 rounded-lg ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                            >
                              <p className="text-xs sm:text-sm">{msg.content}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs opacity-75">
                                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                                {msg.sender_id === user?.id && (
                                  <span className="ml-2 text-xs flex items-center">
                                    {getMessageStatusIcon(msg, idx, messages, user.id)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ));
                  })()}
                </div>
                {/* Message Input */}
                <div className="border-t p-3 sm:p-4">
                  <div className="flex items-end space-x-2">
                    <Button variant="outline" size="sm" onClick={handleFileUpload} className="flex-shrink-0">
                      <Upload className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        rows={2}
                        className="resize-none text-xs sm:text-sm"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage} 
                      disabled={!newMessage.trim()}
                      size="sm"
                      className="flex-shrink-0"
                    >
                      <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share drafts, research outlines, and documents securely
                  </p>
                </div>
              </CardContent>
            </div>
          ) : (
            <CardContent className="flex items-center justify-center h-full p-4">
              <div className="text-center text-gray-500">
                <MessageCircle className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-xs sm:text-sm">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      
      {/* Response Time Notice */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 text-blue-600">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <div className="min-w-0">
              <span className="font-medium text-xs sm:text-sm">Response Time Guidelines</span>
              <p className="text-xs sm:text-sm text-gray-600">
                Researchers typically respond within 24 hours. Messages are consultation-related only.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// WhatsApp-style double tick logic for sent messages
const getMessageStatusIcon = (msg: any, idx: number, messages: any[], userId: string) => {
  if (msg.sender_id !== userId) return null;
  // Find all messages sent by the user in this conversation
  const userMessages = messages.filter((m: any) => m.sender_id === userId);
  // Find the last message that is read
  const lastReadIdx = userMessages.map((m: any) => m.status).lastIndexOf('read');
  const isLastRead = userMessages[lastReadIdx]?.id === msg.id;
  if (msg.status === 'read' && isLastRead) {
    return <CheckCheck className="h-4 w-4 text-blue-400" />;
  } else if (msg.status === 'read' || msg.status === 'delivered') {
    return <CheckCheck className="h-4 w-4 text-gray-400" />;
  } else if (msg.status === 'sent') {
    return <Check className="h-4 w-4 text-gray-400" />;
  } else {
    return <Check className="h-4 w-4 text-gray-300" />;
  }
};

export default StudentMessagesTab;
