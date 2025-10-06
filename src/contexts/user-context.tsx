import { createContext } from 'react';

interface User {
  id: string;
  email: string;
  // Add other user properties as needed
}

interface UserContextType {
  user: User | null;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);
