/**
 * Apply SQL migration directly to Supabase
 */

import { readFileSync } from 'fs';
import { join } from 'path';

const SUPABASE_URL = 'https://ddtdyacwcaihupjkswoy.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdGR5YWN3Y2FpaHVwamtzd295Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzM3NzEzOCwiZXhwIjoyMDc4OTUzMTM4fQ.2iAhhev0QfPve8jg6dXAAoROCxcx9zdKZ_LjZoZ39Rg';

async function applyMigration() {
  console.log('📝 Reading migration file...');
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  
  console.log('📤 Applying migration to Supabase...');
  
  // Split into individual statements
  const statements = migrationSQL
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--') && !s.includes('ALTER PUBLICATION'));
  
  // Execute via PostgREST using the REST API
  // We'll use the Supabase REST API to execute SQL via rpc
  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];
    if (!statement) continue;
    
    console.log(`Executing statement ${i + 1}/${statements.length}...`);
    
    try {
      // Use the REST API to execute SQL
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_SERVICE_KEY,
          'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({ sql: statement + ';' }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.log(`⚠️  Statement ${i + 1} may need manual execution`);
        console.log(`   SQL: ${statement.substring(0, 100)}...`);
        console.log(`   Error: ${errorText}`);
      } else {
        console.log(`✅ Statement ${i + 1} executed`);
      }
    } catch (error) {
      console.log(`⚠️  Error executing statement ${i + 1}:`, error);
    }
  }
  
  console.log('\n✅ Migration application attempted');
  console.log('⚠️  If some statements failed, please run them manually in Supabase SQL Editor');
  console.log('   URL: https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new');
}

// Since direct SQL execution via REST API is limited, let's create tables using the REST API
async function createTablesViaAPI() {
  console.log('📝 Creating tables via Supabase REST API...');
  
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  
  // Try to create tables by attempting to insert and catching the error
  // This won't work, so we need to use SQL directly
  
  // Instead, let's output the SQL for manual execution
  console.log('\n📋 SQL Migration to apply manually:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const migrationPath = join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
  const migrationSQL = readFileSync(migrationPath, 'utf-8');
  console.log(migrationSQL);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n📍 Go to: https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new');
  console.log('   Copy the SQL above and execute it\n');
}

createTablesViaAPI().catch(console.error);

