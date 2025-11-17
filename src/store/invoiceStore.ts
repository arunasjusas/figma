import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { Invoice } from '@/lib/mockData';

interface InvoiceStore {
  invoices: Invoice[];
  isLoading: boolean;
  error: string | null;
  addInvoice: (invoice: Omit<Invoice, 'id'>) => Promise<void>;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => Promise<void>;
  deleteInvoice: (id: string) => Promise<void>;
  restoreInvoice: (id: string) => Promise<void>;
  permanentlyDeleteInvoice: (id: string) => Promise<void>;
  getInvoiceById: (id: string) => Invoice | undefined;
  getActiveInvoices: () => Invoice[];
  getDeletedInvoices: () => Invoice[];
  fetchInvoices: () => Promise<void>;
  subscribeToChanges: () => () => void;
}

/**
 * Convert database row to Invoice type
 */
const dbRowToInvoice = (row: any): Invoice => ({
  id: row.id,
  number: row.number,
  date: row.date,
  client: row.client,
  amount: parseFloat(row.amount),
  status: row.status as 'PAID' | 'UNPAID' | 'PENDING',
  dueDate: row.due_date,
  paidAmount: row.paid_amount ? parseFloat(row.paid_amount) : undefined,
  attachment: row.attachment_name && row.attachment_url
    ? { name: row.attachment_name, url: row.attachment_url }
    : undefined,
  notes: row.notes || undefined,
  deleted: row.deleted || false,
  deletedAt: row.deleted_at || undefined,
});

/**
 * Convert Invoice to database row
 */
const invoiceToDbRow = (invoice: Partial<Invoice>) => ({
  number: invoice.number,
  date: invoice.date,
  client: invoice.client,
  amount: invoice.amount?.toString(),
  status: invoice.status,
  due_date: invoice.dueDate,
  paid_amount: invoice.paidAmount?.toString() || '0',
  attachment_name: invoice.attachment?.name || null,
  attachment_url: invoice.attachment?.url || null,
  notes: invoice.notes || null,
  deleted: invoice.deleted || false,
  deleted_at: invoice.deletedAt || null,
});

/**
 * Invoice store using Zustand with Supabase backend
 * All users see and share the same data with real-time updates
 */
export const useInvoiceStore = create<InvoiceStore>()((set, get) => ({
  invoices: [],
  isLoading: true,
  error: null,

  fetchInvoices: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      set({
        invoices: (data || []).map(dbRowToInvoice),
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch invoices',
        isLoading: false,
      });
    }
  },

  subscribeToChanges: () => {
    const channel = supabase
      .channel('invoices-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'invoices',
        },
        async () => {
          // Refetch invoices when any change occurs
          await get().fetchInvoices();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },

  addInvoice: async (invoice) => {
    try {
      const newInvoice: Invoice = {
        ...invoice,
        id: `invoice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        deleted: false,
      };

      const { error } = await supabase
        .from('invoices')
        .insert({
          id: newInvoice.id,
          ...invoiceToDbRow(newInvoice),
        });

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchInvoices();
    } catch (error) {
      console.error('Failed to add invoice:', error);
      throw error;
    }
  },

  updateInvoice: async (id, updatedData) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          ...invoiceToDbRow(updatedData as Partial<Invoice>),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchInvoices();
    } catch (error) {
      console.error('Failed to update invoice:', error);
      throw error;
    }
  },

  deleteInvoice: async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          deleted: true,
          deleted_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchInvoices();
    } catch (error) {
      console.error('Failed to delete invoice:', error);
      throw error;
    }
  },

  restoreInvoice: async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .update({
          deleted: false,
          deleted_at: null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchInvoices();
    } catch (error) {
      console.error('Failed to restore invoice:', error);
      throw error;
    }
  },

  permanentlyDeleteInvoice: async (id) => {
    try {
      const { error } = await supabase
        .from('invoices')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Real-time subscription will update the list automatically
      await get().fetchInvoices();
    } catch (error) {
      console.error('Failed to permanently delete invoice:', error);
      throw error;
    }
  },

  getInvoiceById: (id) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },

  getActiveInvoices: () => {
    return get().invoices.filter((invoice) => !invoice.deleted);
  },

  getDeletedInvoices: () => {
    return get().invoices.filter((invoice) => invoice.deleted);
  },
}));
