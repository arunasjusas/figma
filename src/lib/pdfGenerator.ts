import type { Invoice } from './mockData';
import { formatCurrency, formatDate } from './utils';

/**
 * Generate and download invoice PDF
 * Creates a styled HTML document and converts it to PDF for download
 */
export function generateInvoicePDF(invoice: Invoice): void {
  // Create HTML content
  const htmlContent = generateInvoiceHTML(invoice);
  
  // Create a blob from the HTML
  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  
  // Create a temporary link and trigger download
  const link = document.createElement('a');
  link.href = url;
  link.download = `Saskaita_${invoice.number}_${invoice.client.replace(/\s+/g, '_')}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Generate HTML content for the invoice
 */
function generateInvoiceHTML(invoice: Invoice): string {
  return `
    <!DOCTYPE html>
    <html lang="lt">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Sąskaita ${invoice.number}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: Arial, sans-serif;
          padding: 40px;
          color: #333;
          line-height: 1.6;
        }
        
        .header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
        }
        
        .header h1 {
          color: #2563eb;
          font-size: 32px;
          margin-bottom: 10px;
        }
        
        .header .invoice-number {
          font-size: 18px;
          color: #666;
        }
        
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        }
        
        .info-block {
          flex: 1;
        }
        
        .info-block h3 {
          color: #2563eb;
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 10px;
          letter-spacing: 1px;
        }
        
        .info-block p {
          margin: 5px 0;
          font-size: 14px;
        }
        
        .info-block .value {
          font-weight: bold;
          font-size: 16px;
        }
        
        .details-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        
        .details-table th {
          background-color: #2563eb;
          color: white;
          padding: 12px;
          text-align: left;
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .details-table td {
          padding: 12px;
          border-bottom: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        .details-table tr:last-child td {
          border-bottom: none;
        }
        
        .summary {
          margin-top: 40px;
          text-align: right;
        }
        
        .summary-row {
          display: flex;
          justify-content: flex-end;
          margin: 10px 0;
          font-size: 16px;
        }
        
        .summary-label {
          margin-right: 20px;
          color: #666;
        }
        
        .summary-value {
          font-weight: bold;
          min-width: 150px;
          text-align: right;
        }
        
        .total-row {
          border-top: 2px solid #2563eb;
          padding-top: 15px;
          margin-top: 15px;
        }
        
        .total-row .summary-value {
          color: #2563eb;
          font-size: 24px;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .status-paid {
          background-color: #d1fae5;
          color: #065f46;
        }
        
        .status-unpaid {
          background-color: #fee2e2;
          color: #991b1b;
        }
        
        .status-pending {
          background-color: #dbeafe;
          color: #1e40af;
        }
        
        .notes {
          margin-top: 40px;
          padding: 20px;
          background-color: #f9fafb;
          border-left: 4px solid #2563eb;
        }
        
        .notes h3 {
          color: #2563eb;
          font-size: 14px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        
        .notes p {
          font-size: 14px;
          color: #666;
          white-space: pre-wrap;
        }
        
        .footer {
          margin-top: 60px;
          text-align: center;
          color: #999;
          font-size: 12px;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
        
        @media print {
          body {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>SĄSKAITA FAKTŪRA</h1>
        <div class="invoice-number">Nr. ${invoice.number}</div>
      </div>
      
      <div class="info-section">
        <div class="info-block">
          <h3>Užsakovas</h3>
          <p class="value">${invoice.client}</p>
        </div>
        
        <div class="info-block">
          <h3>Datos</h3>
          <p><strong>Išrašymo data:</strong> ${formatDate(invoice.date)}</p>
          <p><strong>Apmokėjimo terminas:</strong> ${formatDate(invoice.dueDate)}</p>
        </div>
        
        <div class="info-block">
          <h3>Statusas</h3>
          <p>
            <span class="status-badge status-${invoice.status}">
              ${getStatusLabel(invoice.status)}
            </span>
          </p>
        </div>
      </div>
      
      <table class="details-table">
        <thead>
          <tr>
            <th>Aprašymas</th>
            <th style="text-align: right;">Suma</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Paslaugos pagal sutartį</td>
            <td style="text-align: right;">${formatCurrency(invoice.amount)}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="summary">
        <div class="summary-row">
          <span class="summary-label">Suma be PVM:</span>
          <span class="summary-value">${formatCurrency(invoice.amount / 1.21)}</span>
        </div>
        <div class="summary-row">
          <span class="summary-label">PVM (21%):</span>
          <span class="summary-value">${formatCurrency(invoice.amount - invoice.amount / 1.21)}</span>
        </div>
        <div class="summary-row total-row">
          <span class="summary-label">Bendra suma:</span>
          <span class="summary-value">${formatCurrency(invoice.amount)}</span>
        </div>
        ${invoice.paidAmount !== undefined ? `
          <div class="summary-row" style="margin-top: 20px;">
            <span class="summary-label">Sumokėta:</span>
            <span class="summary-value" style="color: #059669;">${formatCurrency(invoice.paidAmount)}</span>
          </div>
          <div class="summary-row">
            <span class="summary-label">Likusi suma:</span>
            <span class="summary-value" style="color: #dc2626;">${formatCurrency(invoice.amount - invoice.paidAmount)}</span>
          </div>
        ` : ''}
      </div>
      
      ${invoice.notes ? `
        <div class="notes">
          <h3>Pastabos</h3>
          <p>${invoice.notes}</p>
        </div>
      ` : ''}
      
      <div class="footer">
        <p>Sąskaita sugeneruota automatiškai • ${new Date().toLocaleDateString('lt-LT')}</p>
      </div>
      
      <script>
        // Auto-print when page loads
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;
}

/**
 * Get status label in Lithuanian
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'PAID': 'Apmokėta',
    'paid': 'Apmokėta',
    'UNPAID': 'Pradelsta',
    'unpaid': 'Pradelsta',
    'PENDING': 'Terminas nepasibaigęs',
    'pending': 'Terminas nepasibaigęs',
  };
  return labels[status] || status;
}

