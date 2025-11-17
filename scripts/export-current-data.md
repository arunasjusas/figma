# Export Current Data Instructions

To ensure everyone sees YOUR current data (not just the 8 mock invoices), you need to:

1. **Open your browser console** on https://figma-xi-seven.vercel.app/
2. **Run this command** to export your current localStorage data:

```javascript
// Export invoices
const invoiceData = localStorage.getItem('invoice-storage');
console.log('INVOICES DATA:');
console.log(JSON.stringify(JSON.parse(invoiceData), null, 2));

// Export clients  
const clientData = localStorage.getItem('client-storage');
console.log('CLIENTS DATA:');
console.log(JSON.stringify(JSON.parse(clientData), null, 2));
```

3. **Copy the output** and share it with me, OR
4. **I can create a script** that reads from your current localStorage and seeds the database

