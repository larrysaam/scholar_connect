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
  async getMilestonesByBookingId(bookingId: string): Promise<ThesisMilestone[] | null> {
    const { data, error } = await supabase
      .from('thesis_milestones')
      .select('*')
      .eq('booking_id', bookingId)
      .order('due_date', { ascending: true });

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