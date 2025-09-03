
import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chat with {receiverName}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col h-[500px]">
          <ScrollArea className="flex-grow p-4">
            {loading ? (
              <p>Loading messages...</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
                  }`}>
                  <div
                    className={`p-2 rounded-lg max-w-xs ${
                      msg.sender_id === user?.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200'
                    }`}>
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
          <form onSubmit={handleSendMessage} className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <Button type="submit">Send</Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
