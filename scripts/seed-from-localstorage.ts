/**
 * Script to seed Supabase with data from localStorage
 * This ensures everyone sees the SAME data you currently see
 * 
 * Instructions:
 * 1. Open browser console on https://figma-xi-seven.vercel.app/
 * 2. Run: JSON.stringify(JSON.parse(localStorage.getItem('invoice-storage')), null, 2)
 * 3. Copy the output and paste it into CURRENT_INVOICES_JSON below
 * 4. Do the same for clients: JSON.stringify(JSON.parse(localStorage.getItem('client-storage')), null, 2)
 * 5. Paste clients data into CURRENT_CLIENTS_JSON below
 * 6. Run: npx tsx scripts/seed-from-localstorage.ts
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ddtdyacwcaihupjkswoy.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdGR5YWN3Y2FpaHVwamtzd295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM3NzEzOCwiZXhwIjoyMDc4OTUzMTM4fQ.2iAhhev0QfPve8jg6dXAAoROCxcx9zdKZ_LjZoZ39Rg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// PASTE YOUR CURRENT INVOICES DATA HERE (from localStorage)
const CURRENT_INVOICES_JSON = `{}`;

// PASTE YOUR CURRENT CLIENTS DATA HERE (from localStorage)  
const CURRENT_CLIENTS_JSON = `{}`;

async function seedFromLocalStorage() {
  console.log('🌱 Seeding database with your current data...\n');

  try {
    // Parse invoices
    const invoiceStorage = JSON.parse(CURRENT_INVOICES_JSON);
    const invoices = invoiceStorage.state?.invoices || [];
    
    console.log(`📄 Found ${invoices.length} invoices to seed`);
    
    if (invoices.length === 0) {
      console.log('⚠️  No invoices found. Make sure you pasted the data correctly.');
      return;
    }

    // Convert and insert invoices
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
    } else {
      console.log(`✅ Successfully seeded ${invoices.length} invoices`);
      console.log(`   - Active: ${invoices.filter((i: any) => !i.deleted).length}`);
      console.log(`   - Deleted: ${invoices.filter((i: any) => i.deleted).length}`);
    }

    // Parse clients
    const clientStorage = JSON.parse(CURRENT_CLIENTS_JSON);
    const clients = clientStorage.state?.clients || [];
    
    console.log(`\n📦 Found ${clients.length} clients to seed`);
    
    if (clients.length > 0) {
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
    console.log('✅ Everyone will now see the same data you currently see');
    console.log('✅ All changes will sync in real-time across all users');

  } catch (error) {
    console.error('❌ Error:', error);
    console.log('\n⚠️  Make sure you:');
    console.log('   1. Pasted the JSON data correctly');
    console.log('   2. Applied the SQL migration first');
  }
}

seedFromLocalStorage().catch(console.error);

