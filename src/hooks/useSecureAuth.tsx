
import { useState } from 'react';
import { useAuthState } from './auth/useAuthState';
import { useAuthActions } from './auth/useAuthActions';

export const useSecureAuth = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  const {
    user,
    profile,
    session,
    loading,
    setUser,
    setProfile,
    setSession
  } = useAuthState();

  const { signIn, signUp, signOut } = useAuthActions();

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut: async () => {
      await signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      setIsRateLimited(false);
    },
    isRateLimited,
  };
};
