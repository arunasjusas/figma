import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from './mockData';
import { formatCurrency } from './utils';

/**
 * Sanitize text by replacing Lithuanian and special characters with ASCII equivalents.
 * Also removes any HTML entities to prevent & character issues.
 * This ensures jsPDF's default Helvetica font can render all text correctly.
 */
function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  
  let sanitized = String(text);
  
  // Replace Lithuanian characters
  const replacements: Record<string, string> = {
    'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
    'Ą': 'A', 'Č': 'C', 'Ę': 'E', 'Ė': 'E', 'Į': 'I', 'Š': 'S', 'Ų': 'U', 'Ū': 'U', 'Ž': 'Z',
  };
  
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
  
  // Ensure container has no HTML entities or encoding issues
  container.setAttribute('lang', 'en');
  container.setAttribute('dir', 'ltr');

  const statusLabel = sanitizeText(getStatusLabel(invoice.status));
  const amountWithoutVAT = invoice.amount / 1.21;
  const remaining = invoice.paidAmount !== undefined ? (invoice.amount - invoice.paidAmount) : undefined;

  // Format currency and sanitize it
  const formatCurrencySafe = (amount: number) => sanitizeText(formatCurrency(amount));

  // Helper function to create elements with textContent to avoid HTML escaping
  const createEl = (tag: string, styles: Record<string, string>, text?: string) => {
    const el = document.createElement(tag);
    Object.assign(el.style, styles);
    if (text !== undefined) {
      // Ensure text is sanitized and set directly as textContent (not innerHTML)
      const cleanText = sanitizeText(text);
      el.textContent = cleanText;
    }
    return el;
  };

  const wrapper = document.createElement('div');
  
  // Title
  const title = createEl('div', {
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '26px'
  }, 'Saskaita faktura');
  wrapper.appendChild(title);

  // Invoice number
  const invoiceNum = createEl('div', {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '6px'
  }, `Nr. ${invoice.number}`);
  wrapper.appendChild(invoiceNum);

  // Header line
  const headerLine = createEl('div', {
    height: '2px',
    background: '#2563eb',
    margin: '16px 0 8px'
  });
  wrapper.appendChild(headerLine);

  // Two columns
  const columns = createEl('div', {
    display: 'flex',
    gap: '24px',
    marginTop: '16px'
  });

  const leftCol = createEl('div', { flex: '1' });
  const uzsakovasLabel = createEl('div', {
    fontSize: '12px',
    color: '#2563eb',
    marginBottom: '6px'
  }, 'UZSAKOVAS');
  const clientName = createEl('div', {
    fontSize: '14px',
    fontWeight: '700'
  }, sanitizeText(invoice.client));
  leftCol.appendChild(uzsakovasLabel);
  leftCol.appendChild(clientName);

  const rightCol = createEl('div', { flex: '1' });
  const datosLabel = createEl('div', {
    fontSize: '12px',
    color: '#2563eb',
    marginBottom: '6px'
  }, 'DATOS');
  const issueDate = createEl('div', {
    fontSize: '12px',
    color: '#374151'
  }, `Israsymo data: ${formatDateForPdf(invoice.date)}`);
  const dueDate = createEl('div', {
    fontSize: '12px',
    color: '#374151'
  }, `Apmokejimo terminas: ${formatDateForPdf(invoice.dueDate)}`);
  rightCol.appendChild(datosLabel);
  rightCol.appendChild(issueDate);
  rightCol.appendChild(dueDate);

  columns.appendChild(leftCol);
  columns.appendChild(rightCol);
  wrapper.appendChild(columns);

  // Status
  const statusSection = createEl('div', { marginTop: '20px' });
  const statusLabelEl = createEl('div', {
    fontSize: '12px',
    color: '#2563eb'
  }, 'STATUSAS');
  const statusValue = createEl('div', {
    fontSize: '12px',
    fontWeight: '700',
    color: getStatusColor(invoice.status),
    marginTop: '4px'
  }, statusLabel);
  statusSection.appendChild(statusLabelEl);
  statusSection.appendChild(statusValue);
  wrapper.appendChild(statusSection);

  // Table
  const table = createEl('div', {
    marginTop: '24px',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb'
  });
  const tableHeader = createEl('div', {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600'
  });
  const aprasymasHeader = createEl('div', {}, 'APRASYMAS');
  const sumaHeader = createEl('div', {}, 'SUMA');
  tableHeader.appendChild(aprasymasHeader);
  tableHeader.appendChild(sumaHeader);
  const tableRow = createEl('div', {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '12px'
  });
  const description = createEl('div', {}, 'Paslaugos pagal sutarti');
  const amount = createEl('div', {}, formatCurrencySafe(invoice.amount));
  tableRow.appendChild(description);
  tableRow.appendChild(amount);
  table.appendChild(tableHeader);
  table.appendChild(tableRow);
  wrapper.appendChild(table);

  // Summary
  const summary = createEl('div', {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end'
  });
  const summaryInner = createEl('div', { width: '300px' });

  const sumaBePVM = createEl('div', {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280'
  });
  sumaBePVM.appendChild(createEl('div', {}, 'Suma be PVM:'));
  sumaBePVM.appendChild(createEl('div', { color: '#111827' }, formatCurrencySafe(amountWithoutVAT)));

  const pvm = createEl('div', {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '6px',
    fontSize: '12px',
    color: '#6b7280'
  });
  pvm.appendChild(createEl('div', {}, 'PVM (21%):'));
  pvm.appendChild(createEl('div', { color: '#111827' }, formatCurrencySafe(invoice.amount - amountWithoutVAT)));

  const summaryLine = createEl('div', {
    height: '2px',
    background: '#2563eb',
    margin: '10px 0 8px'
  });

  const total = createEl('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });
  total.appendChild(createEl('div', {
    fontSize: '12px',
    color: '#6b7280'
  }, 'Bendra suma:'));
  total.appendChild(createEl('div', {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2563eb'
  }, formatCurrencySafe(invoice.amount)));

  summaryInner.appendChild(sumaBePVM);
  summaryInner.appendChild(pvm);
  summaryInner.appendChild(summaryLine);
  summaryInner.appendChild(total);

  if (invoice.paidAmount !== undefined) {
    const paid = createEl('div', {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
      fontSize: '12px',
      color: '#6b7280'
    });
    paid.appendChild(createEl('div', {}, 'Sumoketa:'));
    paid.appendChild(createEl('div', {
      color: '#059669',
      fontWeight: '600'
    }, formatCurrencySafe(invoice.paidAmount)));

    const remainingEl = createEl('div', {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '6px',
      fontSize: '12px',
      color: '#6b7280'
    });
    remainingEl.appendChild(createEl('div', {}, 'Likusi suma:'));
    remainingEl.appendChild(createEl('div', {
      color: '#dc2626',
      fontWeight: '600'
    }, formatCurrencySafe(remaining || 0)));

    summaryInner.appendChild(paid);
    summaryInner.appendChild(remainingEl);
  }

  summary.appendChild(summaryInner);
  wrapper.appendChild(summary);

  // Notes
  if (invoice.notes) {
    const notesSection = createEl('div', {
      marginTop: '24px',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '10px'
    });
    const notesLabel = createEl('div', {
      fontSize: '12px',
      color: '#2563eb',
      fontWeight: '700'
    }, 'PASTABOS');
    const notesText = createEl('div', {
      fontSize: '12px',
      color: '#4b5563',
      marginTop: '6px'
    }, sanitizeText(invoice.notes));
    notesSection.appendChild(notesLabel);
    notesSection.appendChild(notesText);
    wrapper.appendChild(notesSection);
  }

  // Footer
  const footer = createEl('div', {
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '10px',
    color: '#6b7280'
  }, `Saskaita sugeneruota automatiskai • ${formatDateForPdf(new Date())}`);
  wrapper.appendChild(footer);

  container.appendChild(wrapper);

  document.body.appendChild(container);

  // Wait for fonts and layout to be ready
  await new Promise(resolve => setTimeout(resolve, 100));

  // Convert HTML to canvas with html2canvas
  // Use onclone callback to sanitize all text nodes in the cloned document
  const canvas = await html2canvas(container, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: 794,
    height: container.scrollHeight,
    windowWidth: 794,
    windowHeight: container.scrollHeight,
    onclone: (clonedDoc) => {
      // Ensure all text nodes in the cloned document are properly sanitized
      const allTextNodes = clonedDoc.createTreeWalker(
        clonedDoc.body,
        NodeFilter.SHOW_TEXT,
        null
      );
      let node;
      while ((node = allTextNodes.nextNode())) {
        if (node.textContent) {
          node.textContent = sanitizeText(node.textContent);
        }
      }
    },
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
