// Simple Export Script - Copy and paste this into browser console
// No clipboard errors - just logs the data for you to copy

(function() {
  console.log('%c📦 Exporting Figma Data...', 'color: #0A61C4; font-size: 16px; font-weight: bold;');
  
  // Export invoices
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
  
  // Export clients
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
  
  // Create export object
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
  
  console.log('%c📋 COPY THE JSON BELOW:', 'color: #EF4444; font-size: 16px; font-weight: bold; background: yellow; padding: 5px;');
  console.log('%c(Select the text below and copy it manually)', 'color: #666; font-size: 12px;');
  
  const jsonOutput = JSON.stringify(exportData, null, 2);
  console.log(jsonOutput);
  
  console.log('%c✅ Done! Now copy the JSON above and paste it into the export tool.', 'color: #10B981; font-size: 14px; font-weight: bold;');
  
  return exportData;
})();

