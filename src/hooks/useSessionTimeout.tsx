
import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const useSessionTimeout = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const handleSessionTimeout = useCallback(async () => {
    await signOut();
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please sign in again.",
      variant: "destructive"
    });
  }, [signOut, toast]);

  const showWarning = useCallback(() => {
    toast({
      title: "Session Warning",
      description: "Your session will expire in 5 minutes. Please save your work.",
      variant: "destructive"
    });
  }, [toast]);

  const resetTimeout = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current);
    }

    if (user) {
      // Set warning timeout
      warningRef.current = setTimeout(showWarning, SESSION_TIMEOUT - WARNING_TIME);
      
      // Set logout timeout
      timeoutRef.current = setTimeout(handleSessionTimeout, SESSION_TIMEOUT);
    }
  }, [user, handleSessionTimeout, showWarning]);

  useEffect(() => {
    if (user) {
      resetTimeout();

      // Reset timeout on user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const resetTimeoutThrottled = (() => {
        let timeoutId: NodeJS.Timeout;
        return () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(resetTimeout, 1000); // Throttle to once per second
        };
      })();

      events.forEach(event => {
        document.addEventListener(event, resetTimeoutThrottled, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimeoutThrottled, true);
        });
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        if (warningRef.current) clearTimeout(warningRef.current);
      };
    }
  }, [user, resetTimeout]);

  return { resetTimeout };
};
