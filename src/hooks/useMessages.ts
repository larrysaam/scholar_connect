import { useState, useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useConsultationServices } from './useConsultationServices';
import { useBookingSystem } from './useBookingSystem';
import { io, Socket } from 'socket.io-client';

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
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Determine user type by presence of bookings
  const isResearcher = (researcherBookings && researcherBookings.length > 0) || false;
  const isStudent = (studentBookings && studentBookings.length > 0) || false;

  // Connect to socket.io server
  useEffect(() => {
    if (!user) return;
    // Use env variable for socket server URL
    const socketUrl = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:4000';
    const socket = io(socketUrl, {
      query: { userId: user.id },
      transports: ['websocket'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setSocketConnected(true);
      socket.emit('join', { userId: user.id });
    });
    socket.on('disconnect', () => setSocketConnected(false));

    socket.on('new_message', (msg: Message) => {
      setMessages(prev => {
        // Deduplicate by id
        if (selectedConversation && msg.booking_id === selectedConversation.id && !prev.some(m => m.id === msg.id)) {
          return [...prev, msg];
        }
        return prev;
      });
      setConversations(prev => prev.map(conv =>
        conv.id === msg.booking_id
          ? { ...conv, last_message: msg.content, last_message_at: msg.created_at }
          : conv
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, selectedConversation]);

  // Fetch conversations for researcher or student
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
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
    // Fetch last message for each conversation (parallelize for perf)
    await Promise.all(convs.map(async conv => {
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
    }));
    setConversations(convs);
    setLoadingConversations(false);
  }, [user, isResearcher, isStudent, researcherBookings, studentBookings]);

  // Fetch messages for a conversation (by booking_id)
  const fetchMessages = useCallback(async (bookingId: string) => {
    if (!user) return;
    setLoadingMessages(true);
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });
    if (!error && data) {
      // Deduplicate by id
      setMessages(Array.from(new Map(data.map(m => [m.id, m])).values()));
    }
    setLoadingMessages(false);
  }, [user]);

  // Send message (scoped to booking_id)
  const sendMessage = async (bookingId: string, content: string) => {
    if (!user || !selectedConversation) return;
    const recipient_id = selectedConversation.other_user_id;
    // Optimistic UI update
    const optimisticMsg: Message = {
      id: `optimistic-${Date.now()}`,
      sender_id: user.id,
      recipient_id,
      booking_id: bookingId,
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimisticMsg]);
    setConversations(prev => prev.map(conv =>
      conv.id === bookingId
        ? { ...conv, last_message: content, last_message_at: optimisticMsg.created_at }
        : conv
    ));
    // Save to DB
    const { data, error } = await supabase.from('messages').insert({
      sender_id: user.id,
      recipient_id,
      booking_id: bookingId,
      content,
    }).select('*').single();
    if (!error && data && socketRef.current) {
      socketRef.current.emit('send_message', data);
      // Replace optimistic with real
      setMessages(prev => prev.map(m => m.id === optimisticMsg.id ? data : m));
    } else {
      // Remove optimistic if failed
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    }
    // Optionally, refetch messages for consistency
    // await fetchMessages(bookingId);
  };

  // Auto-fetch conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Auto-fetch messages when conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    } else {
      setMessages([]);
    }
  }, [selectedConversation, fetchMessages]);

  return {
    conversations,
    messages,
    fetchConversations,
    fetchMessages,
    sendMessage,
    selectedConversation,
    setSelectedConversation,
    loadingConversations,
    loadingMessages,
    socketConnected,
  };
};
