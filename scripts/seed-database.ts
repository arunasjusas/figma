/**
 * Script to seed the Supabase database with initial data
 * Run this once to populate the database with the mock data
 * 
 * Usage: 
 * 1. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
 * 2. Run: npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { mockInvoices } from '../src/lib/mockData';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://stbhwafhrjisprjtzypr.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Ymh3YWZocmppc3ByanR6eXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Nzg0NDgsImV4cCI6MjA3NjM1NDQ0OH0.CQHv3t5XYjZTwgCOxq8Oko28XNP4hoo0HVwA-esVKH4';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const mockClients = [
  {
    id: '1',
    name: 'MB Balttech',
    email: 'info@balttech.lt',
    phone: '+370 600 11111',
    address: 'Vilnius, Gedimino pr. 1',
    tax_id: '123456789',
  },
  {
    id: '2',
    name: 'UAB Ratai',
    email: 'kontaktai@ratai.lt',
    phone: '+370 600 22222',
    address: 'Kaunas, Laisvės al. 10',
    tax_id: '987654321',
  },
  {
    id: '3',
    name: 'UAB Sodas',
    email: 'info@sodas.lt',
    phone: '+370 600 33333',
    address: 'Klaipėda, Taikos pr. 5',
    tax_id: null,
  },
  {
    id: '4',
    name: 'MB Technika',
    email: 'technika@technika.lt',
    phone: '+370 600 44444',
    address: null,
    tax_id: null,
  },
  {
    id: '5',
    name: 'UAB Statyba',
    email: 'statyba@statyba.lt',
    phone: '+370 600 55555',
    address: 'Šiauliai, Tilžės g. 20',
    tax_id: '555666777',
  },
  {
    id: '6',
    name: 'MB Dizainas',
    email: 'hello@dizainas.lt',
    phone: '+370 600 66666',
    address: null,
    tax_id: null,
  },
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  // Seed clients
  console.log('📦 Seeding clients...');
  const { error: clientsError } = await supabase
    .from('clients')
    .upsert(mockClients, { onConflict: 'id' });

  if (clientsError) {
    console.error('❌ Error seeding clients:', clientsError);
  } else {
    console.log('✅ Clients seeded successfully');
  }

  // Seed invoices
  console.log('📄 Seeding invoices...');
  const invoicesToInsert = mockInvoices.map((invoice) => ({
    id: invoice.id,
    number: invoice.number,
    date: invoice.date,
    client: invoice.client,
    amount: invoice.amount.toString(),
    status: invoice.status,
    due_date: invoice.dueDate,
    paid_amount: invoice.paidAmount?.toString() || '0',
    attachment_name: invoice.attachment?.name || null,
    attachment_url: invoice.attachment?.url || null,
    notes: invoice.notes || null,
    deleted: invoice.deleted || false,
    deleted_at: invoice.deletedAt || null,
  }));

  const { error: invoicesError } = await supabase
    .from('invoices')
    .upsert(invoicesToInsert, { onConflict: 'id' });

  if (invoicesError) {
    console.error('❌ Error seeding invoices:', invoicesError);
  } else {
    console.log('✅ Invoices seeded successfully');
  }

  console.log('🎉 Database seeding completed!');
}

seedDatabase().catch(console.error);

