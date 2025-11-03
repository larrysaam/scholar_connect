
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';

interface ChatProps {
  bookingId: string;
  receiverId: string;
  receiverName: string;
}

export const Chat = ({ bookingId, receiverId, receiverName }: ChatProps) => {
  const { user } = useAuth();
  const { messages, loading, sendMessage } = useChat(bookingId);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    await sendMessage(receiverId, newMessage);
    setNewMessage('');
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Message</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] h-[600px] p-0 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-blue-600 text-white">
          <DialogTitle className="text-white flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-sm font-medium">
              {receiverName.split(' ').map(n => n[0]).join('')}
            </div>
            <span>Chat with {receiverName}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-full">
          <ScrollArea 
            className="flex-1 p-4 bg-gray-50"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23f0f0f0' fill-opacity='0.3'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`,
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="text-gray-500">Loading messages...</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <div className="text-4xl mb-2">💬</div>
                <p className="text-center">No messages yet</p>
                <p className="text-sm text-center">Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, index) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                    } mb-2`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-2xl shadow-sm ${
                        msg.sender_id === user?.id
                          ? 'bg-blue-500 text-white rounded-br-md'
                          : 'bg-white text-gray-800 rounded-bl-md border'
                      }`}>
                      <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                      <div className={`flex justify-end items-center mt-1`}>
                        <p className={`text-xs ${
                          msg.sender_id === user?.id ? "text-blue-100" : "text-gray-500"
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        {msg.sender_id === user?.id && (
                          <div className="flex space-x-0.5 ml-1">
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
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="p-3 border-t bg-white">
            <div className="flex items-center space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 rounded-full border-gray-300 py-2 resize-none"
              />
              <Button 
                type="submit" 
                className={`rounded-full p-2 ${
                  newMessage.trim() 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-400'
                }`}
                disabled={!newMessage.trim()}
                size="sm"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
