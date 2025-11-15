import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
}

/**
 * Authentication store using Zustand
 * Persists auth state to localStorage
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, _password: string) => {
        // Mock login - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user: User = {
          id: '1',
          email,
          firstName: 'Jonas',
          lastName: 'Jonaitis',
        };

        set({ user, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      signup: async (email: string, _password: string, firstName: string, lastName: string) => {
        // Mock signup - in production, this would call an API
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const user: User = {
          id: '1',
          email,
          firstName,
          lastName,
        };

        set({ user, isAuthenticated: true });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

