/**
 * Auto-generated seed script from exported localStorage data
 * 
 * INSTRUCTIONS:
 * 1. Open https://figma-xi-seven.vercel.app/ in your browser
 * 2. Open browser console (F12)
 * 3. Run the export script (see export-data.html)
 * 4. Copy the exported JSON
 * 5. Replace the empty arrays below with your exported data
 * 6. Run: npx tsx scripts/seed-current-data.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ddtdyacwcaihupjkswoy.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdGR5YWN3Y2FpaHVwamtzd295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM3NzEzOCwiZXhwIjoyMDc4OTUzMTM4fQ.2iAhhev0QfPve8jg6dXAAoROCxcx9zdKZ_LjZoZ39Rg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// TODO: Replace these with your exported data from localStorage
// Run the export script in browser console to get this data
const invoices: any[] = [];
const clients: any[] = [];

async function seedDatabase() {
  console.log('🌱 Seeding database with exported data...\n');
  
  if (invoices.length === 0 && clients.length === 0) {
    console.log('⚠️  No data to seed. Please:');
    console.log('   1. Open https://figma-xi-seven.vercel.app/');
    console.log('   2. Open browser console (F12)');
    console.log('   3. Run the export script from export-data.html');
    console.log('   4. Copy the exported JSON and paste it into this file');
    console.log('   5. Replace the empty arrays above with your data');
    return;
  }
  
  console.log(`📄 Invoices: ${invoices.length} total`);
  console.log(`   - Active: ${invoices.filter(i => !i.deleted).length}`);
  console.log(`   - Deleted: ${invoices.filter(i => i.deleted).length}`);
  console.log(`📦 Clients: ${clients.length}\n`);

  // Seed invoices
  if (invoices.length > 0) {
    console.log('📄 Seeding invoices...');
    const invoicesToInsert = invoices.map((invoice: any) => ({
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
      if (invoicesError.message.includes('does not exist')) {
        console.log('\n⚠️  Tables do not exist yet. Please:');
        console.log('   1. Apply the SQL migration first:');
        console.log('   2. Go to: https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new');
        console.log('   3. Run the SQL from supabase/migrations/001_initial_schema.sql');
      }
    } else {
      console.log(`✅ Successfully seeded ${invoices.length} invoices`);
    }
  }

  // Seed clients
  if (clients.length > 0) {
    console.log('\n📦 Seeding clients...');
    const clientsToInsert = clients.map((client: any) => ({
      id: client.id,
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address || null,
      tax_id: client.taxId || null,
      notes: client.notes || null,
    }));

    const { error: clientsError } = await supabase
      .from('clients')
      .upsert(clientsToInsert, { onConflict: 'id' });

    if (clientsError) {
      console.error('❌ Error seeding clients:', clientsError);
    } else {
      console.log(`✅ Successfully seeded ${clients.length} clients`);
    }
  }

  console.log('\n🎉 Database seeding completed!');
  console.log('✅ Everyone will now see the same data you exported');
  console.log('✅ All changes will sync in real-time across all users');
  console.log('\n📍 Your app: https://figma-xi-seven.vercel.app/');
}

seedDatabase().catch(console.error);

