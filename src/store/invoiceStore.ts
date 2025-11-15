import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { mockInvoices, type Invoice } from '@/lib/mockData';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  restoreInvoice: (id: string) => void;
  permanentlyDeleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
  getActiveInvoices: () => Invoice[];
  getDeletedInvoices: () => Invoice[];
}

/**
 * Get initial invoices from localStorage or use mock data
 */
const getInitialInvoices = (): Invoice[] => {
  try {
    const stored = localStorage.getItem('invoice-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.state?.invoices || mockInvoices;
    }
  } catch (error) {
    console.error('Failed to load invoices from localStorage:', error);
  }
  return mockInvoices;
};

/**
 * Invoice store using Zustand with localStorage persistence
 * Manages invoice state and operations with soft delete support
 */
export const useInvoiceStore = create<InvoiceStore>()(
  persist(
    (set, get) => ({
      invoices: getInitialInvoices(),

  addInvoice: (invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `invoice-${Date.now()}`,
      deleted: false,
    };
    set((state) => ({
      invoices: [newInvoice, ...state.invoices],
    }));
  },

  updateInvoice: (id, updatedData) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id ? { ...invoice, ...updatedData } : invoice
      ),
    }));
  },

  // Soft delete - mark as deleted
  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, deleted: true, deletedAt: new Date().toISOString() }
          : invoice
      ),
    }));
  },

  // Restore deleted invoice
  restoreInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.map((invoice) =>
        invoice.id === id
          ? { ...invoice, deleted: false, deletedAt: undefined }
          : invoice
      ),
    }));
  },

  // Permanently delete invoice
  permanentlyDeleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    }));
  },

  getInvoiceById: (id) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },

  // Get only active (non-deleted) invoices
  getActiveInvoices: () => {
    return get().invoices.filter((invoice) => !invoice.deleted);
  },

  // Get only deleted invoices
  getDeletedInvoices: () => {
    return get().invoices.filter((invoice) => invoice.deleted);
  },
    }),
    {
      name: 'invoice-storage', // localStorage key
      version: 1,
    }
  )
);

