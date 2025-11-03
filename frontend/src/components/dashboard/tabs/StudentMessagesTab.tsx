import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Send, Paperclip, MoreVertical, ArrowLeft, MessageCircle, Clock, Check, CheckCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMessages, Conversation, Message } from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { format } from 'date-fns';

interface StudentMessagesTabData {
  openChat?: boolean;
  recipientId?: string;
  recipientName?: string;
  bookingId?: string;
  consultationTitle?: string;
}

interface StudentMessagesTabProps {
  TabData?: StudentMessagesTabData;
}

const StudentMessagesTab = ({ TabData }: StudentMessagesTabProps) => {
  const { user } = useAuth();
  const { 
    conversations, 
    messages, 
    selectedConversation, 
    setSelectedConversation, 
    sendMessage, 
    loadingConversations, 
    loadingMessages, 
    fetchConversations,
    markMessagesAsRead
  } = useMessages();

  const [newMessage, setNewMessage] = useState("");
  const { toast } = useToast();
  const hasScrolledRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  // Handle navigation from MyBookingsTab
  useEffect(() => {
    console.log("TabData : ", TabData)
    if (TabData?.openChat && TabData?.recipientId) {
      // Always try to open the chat for this recipient, even if a conversation is already selected
      // First try to find existing conversation with this recipient
      const existingConversation = conversations.find(conv => conv.other_user_id === TabData.recipientId);
      console.log("Existing conversation found: ", existingConversation)
      
      if (existingConversation) {
        setSelectedConversation(existingConversation);
      } else if (TabData.recipientId && TabData.recipientName) {
        // Create a new conversation object if it doesn't exist
        const newConversation: Conversation = {
          id: TabData.bookingId || `temp_${TabData.recipientId}_${Date.now()}`, // Use bookingId if available, otherwise generate temp ID
          other_user_id: TabData.recipientId,
          other_user_name: TabData.recipientName,
          last_message: '',
          last_message_at: new Date().toISOString(),
          unreadCount: 0
        };
        setSelectedConversation(newConversation);
      }
    }
  }, [TabData, conversations, setSelectedConversation]);

  useEffect(() => {
    // Only auto-select first conversation on desktop (md and up) if no specific conversation is requested
    const isDesktop = window.matchMedia('(min-width: 768px)').matches;
    if (!selectedConversation && conversations.length > 0 && isDesktop && !TabData?.openChat) {
      setSelectedConversation(conversations[0]);
    }
  }, [conversations, selectedConversation, setSelectedConversation, TabData]);

  useEffect(() => {
    if (hasScrolledRef.current && messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
    hasScrolledRef.current = true;
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation) {
      if (selectedConversation.id.startsWith('temp_')) {
        toast({
          title: "Error",
          description: "Cannot send message to this conversation yet. Please try again later.",
          variant: "destructive"
        });
        return;
      }
      console.log("Sending message:", newMessage, "to conversation:", selectedConversation.id);
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

  const handleConversationSelect = async (conversation: Conversation) => {
    setSelectedConversation(conversation);
    await markMessagesAsRead(conversation.id);
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return format(date, 'HH:mm');
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  };  return (
    <div className="h-[75vh] md:h-[600px] flex border-0 md:border rounded-none md:rounded-lg overflow-hidden bg-gray-50">
      {/* Conversations List */}
      <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 border-r bg-white flex-col transition-all duration-300 ease-in-out`}>
        <div className="p-3 md:p-4 border-b bg-blue-600 md:bg-white">
          <h3 className="font-semibold mb-3 text-white md:text-gray-900 text-lg md:text-base">
            <span className="md:hidden">Select a Chat</span>
            <div className="hidden md:flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span>Messages</span>
            </div>
          </h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 bg-white md:bg-gray-50"
            />
          </div>
        </div>
        
        <div className="overflow-y-auto flex-1 bg-white">
          {loadingConversations ? (
            <p className="p-4 text-center text-gray-500">Loading conversations...</p>
          ) : conversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500 px-4">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-center font-medium">No conversations yet</p>
              <p className="text-sm text-center mt-1">Start chatting with researchers!</p>
            </div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 md:p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation ${
                  selectedConversation?.id === conversation.id ? "bg-gray-100 md:bg-blue-50 md:border-l-4 md:border-l-blue-600" : ""
                }`}
                onClick={() => handleConversationSelect(conversation)}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12 md:h-10 md:w-10 flex-shrink-0">
                    <AvatarImage src={conversation.avatar_url || "/placeholder-avatar.jpg"} alt={conversation.other_user_name} />
                    <AvatarFallback className="bg-blue-500 text-white font-medium">
                      {conversation.other_user_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-base md:text-sm font-medium text-gray-900 truncate">
                        {conversation.other_user_name}
                      </p>
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <p className="text-xs text-gray-500">
                          {formatTime(conversation.last_message_at)}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-600 truncate flex-1 pr-2">
                        {conversation.last_message || "No messages yet"}
                      </p>
                      {/* Mobile tap indicator */}
                      <div className="md:hidden flex-shrink-0">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>      {/* Chat Area */}
      <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white md:bg-gray-50 transition-all duration-300 ease-in-out`}>
        {/* Chat Header */}
        <div className="p-3 md:p-4 border-b bg-blue-600 md:bg-white flex justify-between items-center shadow-sm">
          <div className="flex items-center space-x-3">
            {/* Back button for mobile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden p-1 text-white hover:bg-blue-700 transition-colors"
              onClick={() => setSelectedConversation(null)}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
              <AvatarImage src={selectedConversation?.avatar_url || "/placeholder-avatar.jpg"} alt={selectedConversation?.other_user_name} />
              <AvatarFallback className="bg-gray-400 text-white text-sm md:text-base">
                {selectedConversation?.other_user_name?.split(' ').map(n => n[0]).join('') || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-white md:text-gray-900 text-base md:text-sm truncate">
                {selectedConversation?.other_user_name || "Select a conversation"}
              </h4>
              <p className="text-xs text-blue-100 md:text-gray-500">
                {selectedConversation ? "Online" : ""}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-white md:text-gray-600 hover:bg-blue-700 md:hover:bg-gray-100">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3 bg-gray-50"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {!selectedConversation ? (
            <div className="hidden md:flex flex-col items-center justify-center h-full text-gray-500 px-8">
              <div className="text-6xl mb-4">💬</div>
              <p className="text-lg font-medium text-gray-800">Scholar Consult Connect</p>
              <p className="text-sm text-center max-w-md mt-2">
                Send and receive messages with your researchers. Select a conversation to get started.
              </p>
            </div>
          ) : loadingMessages ? (
            <p className="p-4 text-center text-gray-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <div className="text-4xl mb-4">🎉</div>
              <p className="text-center">No messages in this conversation.</p>
              <p className="text-sm text-center mt-1">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message: Message, index: number) => {
              const showDateDivider = index === 0 || formatDate(message.created_at) !== formatDate(messages[index - 1].created_at);
              return (
                <div key={message.id}>
                  {/* Date Divider */}
                  {showDateDivider && (
                    <div className="flex justify-center my-4">
                      <span className="bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-3 py-1 rounded-full border shadow-sm">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                  )}
                  
                  {/* Message Bubble */}
                  <div className={`flex ${message.sender_id === user?.id ? 'justify-end' : 'justify-start'} mb-1`}>
                    <div className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-2 rounded-2xl shadow-sm ${
                      message.sender_id === user?.id 
                        ? 'bg-blue-500 text-white rounded-br-md' 
                        : 'bg-white text-gray-800 rounded-bl-md border'
                    }`}>
                      <p className="text-sm leading-relaxed break-words">{message.content}</p>
                      <div className={`flex justify-end items-center mt-1 space-x-1`}>
                        <p className={`text-xs ${
                          message.sender_id === user?.id ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {formatTime(message.created_at)}
                        </p>
                        {message.sender_id === user?.id && (
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
                </div>
              );
            })
          )}
        </div>

        {/* Message Input */}
        <div className="p-3 md:p-4 border-t bg-white">
          <div className="flex items-end space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleFileAttach}
              className="flex-shrink-0 p-2 text-gray-600 hover:bg-gray-100 rounded-full"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 rounded-full border-gray-300 pr-12 py-2 md:py-1 resize-none"
                disabled={!selectedConversation}
              />
              {/* Emoji button */}
              <Button 
                variant="ghost" 
                size="sm" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-600 hover:bg-gray-100 rounded-full"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={!selectedConversation || !newMessage.trim()}
              className={`flex-shrink-0 rounded-full p-2 ${
                newMessage.trim() 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-400'
              }`}
              size="sm"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
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
