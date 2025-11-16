import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from './mockData';
import { formatCurrency, formatDate } from './utils';

/**
 * Sanitize text by replacing Lithuanian and special characters with ASCII equivalents.
 * This ensures jsPDF's default Helvetica font can render all text correctly.
 */
function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  
  const replacements: Record<string, string> = {
    'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
    'Ą': 'A', 'Č': 'C', 'Ę': 'E', 'Ė': 'E', 'Į': 'I', 'Š': 'S', 'Ų': 'U', 'Ū': 'U', 'Ž': 'Z',
  };
  
  let sanitized = String(text);
  for (const [original, replacement] of Object.entries(replacements)) {
    sanitized = sanitized.replace(new RegExp(original, 'g'), replacement);
  }
  
  return sanitized;
}

/**
 * Simple date formatter for PDFs that avoids locale-specific characters.
 * Returns date as YYYY-MM-DD so jsPDF doesn't need to handle Lithuanian letters.
 */
function formatDateForPdf(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Generate and download invoice as PDF using HTML rendering.
 * We render a styled HTML template, convert it to canvas with html2canvas,
 * then add the canvas image to PDF. This preserves Lithuanian characters.
 */
export async function generateInvoicePDF(invoice: Invoice): Promise<void> {
  // Offscreen container for HTML content (A4 ~ 794px width at 96dpi)
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#ffffff';
  container.style.padding = '32px';
  container.style.fontFamily = 'system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif';
  container.style.color = '#111827';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.5';

  const statusLabel = getStatusLabel(invoice.status);
  const amountWithoutVAT = invoice.amount / 1.21;
  const remaining = invoice.paidAmount !== undefined ? (invoice.amount - invoice.paidAmount) : undefined;

  container.innerHTML = `
    <div>
      <div style="text-align:center; color:#2563eb; font-weight:700; font-size:26px;">
        Sąskaita faktūra
      </div>
      <div style="text-align:center; color:#6b7280; margin-top:6px;">
        Nr. ${invoice.number}
      </div>
      <div style="height:2px; background:#2563eb; margin:16px 0 8px;"></div>

      <div style="display:flex; gap:24px; margin-top:16px;">
        <div style="flex:1;">
          <div style="font-size:12px; color:#2563eb; margin-bottom:6px;">UŽSAKOVAS</div>
          <div style="font-size:14px; font-weight:700;">${invoice.client}</div>
        </div>
        <div style="flex:1;">
          <div style="font-size:12px; color:#2563eb; margin-bottom:6px;">DATOS</div>
          <div style="font-size:12px; color:#374151;">Išrašymo data: ${formatDate(invoice.date)}</div>
          <div style="font-size:12px; color:#374151;">Apmokėjimo terminas: ${formatDate(invoice.dueDate)}</div>
        </div>
      </div>

      <div style="margin-top:20px;">
        <div style="font-size:12px; color:#2563eb;">STATUSAS</div>
        <div style="font-size:12px; font-weight:700; color:${getStatusColor(invoice.status)}; margin-top:4px;">
          ${statusLabel}
        </div>
      </div>

      <div style="margin-top:24px; border-radius:4px; overflow:hidden; border:1px solid #e5e7eb;">
        <div style="display:flex; justify-content:space-between; padding:8px 12px; background:#2563eb; color:#ffffff; font-weight:600;">
          <div>APRAŠYMAS</div>
          <div>SUMA</div>
        </div>
        <div style="display:flex; justify-content:space-between; padding:10px 12px; border-top:1px solid #e5e7eb; font-size:12px;">
          <div>Paslaugos pagal sutartį</div>
          <div>${formatCurrency(invoice.amount)}</div>
        </div>
      </div>

      <div style="margin-top:24px; display:flex; justify-content:flex-end;">
        <div style="width:300px;">
          <div style="display:flex; justify-content:space-between; font-size:12px; color:#6b7280;">
            <div>Suma be PVM:</div>
            <div style="color:#111827;">${formatCurrency(amountWithoutVAT)}</div>
          </div>
          <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:12px; color:#6b7280;">
            <div>PVM (21%):</div>
            <div style="color:#111827;">${formatCurrency(invoice.amount - amountWithoutVAT)}</div>
          </div>
          <div style="height:2px; background:#2563eb; margin:10px 0 8px;"></div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="font-size:12px; color:#6b7280;">Bendra suma:</div>
            <div style="font-size:16px; font-weight:700; color:#2563eb;">${formatCurrency(invoice.amount)}</div>
          </div>
          ${
            invoice.paidAmount !== undefined
              ? `<div style="display:flex; justify-content:space-between; margin-top:10px; font-size:12px; color:#6b7280;">
                   <div>Sumokėta:</div>
                   <div style="color:#059669; font-weight:600;">${formatCurrency(invoice.paidAmount)}</div>
                 </div>
                 <div style="display:flex; justify-content:space-between; margin-top:6px; font-size:12px; color:#6b7280;">
                   <div>Likusi suma:</div>
                   <div style="color:#dc2626; font-weight:600;">${formatCurrency(remaining || 0)}</div>
                 </div>`
              : ''
          }
        </div>
      </div>

      ${
        invoice.notes
          ? `<div style="margin-top:24px; border-top:1px solid #e5e7eb; padding-top:10px;">
               <div style="font-size:12px; color:#2563eb; font-weight:700;">PASTABOS</div>
               <div style="font-size:12px; color:#4b5563; margin-top:6px;">${invoice.notes}</div>
             </div>`
          : ''
      }

      <div style="text-align:center; margin-top:40px; font-size:10px; color:#6b7280;">
        Sąskaita sugeneruota automatiškai • ${formatDateForPdf(new Date())}
      </div>
    </div>
  `;

  document.body.appendChild(container);

  // Wait for fonts and layout to be ready
  await new Promise(resolve => setTimeout(resolve, 100));

  // Convert HTML to canvas with html2canvas
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: 794,
    height: container.scrollHeight,
    windowWidth: 794,
    windowHeight: container.scrollHeight,
  });

  // Remove container from DOM
  document.body.removeChild(container);

  // Create PDF and add canvas image
  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // If content is taller than one page, split across pages
  const pageHeight = 297; // A4 height in mm
  let heightLeft = imgHeight;
  let position = 0;

  doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    doc.addPage();
    doc.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  const filename = `Saskaita_${invoice.number}_${sanitizeText(invoice.client).replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}

/**
 * Get status label in Lithuanian (will be sanitized before rendering)
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

/**
 * Get status color
 */
function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'PAID': '#059669',
    'paid': '#059669',
    'UNPAID': '#dc2626',
    'unpaid': '#dc2626',
    'PENDING': '#2563eb',
    'pending': '#2563eb',
  };
  return colors[status] || '#666666';
}
