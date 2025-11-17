import { create } from 'zustand';

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
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
}

// Mock clients data
const mockClients: Client[] = [
  {
    id: '1',
    name: 'MB Balttech',
    email: 'info@balttech.lt',
    phone: '+370 600 11111',
    address: 'Vilnius, Gedimino pr. 1',
    taxId: '123456789',
    createdAt: '2025-01-01',
  },
  {
    id: '2',
    name: 'UAB Ratai',
    email: 'kontaktai@ratai.lt',
    phone: '+370 600 22222',
    address: 'Kaunas, Laisvės al. 10',
    taxId: '987654321',
    createdAt: '2025-01-15',
  },
  {
    id: '3',
    name: 'UAB Sodas',
    email: 'info@sodas.lt',
    phone: '+370 600 33333',
    address: 'Klaipėda, Taikos pr. 5',
    createdAt: '2025-02-01',
  },
  {
    id: '4',
    name: 'MB Technika',
    email: 'technika@technika.lt',
    phone: '+370 600 44444',
    createdAt: '2025-02-10',
  },
  {
    id: '5',
    name: 'UAB Statyba',
    email: 'statyba@statyba.lt',
    phone: '+370 600 55555',
    address: 'Šiauliai, Tilžės g. 20',
    taxId: '555666777',
    createdAt: '2025-03-01',
  },
  {
    id: '6',
    name: 'MB Dizainas',
    email: 'hello@dizainas.lt',
    phone: '+370 600 66666',
    createdAt: '2025-03-15',
  },
];

/**
 * Client store using Zustand
 * Always uses mock data as source of truth - all users see the same data
 * Manages client state and operations
 */
export const useClientStore = create<ClientStore>()((set, get) => ({
  clients: mockClients,

  addClient: (client) => {
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      clients: [newClient, ...state.clients],
    }));
  },

  updateClient: (id, updatedData) => {
    set((state) => ({
      clients: state.clients.map((client) =>
        client.id === id ? { ...client, ...updatedData } : client
      ),
    }));
  },

  deleteClient: (id) => {
    set((state) => ({
      clients: state.clients.filter((client) => client.id !== id),
    }));
  },

  getClientById: (id) => {
    return get().clients.find((client) => client.id === id);
  },
}));

