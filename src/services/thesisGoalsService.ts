import { supabase } from '@/integrations/supabase/client';

export interface ThesisGoal {
  id: string;
  booking_id: string;
  description: string;
  status: 'pending' | 'completed' | 'in_progress';
  created_at: string;
  updated_at: string;
}

export const ThesisGoalsService = {
  async getGoalsByBookingId(bookingId: string, userId: string, isStudent: boolean): Promise<ThesisGoal[] | null> {
    console.log('getGoalsByBookingId called with:', { bookingId, userId, isStudent });
    // First, verify the booking belongs to the user (either as client or provider)
    const { data: booking, error: bookingError } = await supabase
      .from('service_bookings')
      .select('client_id, provider_id')
      .eq('id', bookingId)
      .single();

    if (bookingError || !booking) {
      console.error('Error fetching booking for goals:', bookingError?.message || 'Booking not found', { bookingId, userId });
      return null;
    }
    console.log('Fetched booking:', booking);

    let query = supabase
      .from('thesis_goals')
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

    const { data, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching thesis goals:', error.message);
      return null;
    }
    return data as ThesisGoal[];
  },

  async addGoal(bookingId: string, description: string): Promise<ThesisGoal | null> {
    const { data, error } = await supabase
      .from('thesis_goals')
      .insert({ booking_id: bookingId, description, status: 'pending' })
      .select('*')
      .single();

    if (error) {
      console.error('Error adding thesis goal:', error.message);
      return null;
    }
    return data as ThesisGoal;
  },

  async updateGoalStatus(goalId: string, status: 'pending' | 'completed' | 'in_progress'): Promise<ThesisGoal | null> {
    const { data, error } = await supabase
      .from('thesis_goals')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', goalId)
      .select('*')
      .single();

    if (error) {
      console.error('Error updating thesis goal status:', error.message);
      return null;
    }
    return data as ThesisGoal;
  },

  async deleteGoal(goalId: string): Promise<boolean> {
    const { error } = await supabase
      .from('thesis_goals')
      .delete()
      .eq('id', goalId);

    if (error) {
      console.error('Error deleting thesis goal:', error.message);
      return false;
    }
    return true;
  },
};