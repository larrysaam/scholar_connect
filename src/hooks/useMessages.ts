import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConsultationServices } from './useConsultationServices';

export interface Conversation {
  id: string; // booking_id
  student_id: string;
  student_name: string;
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
  const { bookings } = useConsultationServices(); // For researchers: their bookings
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Fetch conversations: all students who booked with this researcher
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    // Group bookings by student
    const map = new Map<string, Conversation>();
    for (const booking of bookings) {
      if (!map.has(booking.client_id)) {
        map.set(booking.client_id, {
          id: booking.id, // booking_id
          student_id: booking.client_id,
          student_name: booking.client?.name || 'Student',
          last_message: '',
          last_message_at: '',
        });
      }
    }
    // Optionally fetch last message for each conversation
    const convs = Array.from(map.values());
    for (const conv of convs) {
      const { data } = await supabase
        .from('messages')
        .select('content,created_at')
        .eq('booking_id', conv.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
      if (data) {
        conv.last_message = data.content;
        conv.last_message_at = data.created_at;
      }
    }
    setConversations(convs);
  }, [user, bookings]);

  // Fetch messages for a conversation (by booking_id)
  const fetchMessages = useCallback(async (bookingId: string) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });
    if (!error) setMessages(data || []);
  }, [user]);

  // Send message (scoped to booking_id)
  const sendMessage = async (bookingId: string, content: string) => {
    if (!user || !selectedConversation) return;
    const recipient_id = selectedConversation.student_id;
    await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id,
      booking_id: bookingId,
      content,
    });
    await fetchMessages(bookingId);
  };

  return {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectedConversation,
    setSelectedConversation,
  };
};
