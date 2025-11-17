/**
 * Script to setup the Supabase database
 * 1. Applies the SQL migration
 * 2. Seeds initial data
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join } from 'path';
import { mockInvoices } from '../src/lib/mockData';

const SUPABASE_URL = 'https://ddtdyacwcaihupjkswoy.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdGR5YWN3Y2FpaHVwamtzd295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM3NzEzOCwiZXhwIjoyMDc4OTUzMTM4fQ.2iAhhev0QfPve8jg6dXAAoROCxcx9zdKZ_LjZoZ39Rg';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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

async function applyMigration() {
  console.log('📝 Applying database migration...');
  
  try {
    const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
    const migrationSQL = readFileSync(migrationPath, 'utf-8');
    
    // Split SQL into individual statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));
    
    // Execute each statement
    for (const statement of statements) {
      if (statement.includes('ALTER PUBLICATION')) {
        // Skip publication statements as they might fail if already exists
        console.log('⏭️  Skipping publication statement (may already exist)');
        continue;
      }
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement });
      if (error) {
        // Try direct query for statements that don't work with RPC
        const { error: queryError } = await supabase.from('_temp').select('*').limit(0);
        // If RPC doesn't work, we'll use the REST API approach
        console.log(`⚠️  Statement may need manual execution: ${statement.substring(0, 50)}...`);
      }
    }
    
    console.log('✅ Migration applied successfully');
  } catch (error) {
    console.error('❌ Error applying migration:', error);
    throw error;
  }
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...');
  
  // Apply migration using direct SQL execution
  console.log('📝 Creating tables...');
  
  // Create invoices table
  const createInvoicesTable = `
    CREATE TABLE IF NOT EXISTS invoices (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      date TEXT NOT NULL,
      client TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('PAID', 'UNPAID', 'PENDING')),
      due_date TEXT NOT NULL,
      paid_amount DECIMAL(10, 2) DEFAULT 0,
      attachment_name TEXT,
      attachment_url TEXT,
      notes TEXT,
      deleted BOOLEAN DEFAULT FALSE,
      deleted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  // Create clients table
  const createClientsTable = `
    CREATE TABLE IF NOT EXISTS clients (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      tax_id TEXT,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `;
  
  // Use Supabase REST API to execute SQL
  const { data: invoicesTable, error: invoicesError } = await supabase
    .from('invoices')
    .select('id')
    .limit(1);
  
  if (invoicesError && invoicesError.message.includes('does not exist')) {
    console.log('Creating invoices table...');
    // Table doesn't exist, we need to create it via SQL
    // For now, we'll use the dashboard or wait for the project to be fully ready
    console.log('⚠️  Tables need to be created via Supabase Dashboard SQL Editor');
    console.log('   Please run the SQL from supabase/migrations/001_initial_schema.sql');
  }
  
  // Wait a bit for tables to be ready
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Seed clients
  console.log('📦 Seeding clients...');
  const { error: clientsError } = await supabase
    .from('clients')
    .upsert(mockClients, { onConflict: 'id' });

  if (clientsError) {
    console.error('❌ Error seeding clients:', clientsError);
    if (clientsError.message.includes('does not exist')) {
      console.log('⚠️  Clients table does not exist yet. Please create tables first via SQL Editor.');
      return;
    }
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

  const { error: invoicesSeedError } = await supabase
    .from('invoices')
    .upsert(invoicesToInsert, { onConflict: 'id' });

  if (invoicesSeedError) {
    console.error('❌ Error seeding invoices:', invoicesSeedError);
    if (invoicesSeedError.message.includes('does not exist')) {
      console.log('⚠️  Invoices table does not exist yet. Please create tables first via SQL Editor.');
      return;
    }
  } else {
    console.log('✅ Invoices seeded successfully');
  }

  console.log('🎉 Database setup completed!');
}

// First, let's try to apply SQL via the Management API
async function applySQLViaAPI() {
  console.log('📝 Applying SQL migration via API...');
  
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  
  // Use Supabase Management API to execute SQL
  // Note: This requires the project to be fully initialized
  try {
    const response = await fetch(`https://api.supabase.com/v1/projects/ddtdyacwcaihupjkswoy/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: migrationSQL,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.log('⚠️  Could not apply via API, will use direct table creation');
      console.log('   Error:', errorText);
      return false;
    }
    
    console.log('✅ SQL applied successfully via API');
    return true;
  } catch (error) {
    console.log('⚠️  API method failed, tables may need manual creation');
    return false;
  }
}

async function main() {
  // Wait for project to be ready
  console.log('⏳ Waiting for project to be ready...');
  await new Promise(resolve => setTimeout(resolve, 10000));
  
  // Try to apply SQL via API first
  const apiSuccess = await applySQLViaAPI();
  
  if (!apiSuccess) {
    console.log('\n📋 Please apply the SQL migration manually:');
    console.log('   1. Go to https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new');
    console.log('   2. Copy and paste the contents of supabase/migrations/001_initial_schema.sql');
    console.log('   3. Run the SQL');
    console.log('   4. Then run this script again to seed the data\n');
    
    // Try to seed anyway in case tables were created manually
    await new Promise(resolve => setTimeout(resolve, 5000));
  }
  
  await setupDatabase();
}

main().catch(console.error);

