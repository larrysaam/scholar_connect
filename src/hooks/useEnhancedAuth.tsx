
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import { supabase } from '@/integrations/supabase/client';

export const useEnhancedAuth = () => {
  const authHook = useAuth();
  const { resetTimeout } = useSessionTimeout();
  const [securityEvents, setSecurityEvents] = useState<string[]>([]);

  const logSecurityEvent = (event: string) => {
    setSecurityEvents(prev => [...prev.slice(-9), event]); // Keep last 10 events
    console.log(`Security Event: ${event} at ${new Date().toISOString()}`);
  };

  const enhancedSignIn = async (email: string, password: string) => {
    const clientIP = 'unknown'; // In production, you'd get actual IP
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        logSecurityEvent(`Failed login attempt for ${email}`);
        throw error;
      }

      if (data.user) {
        logSecurityEvent(`Successful login for ${email}`);
        resetTimeout();
        return { user: data.user, session: data.session };
      }
    } catch (error) {
      logSecurityEvent(`Login error: ${error.message}`);
      throw error;
    }
  };

  const enhancedSignOut = async () => {
    try {
      logSecurityEvent('User logout initiated');
      await authHook.signOut();
    } catch (error) {
      logSecurityEvent(`Logout error: ${error.message}`);
      throw error;
    }
  };

  // Monitor for suspicious activity
  useEffect(() => {
    if (authHook.user) {
      const checkSession = async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session && authHook.user) {
            logSecurityEvent('Session invalidated unexpectedly');
            await enhancedSignOut();
          }
        } catch (error) {
          logSecurityEvent('Session check failed');
        }
      };

      const interval = setInterval(checkSession, 5 * 60 * 1000); // Check every 5 minutes
      return () => clearInterval(interval);
    }
  }, [authHook.user]);

  return {
    ...authHook,
    signIn: enhancedSignIn,
    signOut: enhancedSignOut,
    securityEvents,
    logSecurityEvent
  };
};
