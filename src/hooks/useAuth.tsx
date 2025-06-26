
import React, { createContext, useContext } from 'react';
import { AuthContextType } from './auth/types';
import { useAuthStateManager } from './auth/useAuthStateManager';
import { useAuthActions } from './auth/useAuthActions';
import { useSessionTimeout } from './auth/useSessionTimeout';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const {
    user,
    profile,
    session,
    loading,
    resetAuthState
  } = useAuthStateManager();

  const {
    signIn,
    signUp,
    signOut
  } = useAuthActions({ profile, resetAuthState });

  // Handle session timeout
  useSessionTimeout({ session, signOut });

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
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
