/**
 * Apply SQL directly using Supabase Management API
 */

const SUPABASE_PROJECT_REF = 'ddtdyacwcaihupjkswoy';
const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || '';

const SQL = `-- Create invoices table
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

-- Create clients table
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

-- Enable Row Level Security (RLS) - allow all operations for now
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (public access for shared data)
CREATE POLICY "Allow all operations on invoices" ON invoices
  FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on clients" ON clients
  FOR ALL USING (true) WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_invoices_deleted ON invoices(deleted);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE invoices;
ALTER PUBLICATION supabase_realtime ADD TABLE clients;`;

async function applySQL() {
  console.log('📝 Applying SQL migration...');
  console.log('\n⚠️  Since direct API execution is limited, please:');
  console.log('   1. Go to: https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new');
  console.log('   2. Copy and paste the SQL below');
  console.log('   3. Click "Run"\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(SQL);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

applySQL();

