import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';
import { Check, CheckCheck } from "lucide-react";

// MessagingTab: Chat with students who booked your services
const MessagingTab = () => {
  const { user } = useAuth();  // Use the real messages hook
  const {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectedConversation,
    setSelectedConversation,
    socketConnected,
    socket,
  } = useMessages();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConv = selectedConversation;

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation.id);
  }, [selectedConversation]);

  useEffect(() => {
    // Always scroll to the bottom of the messages area on render and when messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  useEffect(() => {
    if (activeConv && user) {
      // Instead of API, emit a socket event to mark messages as read
      if (socketConnected && socket) {
        socket.emit('markAsRead', {
          bookingId: activeConv.id,
          userId: user.id,
        });
      }
    }
  }, [activeConv, user, socketConnected, socket]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;
    await sendMessage(selectedConversation.id, message);
    setMessage("");
  };

  const getMessageStatusIcon = (msg: any, idx: number, messages: any[], userId: string) => {
    // Only for messages sent by the current user
    if (msg.sender_id !== userId) return null;
    // Find the last message sent by the user that is marked as 'read'
    const userMessages = messages.filter((m: any) => m.sender_id === userId);
    const lastReadIdx = userMessages.map((m: any) => m.status).lastIndexOf('read');
    const isLastRead = userMessages[lastReadIdx]?.id === msg.id;
    if (msg.status === 'read' && isLastRead) {
      return <CheckCheck className="h-4 w-4 text-blue-400" />;
    } else if (msg.status === 'read' || msg.status === 'delivered') {
      return <CheckCheck className="h-4 w-4 text-gray-400" />;    } else if (msg.status === 'sent') {
      return <Check className="h-4 w-4 text-gray-400" />;
    } else {
      return <Check className="h-4 w-4 text-gray-300" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 p-1 sm:p-0">
      {/* Modern Header */}
      <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Messages & File Exchange
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Communicate securely with your booked students
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>{socketConnected ? 'Connected' : 'Connecting...'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[550px] sm:h-[650px]">        {/* Conversations List */}
        <Card className="lg:col-span-1 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50/50 hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                  <span className="text-lg">💬</span>
                </div>
                <span className="font-semibold text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Conversations
                </span>
              </div>
              <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                {conversations.length}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-3 sm:p-4 cursor-pointer border-b hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    {/* Show avatar if available, fallback to placeholder */}
                    <img
                      src={conv.avatar_url || '/placeholder.svg'}
                      alt={conv.other_user_name}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-xs sm:text-sm truncate">{conv.other_user_name}</h4>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 truncate mt-1">{conv.last_message}</p>
                        <span className="text-xs opacity-75">
                            {conv.last_message_at ? new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <div className="flex flex-col h-full">              <CardHeader className="border-b p-3 sm:p-6">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  {/* Optionally add avatar here if available: <img src={selectedConversation.avatar_url} ... /> */}
                  <img
                    src={(selectedConversation as any)?.avatar_url || '/placeholder.svg'}
                    alt={selectedConversation.other_user_name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{selectedConversation.other_user_name}</h3>
                    <p className="text-xs text-gray-500 truncate">You are chatting with {selectedConversation.other_user_name}</p>
                  </div>
                </div>
              </CardHeader>              <CardContent className="flex-1 p-0">
                <div className="h-64 sm:h-96 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
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
                          >                            <div
                              className={`max-w-[250px] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                            >
                              <p className="text-xs sm:text-sm break-words">{msg.content}</p>
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
                  <div ref={messagesEndRef} />
                </div>                {/* Message Input */}
                <div className="border-t p-3 sm:p-4">
                  <div className="flex items-end space-x-2">
                    {/* File upload button can be added here if needed */}
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="resize-none text-sm"
                      />
                    </div>
                    <Button onClick={handleSend} disabled={!message.trim()} className="text-xs sm:text-sm">
                      Send
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Share drafts, research outlines, and documents securely
                  </p>
                </div>
              </CardContent>
            </div>          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <span className="block text-3xl sm:text-4xl mb-4">💬</span>
                <p className="text-sm sm:text-base">Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
      {/* Response Time Notice */}
      <Card>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-3 text-blue-600">
            <span className="font-medium text-sm sm:text-base">Response Time Guidelines</span>
            <p className="text-xs sm:text-sm text-gray-600">
              Students typically respond within 24 hours. Messages are consultation-related only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingTab;
