import { create } from 'zustand';
import { mockInvoices, type Invoice } from '@/lib/mockData';

interface InvoiceStore {
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoiceById: (id: string) => Invoice | undefined;
}

/**
 * Invoice store using Zustand
 * Manages invoice state and operations
 */
export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  invoices: mockInvoices,

  addInvoice: (invoice) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: `invoice-${Date.now()}`,
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

  deleteInvoice: (id) => {
    set((state) => ({
      invoices: state.invoices.filter((invoice) => invoice.id !== id),
    }));
  },

  getInvoiceById: (id) => {
    return get().invoices.find((invoice) => invoice.id === id);
  },
}));

