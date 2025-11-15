import { create } from 'zustand';

interface InvoiceFilterStore {
  amountFrom: string;
  amountTo: string;
  searchNumber: string;
  searchClient: string;
  status: '' | 'PAID' | 'UNPAID' | 'PENDING';
  setAmountFrom: (value: string) => void;
  setAmountTo: (value: string) => void;
  setSearchNumber: (value: string) => void;
  setSearchClient: (value: string) => void;
  setStatus: (value: '' | 'PAID' | 'UNPAID' | 'PENDING') => void;
  clearFilters: () => void;
}

/**
 * Invoice filter store using Zustand
 * Manages filter state for invoice list
 */
export const useInvoiceFilterStore = create<InvoiceFilterStore>((set) => ({
  amountFrom: '',
  amountTo: '',
  searchNumber: '',
  searchClient: '',
  status: '',

  setAmountFrom: (value) => set({ amountFrom: value }),
  setAmountTo: (value) => set({ amountTo: value }),
  setSearchNumber: (value) => set({ searchNumber: value }),
  setSearchClient: (value) => set({ searchClient: value }),
  setStatus: (value) => set({ status: value }),

  clearFilters: () =>
    set({
      amountFrom: '',
      amountTo: '',
      searchNumber: '',
      searchClient: '',
      status: '',
    }),
}));

