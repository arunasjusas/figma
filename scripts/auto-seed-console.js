// ============================================
// AUTO SEED TO SUPABASE - CONSOLE SCRIPT
// ============================================
// 
// INSTRUCTIONS:
// 1. Go to: https://figma-xi-seven.vercel.app/
// 2. Open browser console (F12 → Console tab)
// 3. Copy and paste this ENTIRE script
// 4. Press Enter
// 5. Wait for "✅ Done!" message
//
// ============================================

(function() {
  const SUPABASE_URL = 'https://ddtdyacwcaihupjkswoy.supabase.co';
  const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdGR5YWN3Y2FpaHVwamtzd295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM3NzEzOCwiZXhwIjoyMDc4OTUzMTM4fQ.2iAhhev0QfPve8jg6dXAAoROCxcx9zdKZ_LjZoZ39Rg';

  console.log('%c🚀 AUTO SEED TO SUPABASE', 'color: #0A61C4; font-size: 20px; font-weight: bold;');
  console.log('%cReading localStorage and seeding to Supabase...', 'color: #666; font-size: 14px;');

  // Read localStorage
  const invoiceStorage = localStorage.getItem('invoice-storage');
  const clientStorage = localStorage.getItem('client-storage');
  
  let invoices = [];
  let clients = [];
  
  if (invoiceStorage) {
    try {
      const parsed = JSON.parse(invoiceStorage);
      invoices = parsed.state?.invoices || [];
      console.log(`✅ Found ${invoices.length} invoices`);
    } catch (e) {
      console.error('❌ Error parsing invoices:', e);
    }
  }
  
  if (clientStorage) {
    try {
      const parsed = JSON.parse(clientStorage);
      clients = parsed.state?.clients || [];
      console.log(`✅ Found ${clients.length} clients`);
    } catch (e) {
      console.error('❌ Error parsing clients:', e);
    }
  }
  
  if (invoices.length === 0 && clients.length === 0) {
    console.error('%c❌ No data found in localStorage!', 'color: #EF4444; font-size: 16px; font-weight: bold;');
    console.log('Make sure you are on https://figma-xi-seven.vercel.app/');
    return;
  }
  
  console.log(`%c📊 Summary: ${invoices.length} invoices, ${clients.length} clients`, 'color: #10B981; font-size: 14px; font-weight: bold;');
  console.log('%c⏳ Seeding to Supabase...', 'color: #F59E0B; font-size: 14px;');
  
  // Seed function
  async function seed() {
    try {
      // Seed invoices
      if (invoices.length > 0) {
        console.log('📄 Seeding invoices...');
        const invoicesToInsert = invoices.map((invoice) => ({
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
        
        const invoicesResponse = await fetch(`${SUPABASE_URL}/rest/v1/invoices`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify(invoicesToInsert),
        });
        
        if (!invoicesResponse.ok) {
          const error = await invoicesResponse.text();
          throw new Error(`Invoices: ${error}`);
        }
        console.log(`✅ Seeded ${invoices.length} invoices`);
      }
      
      // Seed clients
      if (clients.length > 0) {
        console.log('📦 Seeding clients...');
        const clientsToInsert = clients.map((client) => ({
          id: client.id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          address: client.address || null,
          tax_id: client.taxId || null,
          notes: client.notes || null,
        }));
        
        const clientsResponse = await fetch(`${SUPABASE_URL}/rest/v1/clients`, {
          method: 'POST',
          headers: {
            'apikey': SUPABASE_SERVICE_KEY,
            'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify(clientsToInsert),
        });
        
        if (!clientsResponse.ok) {
          const error = await clientsResponse.text();
          throw new Error(`Clients: ${error}`);
        }
        console.log(`✅ Seeded ${clients.length} clients`);
      }
      
      console.log('%c🎉 SUCCESS!', 'color: #10B981; font-size: 20px; font-weight: bold;');
      console.log('%c✅ All data has been seeded to Supabase!', 'color: #10B981; font-size: 16px;');
      console.log('%c✅ Everyone will now see the same data with real-time sync!', 'color: #10B981; font-size: 14px;');
      console.log('%c📍 Refresh the page to see your data from Supabase', 'color: #0A61C4; font-size: 14px;');
      
    } catch (error) {
      console.error('%c❌ ERROR:', 'color: #EF4444; font-size: 16px; font-weight: bold;');
      console.error(error);
      
      if (error.message.includes('does not exist') || error.message.includes('PGRST205')) {
        console.log('%c⚠️  Tables do not exist yet!', 'color: #F59E0B; font-size: 14px; font-weight: bold;');
        console.log('%cPlease apply the SQL migration first:', 'color: #F59E0B; font-size: 14px;');
        console.log('1. Go to: https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new');
        console.log('2. Copy SQL from: supabase/migrations/001_initial_schema.sql');
        console.log('3. Run the SQL');
        console.log('4. Then run this script again');
      }
    }
  }
  
  // Run seed
  seed();
})();

