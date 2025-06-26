
import { useState } from 'react';
import { useAuthStateManager } from './auth/useAuthStateManager';
import { useAuthActions } from './auth/useAuthActions';

export const useSecureAuth = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  
  const {
    user,
    profile,
    session,
    loading,
    resetAuthState
  } = useAuthStateManager();

  const { signIn, signUp, signOut } = useAuthActions({ profile, resetAuthState });

  return {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut: async () => {
      await signOut();
      resetAuthState();
      setIsRateLimited(false);
    },
    isRateLimited,
  };
};
