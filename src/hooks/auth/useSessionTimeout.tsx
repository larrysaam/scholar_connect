
import { useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface UseSessionTimeoutProps {
  session: Session | null;
  signOut: () => Promise<void>;
}

export const useSessionTimeout = ({ session, signOut }: UseSessionTimeoutProps) => {
  const { toast } = useToast();

  useEffect(() => {
    if (!session) return;

    const checkSession = () => {
      const expiresAt = session.expires_at;
      if (expiresAt && Date.now() / 1000 > expiresAt) {
        signOut();
        toast({
          title: "Session Expired",
          description: "Please sign in again to continue.",
          variant: "destructive",
        });
      }
    };

    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [session, signOut, toast]);
};
