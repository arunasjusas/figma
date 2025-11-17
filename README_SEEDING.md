# How to Seed Your Current Data to Supabase

This guide will help you export your current localStorage data and seed it to Supabase so everyone sees the same data.

## 🚀 Quick Steps

### Step 1: Apply SQL Migration (If Not Done Yet)

1. Go to: https://supabase.com/dashboard/project/ddtdyacwcaihupjkswoy/sql/new
2. Copy the SQL from `supabase/migrations/001_initial_schema.sql`
3. Paste and click "Run"

### Step 2: Export Your Current Data

**Option A: Using the HTML Tool (Easiest)**

1. Open `scripts/export-data.html` in your browser
2. Follow the instructions on the page
3. It will generate a seed script for you

**Option B: Using Browser Console**

1. Open https://figma-xi-seven.vercel.app/ in your browser
2. Press F12 to open Developer Tools
3. Go to the Console tab
4. Copy and paste this script:

```javascript
// Export Figma Data Script
(function() {
  console.log('%c📦 Exporting Figma Data...', 'color: #0A61C4; font-size: 16px; font-weight: bold;');
  
  const invoiceStorage = localStorage.getItem('invoice-storage');
  let invoices = [];
  if (invoiceStorage) {
    try {
      const parsed = JSON.parse(invoiceStorage);
      invoices = parsed.state?.invoices || [];
      console.log(`✅ Found ${invoices.length} invoices`);
    } catch (e) {
      console.error('❌ Error parsing invoices:', e);
    }
  }
  
  const clientStorage = localStorage.getItem('client-storage');
  let clients = [];
  if (clientStorage) {
    try {
      const parsed = JSON.parse(clientStorage);
      clients = parsed.state?.clients || [];
      console.log(`✅ Found ${clients.length} clients`);
    } catch (e) {
      console.error('❌ Error parsing clients:', e);
    }
  }
  
  const exportData = {
    invoices: invoices,
    clients: clients,
    exportedAt: new Date().toISOString(),
    totalInvoices: invoices.length,
    activeInvoices: invoices.filter(i => !i.deleted).length,
    deletedInvoices: invoices.filter(i => i.deleted).length,
    totalClients: clients.length
  };
  
  console.log('%c📊 Export Summary:', 'color: #10B981; font-size: 14px; font-weight: bold;');
  console.log(`   Total Invoices: ${exportData.totalInvoices}`);
  console.log(`   Active: ${exportData.activeInvoices}`);
  console.log(`   Deleted: ${exportData.deletedInvoices}`);
  console.log(`   Total Clients: ${exportData.totalClients}`);
  
  console.log('%c📋 Copy the JSON below:', 'color: #EF4444; font-size: 14px; font-weight: bold;');
  const jsonOutput = JSON.stringify(exportData, null, 2);
  console.log(jsonOutput);
  
  if (navigator.clipboard) {
    navigator.clipboard.writeText(jsonOutput).then(() => {
      console.log('%c✅ Data copied to clipboard!', 'color: #10B981; font-size: 14px; font-weight: bold;');
    });
  }
  
  return exportData;
})();
```

5. Press Enter
6. Copy the JSON output that appears

### Step 3: Update Seed Script

1. Open `scripts/seed-current-data.ts`
2. Find the lines:
   ```typescript
   const invoices: any[] = [];
   const clients: any[] = [];
   ```
3. Replace the empty arrays with your exported data:
   ```typescript
   const invoices: any[] = [/* paste your invoices array here */];
   const clients: any[] = [/* paste your clients array here */];
   ```

### Step 4: Run Seed Script

```bash
npx tsx scripts/seed-current-data.ts
```

## ✅ Verification

After seeding:

1. Visit https://figma-xi-seven.vercel.app/
2. Check that you see all your invoices
3. Check that deleted invoices appear in "Šiukšliadėžė"
4. All users will now see the same data!

## 🔄 Real-Time Sync

Once seeded, all changes will sync in real-time:
- ✅ Create invoice → Everyone sees it instantly
- ✅ Update invoice → Everyone sees the change
- ✅ Delete invoice → Everyone sees it removed
- ✅ Add client → Everyone sees it

## 🐛 Troubleshooting

**Error: "Table does not exist"**
- Make sure you applied the SQL migration first (Step 1)

**Error: "No data to seed"**
- Make sure you pasted your exported data into the seed script

**Data not appearing**
- Clear your browser cache and localStorage
- The app will now load from Supabase, not localStorage

