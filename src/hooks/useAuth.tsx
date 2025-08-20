
import { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const WARNING_TIME = 5 * 60 * 1000; // 5 minutes before timeout

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // Session timeout refs
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const fetchProfile = async (userId: string) => {
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      return {
        ...profileData,
        roles: profileData.role ? [profileData.role] : []
      };
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  };

  const signOut = async () => {
    try {
      // Clear session timeout timers
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current);
      }

      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      
      // Clear any sensitive data from localStorage
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.includes('sensitive') || key.includes('session') || key.includes('token')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleSessionTimeout = useCallback(async () => {
    await signOut();
    toast({
      title: "Session Expired",
      description: "Your session has expired. Please sign in again.",
      variant: "destructive"
    });
  }, [toast]);

  const showWarning = useCallback(() => {
    toast({
      title: "Session Warning",
      description: "Your session will expire in 5 minutes. Please save your work.",
      variant: "destructive"
    });
  }, [toast]);

  const resetSessionTimeout = useCallback(() => {
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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (!mounted) return;

        if (initialSession?.user) {
          console.log('Found existing session:', initialSession.user.id);
          setUser(initialSession.user);
          setSession(initialSession);
          
          // Fetch profile in background
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(initialSession.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }
          }, 0);
        } else {
          console.log('No existing session found');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        if (mounted) {
          console.log('Auth initialization complete, setting loading to false');
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          setSession(session);
          
          // Fetch profile in background
          setTimeout(async () => {
            if (mounted) {
              const profileData = await fetchProfile(session.user.id);
              if (mounted) {
                setProfile(profileData);
              }
            }
          }, 0);
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
        }
        
        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, []);

  // Set up session timeout monitoring when user changes
  useEffect(() => {
    if (user) {
      resetSessionTimeout();

      // Reset timeout on user activity
      const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      const resetTimeoutThrottled = (() => {
        let timeoutId: NodeJS.Timeout;
        return () => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(resetSessionTimeout, 1000); // Throttle to once per second
        };
      })();

      events.forEach(event => {
        document.addEventListener(event, resetTimeoutThrottled, true);
      });

      return () => {
        events.forEach(event => {
          document.removeEventListener(event, resetTimeoutThrottled, true);
        });
      };
    } else {
      // Clear timeouts when user logs out
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    }
  }, [user, resetSessionTimeout]);

  const value = {
    user,
    profile,
    session,
    loading,
    signOut,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
