import { create } from 'zustand';
import { supabase, getUserProfile } from '../lib/supabase';
import { User, UserRole } from '../types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  initialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  initialized: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data?.user) {
        const { data: profileData, error: profileError } = await getUserProfile(data.user.id);
        
        if (profileError) throw profileError;
        
        set({
          user: {
            id: data.user.id,
            email: data.user.email || '',
            role: profileData?.role as UserRole || 'vendor',
            name: profileData?.name || 'User',
            avatar_url: profileData?.avatar_url,
          },
          isLoading: false,
        });
      }
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  initialize: async () => {
    set({ isLoading: true });
    try {
      const { data } = await supabase.auth.getSession();
      
      if (data.session?.user) {
        const { data: profileData, error: profileError } = await getUserProfile(data.session.user.id);
        
        if (profileError) throw profileError;
        
        set({
          user: {
            id: data.session.user.id,
            email: data.session.user.email || '',
            role: profileData?.role as UserRole || 'vendor',
            name: profileData?.name || 'User',
            avatar_url: profileData?.avatar_url,
          },
        });
      }
    } catch (error: any) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false, initialized: true });
    }
  },
}));