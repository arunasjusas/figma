import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  taxId?: string;
  notes?: string;
  createdAt: string;
}

interface ClientStore {
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => Promise<void>;
  updateClient: (id: string, client: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
  getClientById: (id: string) => Client | undefined;
  fetchClients: () => Promise<void>;
  subscribeToChanges: () => () => void;
}

/**
 * Convert database row to Client type
 */
const dbRowToClient = (row: any): Client => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  address: row.address || undefined,
  taxId: row.tax_id || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
});

/**
 * Convert Client to database row
 */
const clientToDbRow = (client: Partial<Client>) => ({
  name: client.name,
  email: client.email,
  phone: client.phone,
  address: client.address || null,
  tax_id: client.taxId || null,
  notes: client.notes || null,
});

/**
 * Client store using Zustand with Supabase backend
 * All users see and share the same data with real-time updates
 */
export const useClientStore = create<ClientStore>()((set, get) => ({
  clients: [],
  isLoading: true,
  error: null,

  fetchClients: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({
        clients: (data || []).map(dbRowToClient),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch clients',
        isLoading: false,
      });
    }
  },

  subscribeToChanges: () => {
    const channel = supabase
      .channel('clients-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'clients',
        },
        async () => {
          // Refetch clients when any change occurs
          await get().fetchClients();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  addClient: async (client) => {
    try {
      const newClient: Client = {
        ...client,
        id: `client-${Date.now()}`,
        createdAt: new Date().toISOString().split('T')[0],
      };

      const { error } = await supabase
        .from('clients')
        .insert({
          id: newClient.id,
          ...clientToDbRow(newClient),
        });

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchClients();
    } catch (error) {
      console.error('Failed to add client:', error);
      throw error;
    }
  },

  updateClient: async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          ...clientToDbRow(updatedData),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchClients();
    } catch (error) {
      console.error('Failed to update client:', error);
      throw error;
    }
  },

  deleteClient: async (id) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchClients();
    } catch (error) {
      console.error('Failed to delete client:', error);
      throw error;
    }
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },
}));
