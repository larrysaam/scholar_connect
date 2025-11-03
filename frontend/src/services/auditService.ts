
import { supabase } from '@/integrations/supabase/client';

interface AuditLogEntry {
  action: string;
  table_name?: string;
  record_id?: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const auditService = {
  async log(entry: AuditLogEntry): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn('Cannot log audit entry: user not authenticated');
        return;
      }

      // Get client info
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          user_id: user.id,
          action: entry.action,
          table_name: entry.table_name,
          record_id: entry.record_id,
          old_values: entry.old_values,
          new_values: entry.new_values,
          user_agent: userAgent,
          ip_address: entry.ip_address // This would need to be provided by backend
        });

      if (error) {
        console.error('Error logging audit entry:', error);
      }
    } catch (error) {
      console.error('Error in audit log:', error);
    }
  },

  async logUserAction(action: string, details?: Record<string, any>): Promise<void> {
    await this.log({
      action,
      new_values: details
    });
  },

  async logDataChange(
    action: 'create' | 'update' | 'delete',
    tableName: string,
    recordId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>
  ): Promise<void> {
    await this.log({
      action: `${action}_${tableName}`,
      table_name: tableName,
      record_id: recordId,
      old_values: oldValues,
      new_values: newValues
    });
  }
};
