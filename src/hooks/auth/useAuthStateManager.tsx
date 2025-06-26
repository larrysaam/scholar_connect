
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { UserProfile } from './types';

export const useAuthStateManager = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user && event !== 'SIGNED_OUT') {
          try {
            const { data: profileData, error } = await supabase
              .from('users')
              .select('*')
              .eq('id', session.user.id)
              .single();
            
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
            } else if (profileData && mounted) {
              setProfile(profileData);
            }
          } catch (error) {
            console.error('Profile fetch error:', error);
          } finally {
            if (mounted) {
              setLoading(false);
            }
          }
        } else {
          setProfile(null);
          if (mounted) {
            setLoading(false);
          }
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profileData, error }) => {
            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching profile:', error);
            } else if (profileData && mounted) {
              setProfile(profileData);
            }
            if (mounted) {
              setLoading(false);
            }
          });
      } else if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const resetAuthState = () => {
    setUser(null);
    setProfile(null);
    setSession(null);
  };

  return {
    user,
    profile,
    session,
    loading,
    resetAuthState
  };
};
