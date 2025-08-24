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
  async getGoalsByBookingId(bookingId: string): Promise<ThesisGoal[] | null> {
    const { data, error } = await supabase
      .from('thesis_goals')
      .select('*')
      .eq('booking_id', bookingId)
      .order('created_at', { ascending: true });

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