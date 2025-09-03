
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

export const useChat = (bookingId: string) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!bookingId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('booking_id', bookingId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [bookingId]);

  useEffect(() => {
    fetchMessages();

    if (bookingId && !channel) {
      const newChannel = supabase
        .channel(`messages:${bookingId}`)
        .on<Message>(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'messages', filter: `booking_id=eq.${bookingId}` },
          (payload) => {
            setMessages((prevMessages) => [...prevMessages, payload.new as Message]);
          }
        )
        .subscribe();
      setChannel(newChannel);
    }

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [bookingId, fetchMessages, channel]);

  const sendMessage = async (receiverId: string, content: string) => {
    if (!user || !bookingId) return;

    const newMessage = {
      booking_id: bookingId,
      sender_id: user.id,
      receiver_id: receiverId,
      content: content,
    };

    const { error } = await supabase.from('messages').insert(newMessage);
    if (error) {
      console.error('Error sending message:', error);
    }
  };

  return { messages, loading, sendMessage };
};
