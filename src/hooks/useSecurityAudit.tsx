
import { useState, useCallback } from 'react';

interface SecurityEvent {
  event_type: string;
  event_details: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export const useSecurityAudit = () => {
  const [isLogging, setIsLogging] = useState(false);

  const logSecurityEvent = useCallback(async (event: SecurityEvent) => {
    if (isLogging) return; // Prevent recursive calls
    
    setIsLogging(true);
    try {
      // Get client IP and user agent
      const clientInfo = {
        ip_address: await getClientIP(),
        user_agent: navigator.userAgent,
      };

      // For now, just log to console since the table may not be available in types yet
      console.log('Security Event:', {
        event_type: event.event_type,
        event_details: event.event_details,
        ip_address: clientInfo.ip_address,
        user_agent: clientInfo.user_agent,
        timestamp: new Date().toISOString()
      });

      // TODO: Uncomment when security_audit_log is available in Supabase types
      // const { supabase } = await import('@/integrations/supabase/client');
      // const { error } = await supabase
      //   .from('security_audit_log')
      //   .insert({
      //     event_type: event.event_type,
      //     event_details: event.event_details,
      //     ip_address: clientInfo.ip_address,
      //     user_agent: clientInfo.user_agent,
      //   });

      // if (error) {
      //   console.error('Failed to log security event:', error);
      // }
    } catch (error) {
      console.error('Security audit logging error:', error);
    } finally {
      setIsLogging(false);
    }
  }, [isLogging]);

  const logFailedLogin = useCallback((email: string, reason: string) => {
    logSecurityEvent({
      event_type: 'failed_login',
      event_details: {
        email,
        reason,
        timestamp: new Date().toISOString(),
      },
    });
  }, [logSecurityEvent]);

  const logSuccessfulLogin = useCallback((userId: string) => {
    logSecurityEvent({
      event_type: 'successful_login',
      event_details: {
        user_id: userId,
        timestamp: new Date().toISOString(),
      },
    });
  }, [logSecurityEvent]);

  const logSuspiciousActivity = useCallback((activity: string, details: Record<string, any>) => {
    logSecurityEvent({
      event_type: 'suspicious_activity',
      event_details: {
        activity,
        ...details,
        timestamp: new Date().toISOString(),
      },
    });
  }, [logSecurityEvent]);

  const logDataAccess = useCallback((resource: string, action: string) => {
    logSecurityEvent({
      event_type: 'data_access',
      event_details: {
        resource,
        action,
        timestamp: new Date().toISOString(),
      },
    });
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    logFailedLogin,
    logSuccessfulLogin,
    logSuspiciousActivity,
    logDataAccess,
  };
};

// Helper function to get client IP (fallback method)
const getClientIP = async (): Promise<string | null> => {
  try {
    // In a real implementation, you'd get this from your server
    // For now, we'll return null and let the server handle IP detection
    return null;
  } catch {
    return null;
  }
};
