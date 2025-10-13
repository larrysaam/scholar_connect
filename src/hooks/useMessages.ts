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
  avatar_url?: string; // Add avatar_url
  last_message: string;
  last_message_at: string;
  unreadCount: number;
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
  const isResearchAid = user?.user_metadata?.role === 'research-aid'; // Assuming role is in user_metadata

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
          ? { 
              ...conv, 
              last_message: msg.content, 
              last_message_at: msg.created_at,
              unreadCount: (selectedConversation?.id !== msg.booking_id && msg.recipient_id === user.id) 
                ? (conv.unreadCount || 0) + 1 
                : conv.unreadCount
            }
          : conv
      ));
    });

    return () => {
      socket.disconnect();
    };
  }, [user, selectedConversation]);

  // Listen for real-time read receipts (for both student and researcher)
  useEffect(() => {
    if (!socketRef.current) return;
    const handleMessageRead = (msg: any) => {
      setMessages((prev: any[]) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: msg.status } : m))
      );
    };
    socketRef.current.on('message_read', handleMessageRead);
    return () => {
      socketRef.current?.off('message_read', handleMessageRead);
    };
  }, [setMessages]);

  // --- Push & in-app notifications for new messages, bookings, and events ---
  useEffect(() => {
    if (!socketRef.current) return;
    // Browser push notification helper
    const showBrowserNotification = (title: string, body: string) => {
      if (window.Notification && Notification.permission === 'granted') {
        new Notification(title, { body });
      }
    };
    // Request permission on mount if not already granted
    if (window.Notification && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // In-app notification helper (replace with your toast/alert system if needed)
    const showInAppNotification = (title: string, body: string) => {
      try {
        // Use the toast utility from our UI system
        // Dynamically import to avoid circular deps
        import("@/components/ui/use-toast").then(({ toast }) => {
          toast({ title, description: body });
        });
      } catch {}
    };
    // Listen for new messages (notification only)
    const handleNewMessageNotification = (msg: any) => {
      // Only notify if not sent by self
      if (!user || msg.sender_id === user.id) return;
      const sender = msg.sender_name || 'New Message';
      const content = msg.content || '';
      showBrowserNotification(sender, content);
      showInAppNotification(sender, content);
    };
    // Listen for new bookings (custom event, if implemented)
    const handleNewBooking = (booking: any) => {
      showBrowserNotification('New Booking', 'You have a new booking request.');
      showInAppNotification('New Booking', 'You have a new booking request.');
    };
    // Listen for other events (customize as needed)
    socketRef.current.on('new_message', handleNewMessageNotification);
    socketRef.current.on('new_booking', handleNewBooking);
    // Add more event listeners as needed
    return () => {
      socketRef.current?.off('new_message', handleNewMessageNotification);
      socketRef.current?.off('new_booking', handleNewBooking);
    };
  }, [user]);

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
          // Fetch client's avatar_url
          const { data: clientProfile, error: clientError } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', booking.client_id)
            .single();

          map.set(booking.client_id, {
            id: booking.id, // booking_id
            other_user_id: booking.client_id,
            other_user_name: booking.client?.name || 'Student',
            avatar_url: clientProfile?.avatar_url || undefined, // Add avatar_url
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
          // Fetch provider's avatar_url
          const { data: providerProfile, error: providerError } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', booking.provider_id)
            .single();

          map.set(booking.provider_id, {
            id: booking.id, // booking_id
            other_user_id: booking.provider_id,
            other_user_name: booking.provider?.name || 'Researcher',
            avatar_url: providerProfile?.avatar_url || undefined, // Add avatar_url
            last_message: '',
            last_message_at: '',
          });
        }
      }
      convs = Array.from(map.values());
    } else if (isResearchAid) {
      // Research Aid: show all students whose job applications they've approved
      const { JobApplicationService } = await import('@/services/jobApplicationService');
      const jobApplicationService = new JobApplicationService();
      const aidId = user.id; // Assuming user.id is the aid's ID
      const approvedApplications = await jobApplicationService.getAidJobApplications(aidId);
      
      const map = new Map<string, Conversation>();
      for (const app of approvedApplications.filter(a => a.status === 'approved')) {
        if (!map.has(app.studentId)) {
          // Fetch student's avatar_url
          const { data: studentProfile, error: studentError } = await supabase
            .from('users')
            .select('avatar_url')
            .eq('id', app.studentId)
            .single();

          map.set(app.studentId, {
            id: app.id, // Use application ID as conversation ID
            other_user_id: app.studentId,
            other_user_name: app.studentName,
            avatar_url: studentProfile?.avatar_url || undefined,
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

    // Fetch unread count for each conversation
    await Promise.all(convs.map(async conv => {
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('booking_id', conv.id)
        .eq('recipient_id', user.id)
        .eq('is_read', false);
      conv.unreadCount = count || 0;
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
      
      // Mark all messages as read where current user is the recipient
      const unreadMessageIds = data
        .filter(m => m.recipient_id === user.id && !m.is_read)
        .map(m => m.id);
      
      if (unreadMessageIds.length > 0) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .in('id', unreadMessageIds);
        
        // Update the conversation's unreadCount to 0
        setConversations(prev => prev.map(conv => 
          conv.id === bookingId ? { ...conv, unreadCount: 0 } : conv
        ));
      }
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
    setMessages, // <-- expose setMessages for real-time updates
  };
};
