import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConsultationServices } from './useConsultationServices';
import { useBookingSystem } from './useBookingSystem';

export interface Conversation {
  id: string; // booking_id
  other_user_id: string;
  other_user_name: string;
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
  const { bookings: researcherBookings } = useConsultationServices();
  const { bookings: studentBookings } = useBookingSystem();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Determine user type by presence of bookings
  const isResearcher = (researcherBookings && researcherBookings.length > 0) || false;
  const isStudent = (studentBookings && studentBookings.length > 0) || false;

  // Fetch conversations for researcher or student
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    let convs: Conversation[] = [];
    if (isResearcher) {
      // Researcher: show all students who booked with them
      const map = new Map<string, Conversation>();
      for (const booking of researcherBookings) {
        if (!map.has(booking.client_id)) {
          map.set(booking.client_id, {
            id: booking.id, // booking_id
            other_user_id: booking.client_id,
            other_user_name: booking.client?.name || 'Student',
            last_message: '',
            last_message_at: '',
          });
        }
      }
      convs = Array.from(map.values());
    } else if (isStudent) {
      // Student: show all researchers they've booked
      const map = new Map<string, Conversation>();
      for (const booking of studentBookings) {
        if (!map.has(booking.provider_id)) {
          map.set(booking.provider_id, {
            id: booking.id, // booking_id
            other_user_id: booking.provider_id,
            other_user_name: booking.provider?.name || 'Researcher',
            last_message: '',
            last_message_at: '',
          });
        }
      }
      convs = Array.from(map.values());
    }
    // Fetch last message for each conversation
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
  }, [user, isResearcher, isStudent, researcherBookings, studentBookings]);

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
    const recipient_id = selectedConversation.other_user_id;
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
