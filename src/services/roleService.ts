import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'student' | 'expert' | 'aid';

export const roleService = {
  async hasRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error checking role:', error);
        return false;
      }

      return data?.role === role;
    } catch (error) {
      console.error('Error in hasRole:', error);
      return false;
    }
  },

  async getUserRoles(userId: string): Promise<AppRole[]> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data?.role ? [data.role as AppRole] : [];
    } catch (error) {
      console.error('Error in getUserRoles:', error);
      return [];
    }
  },

  async assignRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role })
        .eq('id', userId);

      if (error) {
        console.error('Error assigning role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in assignRole:', error);
      return false;
    }
  },

  async removeRole(userId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: null })
        .eq('id', userId);

      if (error) {
        console.error('Error removing role:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in removeRole:', error);
      return false;
    }
  }
};