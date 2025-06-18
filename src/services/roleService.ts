
import { supabase } from '@/integrations/supabase/client';

export type AppRole = 'admin' | 'student' | 'expert' | 'aid';

export const roleService = {
  async hasRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .rpc('has_role', {
          _user_id: userId,
          _role: role
        });

      if (error) {
        console.error('Error checking role:', error);
        return false;
      }

      return data || false;
    } catch (error) {
      console.error('Error in hasRole:', error);
      return false;
    }
  },

  async getUserRoles(userId: string): Promise<AppRole[]> {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user roles:', error);
        return [];
      }

      return data?.map(r => r.role as AppRole) || [];
    } catch (error) {
      console.error('Error in getUserRoles:', error);
      return [];
    }
  },

  async assignRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: userId,
          role
        });

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

  async removeRole(userId: string, role: AppRole): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', role);

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
