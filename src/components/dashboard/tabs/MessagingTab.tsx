import { useEffect, useState, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMessages } from "@/hooks/useMessages";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// MessagingTab: Chat with students who booked your services
const MessagingTab = () => {
  const { user } = useAuth();
  const {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectedConversation,
    setSelectedConversation
  } = useMessages();
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedConversation) fetchMessages(selectedConversation.id);
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConversation) return;
    await sendMessage(selectedConversation.id, message);
    setMessage("");
  };

  return (
    <div className="flex h-[600px] bg-white rounded-lg shadow overflow-hidden">
      {/* Conversation List */}
      <div className="w-1/3 border-r p-4 overflow-y-auto">
        <h3 className="font-semibold mb-4">Conversations</h3>
        {conversations.length === 0 && (
          <div className="text-gray-500 text-sm">No conversations yet.</div>
        )}
        <ul>
          {conversations.map((conv: any) => (
            <li
              key={conv.id}
              className={`p-2 rounded cursor-pointer mb-2 ${selectedConversation?.id === conv.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <div className="font-medium">{conv.student_name}</div>
              <div className="text-xs text-gray-500">{conv.last_message?.slice(0, 32)}</div>
            </li>
          ))}
        </ul>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {selectedConversation ? (
            <>
              <div className="mb-2 text-sm text-gray-600">Chat with <span className="font-semibold">{selectedConversation.student_name}</span></div>
              <div>
                {messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`mb-2 flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`px-3 py-2 rounded-lg max-w-xs ${msg.sender_id === user?.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-900"}`}>
                      {msg.content}
                      <div className="text-xs text-gray-300 mt-1 text-right">{new Date(msg.created_at).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">Select a conversation to start chatting.</div>
          )}
        </div>
        {/* Message Input */}
        {selectedConversation && (
          <form onSubmit={handleSend} className="flex p-4 border-t bg-white">
            <Input
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 mr-2"
              autoComplete="off"
            />
            <Button type="submit" disabled={!message.trim()}>Send</Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default MessagingTab;
