import { create } from 'zustand';
import { supabase, subscribeToTable } from '../lib/supabase';
import { Conversation, ConversationStatus } from '../types';

interface ConversationState {
  conversations: Conversation[];
  isLoading: boolean;
  error: string | null;
  fetchConversations: () => Promise<void>;
  updateConversationStatus: (id: string, status: ConversationStatus) => Promise<void>;
  assignConversation: (id: string, userId: string) => Promise<void>;
  setupRealtimeSubscription: () => () => void;
}

export const useConversationStore = create<ConversationState>((set, get) => ({
  conversations: [],
  isLoading: false,
  error: null,

  fetchConversations: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('last_message_time', { ascending: false });

      if (error) throw error;

      set({ conversations: data as Conversation[], isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateConversationStatus: async (id: string, status: ConversationStatus) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        conversations: state.conversations.map(conv => 
          conv.id === id ? { ...conv, status } : conv
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  assignConversation: async (id: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ assigned_to: userId })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        conversations: state.conversations.map(conv => 
          conv.id === id ? { ...conv, assigned_to: userId } : conv
        )
      }));
    } catch (error: any) {
      set({ error: error.message });
    }
  },

  setupRealtimeSubscription: () => {
    return subscribeToTable('conversations', (payload) => {
      const { eventType, new: newRecord, old: oldRecord } = payload;
      
      set(state => {
        let updatedConversations = [...state.conversations];
        
        if (eventType === 'INSERT') {
          updatedConversations = [
            { ...newRecord, is_new: true } as Conversation,
            ...updatedConversations
          ];
        } else if (eventType === 'UPDATE') {
          updatedConversations = updatedConversations.map(conv => 
            conv.id === oldRecord.id ? { ...conv, ...newRecord } : conv
          );
        } else if (eventType === 'DELETE') {
          updatedConversations = updatedConversations.filter(
            conv => conv.id !== oldRecord.id
          );
        }
        
        return { conversations: updatedConversations };
      });
    });
  }
}));