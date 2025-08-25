import { supabase } from '@/integrations/supabase/client';

export interface ThesisMilestone {
  id: string;
  booking_id: string;
  description: string;
  due_date?: string;
  status: 'pending' | 'completed' | 'in_progress';
  created_at: string;
  updated_at: string;
}

export const ThesisMilestonesService = {
  async getMilestonesByBookingId(bookingId: string, userId: string, isStudent: boolean): Promise<ThesisMilestone[] | null> {
    console.log('getMilestonesByBookingId called with:', { bookingId, userId, isStudent });
    // First, verify the booking belongs to the user (either as client or provider)
    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .select('client_id, provider_id')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking for milestones:', bookingError?.message || 'Booking not found', { bookingId, userId });
      return null;
    }
    console.log('Fetched booking:', booking);

    let query = supabase
      .from('thesis_milestones')
      .select('*')
      .eq('booking_id', bookingId);

    if (isStudent) {
      // If the user is a student, ensure they are the client of this booking
      if (booking.client_id !== userId) {
        console.warn('Student is not the client for this booking.', { bookingId, userId, client_id: booking.client_id });
        return null;
      }
    } else {
      // If the user is a researcher, ensure they are the provider of this booking
      if (booking.provider_id !== userId) {
        console.warn('Researcher is not the provider for this booking.', { bookingId, userId, provider_id: booking.provider_id });
        return null;
      }
    }

    const { data, error } = await query.order('due_date', { ascending: true });

    if (error) {
      console.error('Error fetching thesis milestones:', error.message);
      return null;
    }
    return data as ThesisMilestone[];
  },

  async addMilestone(bookingId: string, description: string, dueDate?: string): Promise<ThesisMilestone | null> {
    const { data, error } = await supabase
      .from('thesis_milestones')
      .insert({ booking_id: bookingId, description, due_date: dueDate || null, status: 'pending' })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding thesis milestone:', error.message);
      return null;
    }
    return data as ThesisMilestone;
  },

  async updateMilestoneStatus(milestoneId: string, status: 'pending' | 'completed' | 'in_progress'): Promise<ThesisMilestone | null> {
    const { data, error } = await supabase
      .from('thesis_milestones')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', milestoneId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating thesis milestone status:', error.message);
      return null;
    }
    return data as ThesisMilestone;
  },

  async deleteMilestone(milestoneId: string): Promise<boolean> {
    const { error } = await supabase
      .from('thesis_milestones')
      .delete()
      .eq('id', milestoneId);

    if (error) {
      console.error('Error deleting thesis milestone:', error.message);
      return false;
    }
    return true;
  },
};