import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInvoiceStore } from './invoiceStore';
import { getAllMonthNames } from '@/lib/utils';

export interface AIMessage {
  id: string;
  date: string;
  step: string;
  client: string;
  status: 'SENT' | 'OPENED' | 'NOT_DELIVERED';
  invoiceId?: string;
}

interface AIAnalyticsStore {
  messages: AIMessage[];
  addMessage: (message: Omit<AIMessage, 'id'>) => void;
  updateMessageStatus: (id: string, status: AIMessage['status']) => void;
  getMessages: () => AIMessage[];
  getRecentMessages: (limit?: number) => AIMessage[];
  getAnalytics: () => {
    openedRate: number;
    clickThroughRate: number;
    conversionRate: number;
  };
  getSendingActivity: () => Array<{
    month: string;
    siustu: number;
    atidaryta: number;
  }>;
}

/**
 * Generate AI messages from invoice data
 * Simulates AI sequence messages based on invoice status and dates
 */
const generateMessagesFromInvoices = (): AIMessage[] => {
  try {
    const invoiceStore = useInvoiceStore.getState();
    const activeInvoices = invoiceStore.getActiveInvoices();
    const messages: AIMessage[] = [];

    activeInvoices.forEach((invoice) => {
      const dueDate = new Date(invoice.dueDate);
      const now = new Date();
      
      // Generate messages based on invoice status and dates
      if (invoice.status === 'UNPAID' && now > dueDate) {
        // Overdue - generate Step 1, 2, 3 messages
        const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysOverdue >= 1) {
          messages.push({
            id: `msg-${invoice.id}-1`,
            date: new Date(dueDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            step: 'Step 1',
            client: invoice.client,
            status: daysOverdue > 3 ? 'OPENED' : 'SENT',
            invoiceId: invoice.id,
          });
        }
        
        if (daysOverdue >= 3) {
          messages.push({
            id: `msg-${invoice.id}-2`,
            date: new Date(dueDate.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            step: 'Step 2',
            client: invoice.client,
            status: daysOverdue > 5 ? 'OPENED' : 'SENT',
            invoiceId: invoice.id,
          });
        }
        
        if (daysOverdue >= 5) {
          messages.push({
            id: `msg-${invoice.id}-3`,
            date: new Date(dueDate.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            step: 'Step 3',
            client: invoice.client,
            status: 'SENT',
            invoiceId: invoice.id,
          });
        }
      } else if (invoice.status === 'PENDING') {
        // Pending - generate reminder message
        const daysUntilDue = Math.floor((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 3 && daysUntilDue > 0) {
          messages.push({
            id: `msg-${invoice.id}-reminder`,
            date: invoice.date,
            step: 'Step 1',
            client: invoice.client,
            status: 'SENT',
            invoiceId: invoice.id,
          });
        }
      }
    });

    return messages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Failed to generate messages from invoices:', error);
    return [];
  }
};

/**
 * Get initial messages from localStorage or generate from invoices
 */
const getInitialMessages = (): AIMessage[] => {
  try {
    const stored = localStorage.getItem('ai-analytics-storage');
    if (stored) {
      const parsed = JSON.parse(stored);
      const storedMessages = parsed.state?.messages;
      if (storedMessages && storedMessages.length > 0) {
        return storedMessages;
      }
    }
  } catch (error) {
    console.error('Failed to load AI messages from localStorage:', error);
  }
  
  // Generate from invoices if no stored data
  return generateMessagesFromInvoices();
};

/**
 * AI Analytics store using Zustand with localStorage persistence
 * Tracks AI sequence messages and calculates analytics
 */
export const useAIAnalyticsStore = create<AIAnalyticsStore>()(
  persist(
    (set, get) => ({
      messages: getInitialMessages(),

      addMessage: (message) => {
        const newMessage: AIMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        set((state) => ({
          messages: [newMessage, ...state.messages],
        }));
      },

      updateMessageStatus: (id, status) => {
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, status } : msg
          ),
        }));
      },

      getMessages: () => {
        return get().messages;
      },

      getRecentMessages: (limit = 10) => {
        return get().messages.slice(0, limit);
      },

      getAnalytics: () => {
        const messages = get().messages;
        const totalSent = messages.length;
        const opened = messages.filter((m) => m.status === 'OPENED').length;
        
        // Calculate rates
        const openedRate = totalSent > 0 ? Math.round((opened / totalSent) * 100) : 0;
        const clickThroughRate = totalSent > 0 ? Math.round((opened / totalSent) * 64) : 0; // Simulated
        const conversionRate = totalSent > 0 ? Math.round((opened / totalSent) * 29) : 0; // Simulated
        
        return {
          openedRate: Math.min(openedRate, 100),
          clickThroughRate: Math.min(clickThroughRate, 100),
          conversionRate: Math.min(conversionRate, 100),
        };
      },

      getSendingActivity: () => {
        // Get current messages or regenerate from invoices
        let messages = get().messages;
        if (messages.length === 0) {
          messages = generateMessagesFromInvoices();
          if (messages.length > 0) {
            set({ messages });
          }
        }
        
        const now = new Date();
        const months = getAllMonthNames();
        
        // Generate last 12 months
        const activityData = months.map((monthName, index) => {
          const monthDate = new Date(now.getFullYear(), index, 1);
          const nextMonth = new Date(now.getFullYear(), index + 1, 1);
          
          // Count messages sent in this month
          const messagesInMonth = messages.filter((msg) => {
            const msgDate = new Date(msg.date);
            return msgDate >= monthDate && msgDate < nextMonth;
          });
          
          const siustu = messagesInMonth.length;
          const atidaryta = messagesInMonth.filter((m) => m.status === 'OPENED').length;
          
          return {
            month: monthName,
            siustu,
            atidaryta,
          };
        });
        
        return activityData;
      },
    }),
    {
      name: 'ai-analytics-storage',
      version: 1,
    }
  )
);

