/**
 * Mock data for development and testing
 */

import { getAllMonthNames } from './utils';

export interface Invoice {
  id: string;
  number: string;
  date: string;
  client: string;
  amount: number;
  status: 'PAID' | 'UNPAID' | 'PENDING';
  dueDate: string;
  paidAmount?: number;
  attachment?: {
    name: string;
    url: string;
  };
  notes?: string;
}

export interface RecentAction {
  date: string;
  action: string;
  client: string;
  amount: number;
}

export interface ChartDataPoint {
  month: string;
  paid: number;
  unpaid: number;
  pending: number;
}

export interface AIMessage {
  id: string;
  date: string;
  step: string;
  client: string;
  status: 'SENT' | 'OPENED' | 'NOT_DELIVERED';
}

// Mock invoices
export const mockInvoices: Invoice[] = [
  {
    id: '1',
    number: 'SF-101',
    date: '2025-10-01',
    client: 'MB Balttech',
    amount: 250.00,
    status: 'UNPAID',
    dueDate: '2025-11-01',
  },
  {
    id: '2',
    number: 'SF-102',
    date: '2025-10-02',
    client: 'UAB Ratai',
    amount: 450.00,
    status: 'PAID',
    dueDate: '2025-11-02',
    paidAmount: 450.00,
  },
  {
    id: '3',
    number: 'SF-103',
    date: '2025-10-03',
    client: 'UAB Sodas',
    amount: 1500.00,
    status: 'PENDING',
    dueDate: '2025-12-15',
    paidAmount: 600.00,
    attachment: {
      name: 'Sutartis_Sodas_2025.pdf',
      url: '#',
    },
    notes: 'Klientui buvo išsiųstas priminimas 2025-11-05. Mokėjimo terminas vis dar aktyvus.',
  },
  {
    id: '4',
    number: 'SF-104',
    date: '2025-10-05',
    client: 'MB Technika',
    amount: 680.00,
    status: 'PAID',
    dueDate: '2025-11-05',
    paidAmount: 680.00,
  },
  {
    id: '5',
    number: 'SF-105',
    date: '2025-10-10',
    client: 'UAB Statyba',
    amount: 1200.00,
    status: 'UNPAID',
    dueDate: '2025-11-10',
  },
  {
    id: '6',
    number: 'SF-106',
    date: '2025-10-15',
    client: 'MB Dizainas',
    amount: 350.00,
    status: 'PENDING',
    dueDate: '2025-12-01',
  },
];

// Mock recent actions
export const mockRecentActions: RecentAction[] = [
  {
    date: '2025-11-04',
    action: 'Išrašyta sąskaita',
    client: 'UAB Balttech',
    amount: 520.00,
  },
  {
    date: '2025-11-03',
    action: 'Išsiųstas AI priminimas',
    client: 'MB Ratai',
    amount: 210.00,
  },
  {
    date: '2025-11-01',
    action: 'Gautas apmokėjimas',
    client: 'UAB Sodas',
    amount: 1140.00,
  },
  {
    date: '2025-10-30',
    action: 'Išrašyta sąskaita',
    client: 'MB Technika',
    amount: 680.00,
  },
  {
    date: '2025-10-28',
    action: 'Išsiųstas AI priminimas',
    client: 'UAB Statyba',
    amount: 1200.00,
  },
];

// Mock chart data
export const mockChartData: ChartDataPoint[] = getAllMonthNames().map((month) => ({
  month,
  paid: Math.floor(Math.random() * 15) + 5,
  unpaid: Math.floor(Math.random() * 8) + 2,
  pending: Math.floor(Math.random() * 10) + 3,
}));

// Mock AI messages
export const mockAIMessages: AIMessage[] = [
  {
    id: '1',
    date: '2025-11-06',
    step: 'Step 1',
    client: 'UAB Sodas',
    status: 'SENT',
  },
  {
    id: '2',
    date: '2025-11-06',
    step: 'Step 2',
    client: 'MB Ratai',
    status: 'OPENED',
  },
  {
    id: '3',
    date: '2025-11-05',
    step: 'Step 3',
    client: 'UAB Balttech',
    status: 'NOT_DELIVERED',
  },
  {
    id: '4',
    date: '2025-11-05',
    step: 'Step 1',
    client: 'MB Technika',
    status: 'OPENED',
  },
  {
    id: '5',
    date: '2025-11-04',
    step: 'Step 2',
    client: 'UAB Statyba',
    status: 'SENT',
  },
  {
    id: '6',
    date: '2025-11-04',
    step: 'Step 1',
    client: 'MB Dizainas',
    status: 'OPENED',
  },
  {
    id: '7',
    date: '2025-11-03',
    step: 'Step 3',
    client: 'UAB Ratai',
    status: 'SENT',
  },
  {
    id: '8',
    date: '2025-11-03',
    step: 'Step 1',
    client: 'MB Balttech',
    status: 'OPENED',
  },
  {
    id: '9',
    date: '2025-11-02',
    step: 'Step 2',
    client: 'UAB Sodas',
    status: 'SENT',
  },
  {
    id: '10',
    date: '2025-11-02',
    step: 'Step 1',
    client: 'MB Technika',
    status: 'NOT_DELIVERED',
  },
];

// Mock AI sequence steps
export interface SequenceStep {
  id: string;
  number: number;
  title: string;
  subject: string;
  content: string;
  tone: 'neutral' | 'friendly';
  aiStrength: number;
  delay: string;
  additionalRule: string;
}

export const mockSequenceSteps: SequenceStep[] = [
  {
    id: '1',
    number: 1,
    title: 'Priminimas dėl mokėjimo',
    subject: 'Dėl artėjančio mokėjimo termino',
    content: 'Gerbiamas kliente, primename, kad jūsų sąskaitos mokėjimo terminas artėja. Prašome apmokėti laiku.',
    tone: 'neutral',
    aiStrength: 50,
    delay: '24 val.',
    additionalRule: 'Siųsti tik jei klientas neatsakė',
  },
  {
    id: '2',
    number: 2,
    title: 'Vėlavimo žinutė',
    subject: 'Dėl vėluojančio mokėjimo',
    content: 'Gerbiamas kliente, pastebėjome, kad jūsų mokėjimas vėluoja. Prašome kuo greičiau apmokėti sąskaitą.',
    tone: 'neutral',
    aiStrength: 70,
    delay: '48 val.',
    additionalRule: 'Siųsti tik darbo dienomis',
  },
  {
    id: '3',
    number: 3,
    title: 'Galutinis priminimas',
    subject: 'Galutinis priminimas dėl mokėjimo',
    content: 'Gerbiamas kliente, tai paskutinis priminimas dėl vėluojančio mokėjimo. Prašome nedelsiant apmokėti sąskaitą.',
    tone: 'friendly',
    aiStrength: 90,
    delay: '72 val.',
    additionalRule: 'Siųsti tik po 3 dienų nuo paskutinio priminimo',
  },
];

