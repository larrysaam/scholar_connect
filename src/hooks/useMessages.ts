
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface Conversation {
  id: string;
  name: string;
  avatar_url: string;
  last_message: string;
  last_message_at: string;
}

export interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  booking_id: string;
  content: string;
  created_at: string;
}

export const useMessages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase.rpc('get_conversations', { p_user_id: user.id });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [user]);

  const fetchMessages = useCallback(async (conversationId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        return;
      }

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, [user]);

  const sendMessage = async (recipientId: string, bookingId: string, content: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: recipientId,
        booking_id: bookingId,
        content,
      });

      if (error) {
        console.error('Error sending message:', error);
        return;
      }

      await fetchMessages(recipientId);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      fetchConversations().finally(() => setLoading(false));
    }
  }, [user, fetchConversations]);

  return {
    loading,
    conversations,
    messages,
    fetchMessages,
    sendMessage,
  };
};
