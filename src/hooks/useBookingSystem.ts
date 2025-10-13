import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import { NotificationService } from '@/services/notificationService';

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
  payment_id?: string;
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
      const { data: bookingArr, error: bookingError } = await supabase
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
          status: bookingData.payment_id && bookingData.payment_id !== '' ? 'confirmed' : 'pending',
          payment_status: bookingData.payment_id && bookingData.payment_id !== '' ? 'paid' : 'pending',
          payment_id: bookingData.payment_id ?? null
        })
        .select(`
          *,
          provider:users!service_bookings_provider_id_fkey(name, email),
          service:consultation_services(title, category)
        `);
      const booking = Array.isArray(bookingArr) ? bookingArr[0] : bookingArr;

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
      if (bookingData.selected_addons && bookingData.selected_addons.length > 0 && booking) {
        // You must provide price (and optionally quantity) for each addon insert
        // We'll fetch addon details to get the price
        const { data: addonDetails } = await supabase
          .from('service_addons')
          .select('id, price')
          .in('id', bookingData.selected_addons);

        const addonInserts = (bookingData.selected_addons || []).map(addonId => {
          const found = addonDetails?.find((a: any) => a.id === addonId);
          return {
            booking_id: booking.id,
            addon_id: addonId,
            price: found?.price || 0
          };
        });

        const { error: addonError } = await supabase
          .from('booking_addons')
          .insert(addonInserts);

        if (addonError) {
          console.error('Error adding booking addons:', addonError);
        }
      }

      // --- Notification: Notify both student and researcher of new booking request ---
      if (booking) {
        // Notify researcher (provider)
        await NotificationService.notifyConsultationRequest(
          booking.provider_id,
          user.user_metadata?.full_name || user.email || 'A student',
          booking.service?.title || 'Consultation'
        );
        // Notify student (client)
        await NotificationService.createNotification({
          userId: booking.client_id,
          title: 'Booking Request Submitted',
          message: `Your booking request for '${booking.service?.title || 'Consultation'}' has been submitted to ${booking.provider?.name || 'the researcher'}.`,
          type: 'info',
          category: 'consultation',
          actionUrl: '/dashboard?tab=upcoming',
          actionLabel: 'View Booking'
        });
      }

      toast({
        title: "Booking Created",
        description: "Your consultation booking has been created successfully!",
      });

      // Fix: Ensure status is cast to BookingSession type
      return { success: true, booking: { ...booking, status: booking.status as BookingSession['status'], payment_status: booking.payment_status as BookingSession['payment_status'] } };
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
  };  // Process payment for booking
  const processPayment = async (paymentData: PaymentData & { service_id?: string; academic_level?: string }): Promise<{ success: boolean; payment_id?: string; error?: string }> => {
    let payment_id: string | undefined;

    try {
      setProcessing(true);

      // Use the secure MeSomb backend endpoint for payment processing
      const response = await fetch('http://localhost:4000/api/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: paymentData.service_id,
          academic_level: paymentData.academic_level,
          amount: paymentData.amount,
          payer: paymentData.payment_details?.phoneNumber || '',
          service: 'MTN', // Default to MTN Mobile Money
          customer: { 
            id: user?.id, 
            phone: paymentData.payment_details?.phoneNumber || '',
            email: user?.email || ''
          },
          location: { town: 'Douala', region: 'Littoral', country: 'CM' },
          products: [
            {
              name: 'Consultation Service',
              category: 'consultation',
              quantity: 1,
              amount: paymentData.amount
            }
          ],
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Payment processing failed:', result);
        return { success: false, error: result.error || 'Payment processing failed' };
      }      // Handle free consultations
      if (result.payment_id === 'Free') {
        payment_id = 'Free';
        // Update booking for free consultation
        const { error: updateError } = await supabase
          .from('service_bookings')
          .update({
            payment_status: 'paid',
            payment_id: 'Free',
            status: 'confirmed',
            updated_at: new Date().toISOString()
          })
          .eq('id', paymentData.booking_id);

        if (updateError) {
          console.error('Error updating free booking status:', updateError);
          return { success: false, error: updateError.message };
        }

        return { success: true, payment_id: 'Free' };
      }

      // Handle paid consultations
      if (result.operationSuccess && result.transactionSuccess) {
        payment_id = result.raw?.reference || `mesomb_${Date.now()}`;
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

        return { success: true, payment_id: result.raw?.reference || `mesomb_${Date.now()}` };
      } else {
        return { success: false, error: 'Payment transaction failed' };
      }

      // --- Generate Google Meet Link by calling the Edge Function ---
      try {
        const { data, error: functionError } = await supabase.functions.invoke('generate-meet-link', {
          body: { booking_id: paymentData.booking_id },
        });

        if (functionError) {
          // Log the error, but don't fail the whole process since the payment was successful
          console.error('Error generating Google Meet link:', functionError);
          toast({
            title: "Meeting Link Failed",
            description: "Could not create a Google Meet link. Please contact support.",
            variant: "destructive"
          });
        } else {
          console.log('Generated Meet Link:', data.meetLink);
        }
      } catch (e) {
          console.error('Error invoking generate-meet-link function:', e);
      }

      // --- Notification: Notify both student and researcher of booking confirmation/payment ---
      // Fetch booking details for notification context
      const { data: bookingDetails } = await supabase
        .from('service_bookings')
        .select(`*, provider:users!service_bookings_provider_id_fkey(name), service:consultation_services(title)`)
        .eq('id', paymentData.booking_id)
        .single();
      if (bookingDetails) {
        // Notify student (client)
        await NotificationService.notifyConsultationConfirmed(
          bookingDetails.client_id,
          bookingDetails.provider?.name || 'the researcher',
          new Date(bookingDetails.scheduled_date)
        );
        // Notify researcher (provider)
        await NotificationService.createNotification({
          userId: bookingDetails.provider_id,
          title: 'New Booking Confirmed',
          message: `A booking for '${bookingDetails.service?.title || 'Consultation'}' has been confirmed and paid by a student.`,
          type: 'success',
          category: 'consultation',
          actionUrl: '/dashboard?tab=bookings',
          actionLabel: 'View Booking'
        });
      }

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

      // Fix: Cast status and payment_status to BookingSession types
      setBookings((data || []).map(b => ({
        ...b,
        status: b.status as BookingSession['status'],
        payment_status: b.payment_status as BookingSession['payment_status']
      })));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };
  // Cancel a booking
  const cancelBooking = async (bookingId: string, reason?: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to cancel a booking.",
        variant: "destructive"
      });
      return false;
    }

    
    try {
      console.log('Cancelling booking edge function:', bookingId);
      // Call the edge function to handle cancellation with wallet refund
      const { data, error } = await supabase.functions.invoke('cancel-booking', {
        body: { booking_id: bookingId, reason }
      });

      if (error) {
        console.error('Error cancelling booking:', error);
        toast({
          title: "Error",
          description: error.message || "Failed to cancel booking. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      if (!data.success) {
        toast({
          title: "Error",
          description: data.error || "Failed to cancel booking. Please try again.",
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setBookings(prev =>
        prev.map(booking =>
          booking.id === bookingId
            ? {
                ...booking,
                status: 'cancelled' as const,
                notes: reason,
                payment_status: data.refund_processed ? 'refunded' : booking.payment_status
              }
            : booking
        )
      );

      toast({
        title: "Booking Cancelled",
        description: data.message || "Your booking has been cancelled successfully.",
      });

      return true;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while cancelling the booking.",
        variant: "destructive"
      });
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

      // --- Notification: Notify both student and researcher of booking reschedule ---
      // Fetch booking details for notification context
      const { data: bookingDetails } = await supabase
        .from('service_bookings')
        .select(`*, provider:users!service_bookings_provider_id_fkey(name), service:consultation_services(title)`)
        .eq('id', bookingId)
        .single();
      if (bookingDetails) {
        // Notify researcher (provider)
        await NotificationService.createNotification({
          userId: bookingDetails.provider_id,
          title: 'Booking Rescheduled',
          message: `A booking for '${bookingDetails.service?.title || 'Consultation'}' was rescheduled by the student.`,
          type: 'info',
          category: 'consultation',
          actionUrl: '/dashboard?tab=bookings',
          actionLabel: 'View Bookings'
        });
        // Notify student (client)
        await NotificationService.createNotification({
          userId: bookingDetails.client_id,
          title: 'Booking Rescheduled',
          message: `You have rescheduled your booking for '${bookingDetails.service?.title || 'Consultation'}'.`,
          type: 'info',
          category: 'consultation',
          actionUrl: '/dashboard?tab=upcoming',
          actionLabel: 'View Bookings'
        });
      }

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
        toast({
          title: "Error",
          description: "Meeting link not available yet. Please try again shortly.",
          variant: "destructive"
        });
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
      // Step 1: Insert the review
      const { error: reviewError } = await supabase
        .from('researcher_reviews')
        .insert({
          booking_id: bookingId,
          researcher_id: researcherId,
          reviewer_id: user?.id,
          rating,
          comment,
          service_type: 'consultation'
        });

      if (reviewError) {
        console.error('Error adding review:', reviewError);
        toast({
          title: "Error",
          description: "Failed to add review. You may have already reviewed this consultation.",
          variant: "destructive"
        });
        return false;
      }

      // Step 2: Update the booking to mark it as reviewed
      const { error: updateError } = await supabase
        .from('service_bookings')
        .update({ has_review: true })
        .eq('id', bookingId);

      if (updateError) {
        console.error('Error updating booking review status:', updateError);
        // The review was still added, so we don't return false, but we should log this
        toast({
          title: "Warning",
          description: "Your review was submitted, but there was an issue updating the booking status.",
          variant: "default"
        });
      }

      // --- Notification: Notify both student and researcher of review submission ---
      // Fetch booking details for notification context
      const { data: bookingDetails } = await supabase
        .from('service_bookings')
        .select(`*, provider:users!service_bookings_provider_id_fkey(name), service:consultation_services(title)`)
        .eq('id', bookingId)
        .single();
      if (bookingDetails) {
        // Notify researcher (provider)
        await NotificationService.createNotification({
          userId: bookingDetails.provider_id,
          title: 'New Review Received',
          message: `You received a new review for '${bookingDetails.service?.title || 'Consultation'}'.`,
          type: 'info',
          category: 'consultation',
          actionUrl: '/dashboard?tab=reviews',
          actionLabel: 'View Reviews'
        });
        // Notify student (client)
        await NotificationService.createNotification({
          userId: bookingDetails.client_id,
          title: 'Review Submitted',
          message: `Your review for '${bookingDetails.service?.title || 'Consultation'}' has been submitted.`,
          type: 'success',
          category: 'consultation',
          actionUrl: '/dashboard?tab=reviews',
          actionLabel: 'View Reviews'
        });
      }

      toast({
        title: "Review Added",
        description: "Thank you for your feedback!",
      });

      // Step 3: Refresh bookings to get the updated has_review status
      fetchUserBookings();

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