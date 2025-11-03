import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/profile';

interface UserContextType {
  user: {
    id: string;
    email: string;
    profile?: Profile;
  } | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserContextType['user']>(null);

  useEffect(() => {
    async function loadUserProfile() {
      if (!session?.user) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error loading user profile:', error);
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
        } else {
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            profile,
          });
        }
      } catch (error) {
        console.error('Error loading user profile:', error);
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [session]);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
