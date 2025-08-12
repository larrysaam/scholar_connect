import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';

export interface BookingData {
  provider_id: string;
  service_id: string;
  academic_level: 'Undergraduate' | 'Masters' | 'PhD' | 'Postdoc';
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  base_price: number;
  addon_price: number;
  total_price: number;
  currency: string;
  client_notes?: string;
  selected_addons?: string[];
  challenges?: string[];
}

export interface BookingSession {
  id: string;
  provider_id: string;
  client_id: string;
  service_id: string;
  academic_level: string;
  scheduled_date: string;
  scheduled_time: string;
  duration_minutes: number;
  base_price: number;
  addon_price: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_id?: string;
  meeting_link?: string;
  notes?: string;
  client_notes?: string;
  provider_notes?: string;
  created_at: string;
  updated_at: string;
  // Related data
  provider?: any;
  service?: any;
  addons?: any[];
}

export interface PaymentData {
  amount: number;
  currency: string;
  booking_id: string;
  payment_method: 'card' | 'mobile_money' | 'bank_transfer';
  payment_details?: any;
}

export const useBookingSystem = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<BookingSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [processing, setProcessing] = useState(false);

  // Create a new booking
  const createBooking = async (bookingData: BookingData): Promise<{ success: boolean; booking?: BookingSession; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    try {
      setCreating(true);

      // Create the booking
      const { data: booking, error: bookingError } = await supabase
        .from('service_bookings')
        .insert({
          provider_id: bookingData.provider_id,
          client_id: user.id,
          service_id: bookingData.service_id,
          academic_level: bookingData.academic_level,
          scheduled_date: bookingData.scheduled_date,
          scheduled_time: bookingData.scheduled_time,
          duration_minutes: bookingData.duration_minutes,
          base_price: bookingData.base_price,
          addon_price: bookingData.addon_price,
          total_price: bookingData.total_price,
          currency: bookingData.currency,
          client_notes: bookingData.client_notes,
          status: 'pending',
          payment_status: 'pending'
        })
        .select(`
          *,
          provider:users!service_bookings_provider_id_fkey(name, email),
          service:consultation_services(title, category)
        `)
        .single();

      if (bookingError) {
        console.error('Error creating booking:', bookingError);
        toast({
          title: "Booking Failed",
          description: "Failed to create booking. Please try again.",
          variant: "destructive"
        });
        return { success: false, error: bookingError.message };
      }

      // Add selected addons if any
      if (bookingData.selected_addons && bookingData.selected_addons.length > 0) {
        const addonInserts = bookingData.selected_addons.map(addonId => ({
          booking_id: booking.id,
          addon_id: addonId
        }));

        const { error: addonError } = await supabase
          .from('booking_addons')
          .insert(addonInserts);

        if (addonError) {
          console.error('Error adding booking addons:', addonError);
        }
      }

      toast({
        title: "Booking Created",
        description: "Your consultation booking has been created successfully!",
      });

      return { success: true, booking };
    } catch (error) {
      console.error('Error creating booking:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while creating the booking.",
        variant: "destructive"
      });
      return { success: false, error: 'Unexpected error occurred' };
    } finally {
      setCreating(false);
    }
  };

  // Process payment for booking
  const processPayment = async (paymentData: PaymentData): Promise<{ success: boolean; payment_id?: string; error?: string }> => {
    try {
      setProcessing(true);

      // In a real application, this would integrate with a payment processor
      // For now, we'll simulate payment processing
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a mock payment ID
      const payment_id = `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      // Update booking with payment information
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({
          payment_status: 'paid',
          payment_id: payment_id,
          status: 'confirmed',
          updated_at: new Date().toISOString()
        })
        .eq('id', paymentData.booking_id);

      if (updateError) {
        console.error('Error updating booking payment status:', updateError);
        return { success: false, error: updateError.message };
      }

      // Create payment record (you might want to create a payments table)
      // For now, we'll just log it
      console.log('Payment processed:', {
        payment_id,
        booking_id: paymentData.booking_id,
        amount: paymentData.amount,
        currency: paymentData.currency,
        method: paymentData.payment_method,
        status: 'completed',
        processed_at: new Date().toISOString()
      });

      toast({
        title: "Payment Successful",
        description: "Your payment has been processed and booking confirmed!",
      });

      return { success: true, payment_id };
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Failed",
        description: "Payment processing failed. Please try again.",
        variant: "destructive"
      });
      return { success: false, error: 'Payment processing failed' };
    } finally {
      setProcessing(false);
    }
  };

  // Get user's bookings
  const fetchUserBookings = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase
        .from('service_bookings')
        .select(`
          *,
          provider:users!service_bookings_provider_id_fkey(name, email, institution),
          service:consultation_services(title, category, description),
          addons:booking_addons(
            addon:service_addons(name, description, price, currency)
          )
        `)
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching bookings:', error);
        toast({
          title: "Error",
          description: "Failed to load your bookings.",
          variant: "destructive"
        });
        return;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cancel a booking
  const cancelBooking = async (bookingId: string, reason?: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({
          status: 'cancelled',
          notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('client_id', user?.id);

      if (error) {
        console.error('Error cancelling booking:', error);
        toast({
          title: "Error",
          description: "Failed to cancel booking. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'cancelled' as const, notes: reason }
            : booking
        )
      );

      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
  };

  // Reschedule a booking
  const rescheduleBooking = async (
    bookingId: string, 
    newDate: string, 
    newTime: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('service_bookings')
        .update({
          scheduled_date: newDate,
          scheduled_time: newTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId)
        .eq('client_id', user?.id);

      if (error) {
        console.error('Error rescheduling booking:', error);
        toast({
          title: "Error",
          description: "Failed to reschedule booking. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, scheduled_date: newDate, scheduled_time: newTime }
            : booking
        )
      );

      toast({
        title: "Booking Rescheduled",
        description: "Your booking has been rescheduled successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error rescheduling booking:', error);
      return false;
    }
  };

  // Join meeting (for confirmed bookings)
  const joinMeeting = async (bookingId: string): Promise<string | null> => {
    try {
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) return null;

      if (booking.meeting_link) {
        // Open meeting link
        window.open(booking.meeting_link, '_blank');
        return booking.meeting_link;
      } else {
        // Generate meeting link if not exists (in real app, this would be done by the researcher)
        const meetingLink = `https://meet.google.com/${Math.random().toString(36).substr(2, 10)}`;
        
        const { error } = await supabase
          .from('service_bookings')
          .update({ meeting_link: meetingLink })
          .eq('id', bookingId);

        if (!error) {
          window.open(meetingLink, '_blank');
          return meetingLink;
        }
      }
    } catch (error) {
      console.error('Error joining meeting:', error);
      toast({
        title: "Error",
        description: "Failed to join meeting. Please contact the researcher.",
        variant: "destructive"
      });
    }
    return null;
  };

  // Add review after completed booking
  const addBookingReview = async (
    bookingId: string, 
    researcherId: string, 
    rating: number, 
    comment: string
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('researcher_reviews')
        .insert({
          researcher_id: researcherId,
          reviewer_id: user?.id,
          rating,
          comment,
          service_type: 'consultation'
        });

      if (error) {
        console.error('Error adding review:', error);
        toast({
          title: "Error",
          description: "Failed to add review. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: "Review Added",
        description: "Thank you for your feedback!",
      });

      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  };

  // Get available time slots for a researcher
  const getAvailableSlots = async (researcherId: string, date: string): Promise<string[]> => {
    try {
      // Get researcher's availability
      const { data: profile } = await supabase
        .from('researcher_profiles')
        .select('available_times')
        .eq('user_id', researcherId)
        .single();

      // Get existing bookings for the date
      const { data: bookings } = await supabase
        .from('service_bookings')
        .select('scheduled_time')
        .eq('provider_id', researcherId)
        .eq('scheduled_date', date)
        .in('status', ['pending', 'confirmed']);

      const bookedTimes = bookings?.map(b => b.scheduled_time) || [];
      
      // Filter available times (this is simplified - in real app, you'd have more complex availability logic)
      const defaultSlots = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
      const availableSlots = defaultSlots.filter(slot => !bookedTimes.includes(slot));

      return availableSlots;
    } catch (error) {
      console.error('Error getting available slots:', error);
      return [];
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserBookings();
    }
  }, [user]);

  return {
    bookings,
    loading,
    creating,
    processing,
    createBooking,
    processPayment,
    cancelBooking,
    rescheduleBooking,
    joinMeeting,
    addBookingReview,
    getAvailableSlots,
    fetchUserBookings
  };
};