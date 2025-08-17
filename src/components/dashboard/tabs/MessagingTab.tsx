import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { format } from 'date-fns';

// MessagingTab: Chat with students who booked your services
const MessagingTab = () => {
  const { user } = useAuth();
  // Use the real messages hook
  const {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectedConversation,
    setSelectedConversation,
    socketConnected,
  } = useMessages();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;
    await sendMessage(selectedConversation.id, message);
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Messages & File Exchange</h2>
        <p className="text-gray-600">Communicate with your booked students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span className="font-semibold">Conversations</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {conversations.map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  className={`p-4 cursor-pointer border-b hover:bg-gray-50 ${selectedConversation?.id === conv.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    {/* Show avatar if available, fallback to placeholder */}
                    <img
                      src={conv.avatar_url || '/placeholder.svg'}
                      alt={conv.other_user_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-sm truncate">{conv.other_user_name}</h4>
                      </div>
                      <p className="text-sm text-gray-600 truncate mt-1">{conv.last_message}</p>
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
            <div className="flex flex-col h-full">
              <CardHeader className="border-b">
                <div className="flex items-center space-x-3">
                  {/* Optionally add avatar here if available: <img src={selectedConversation.avatar_url} ... /> */}
                  <div>
                    <h3 className="font-semibold">{selectedConversation.other_user_name}</h3>
                    <p className="text-xs text-gray-500">You are chatting with {selectedConversation.other_user_name}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 p-0">
                <div className="h-96 overflow-y-auto p-4 space-y-4">
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
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender_id === user?.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`}
                            >
                              <p className="text-sm">{msg.content}</p>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs opacity-75">
                                  {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ));
                  })()}
                  <div ref={messagesEndRef} />
                </div>
                {/* Message Input */}
                <div className="border-t p-4">
                  <div className="flex items-end space-x-2">
                    {/* File upload button can be added here if needed */}
                    <div className="flex-1">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        className="resize-none"
                      />
                    </div>
                    <Button onClick={handleSend} disabled={!message.trim()}>
                      Send
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
                <span className="block text-4xl mb-4">💬</span>
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
            <span className="font-medium">Response Time Guidelines</span>
            <p className="text-sm text-gray-600">
              Students typically respond within 24 hours. Messages are consultation-related only.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MessagingTab;
