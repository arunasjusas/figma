import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import type { Invoice } from './mockData';
import { formatCurrency } from './utils';

/**
 * Replace Lithuanian characters with ASCII equivalents for PDF compatibility.
 * Mapping: ą→a, č→c, ę→e, ė→e, į→i, š→s, ų→u, ū→u, ž→z
 */
function replaceLithuanianChars(text: string | null | undefined): string {
  if (!text) return '';
  
  const map: Record<string, string> = {
    'ą': 'a', 'č': 'c', 'ę': 'e', 'ė': 'e', 'į': 'i', 'š': 's', 'ų': 'u', 'ū': 'u', 'ž': 'z',
    'Ą': 'A', 'Č': 'C', 'Ę': 'E', 'Ė': 'E', 'Į': 'I', 'Š': 'S', 'Ų': 'U', 'Ū': 'U', 'Ž': 'Z',
  };
  
  let result = String(text);
  for (const [char, replacement] of Object.entries(map)) {
    result = result.replace(new RegExp(char, 'g'), replacement);
  }
  
  return result;
}

/**
 * Format date as YYYY-MM-DD (no Lithuanian characters)
 */
function formatDateSafe(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format currency and replace Lithuanian characters
 */
function formatCurrencySafe(amount: number): string {
  return replaceLithuanianChars(formatCurrency(amount));
}

/**
 * Get status label with Lithuanian characters replaced
 */
function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    'PAID': 'Apmoketa',
    'paid': 'Apmoketa',
    'UNPAID': 'Pradelsta',
    'unpaid': 'Pradelsta',
    'PENDING': 'Terminas nepasibaiges',
    'pending': 'Terminas nepasibaiges',
  };
  return labels[status] || replaceLithuanianChars(status);
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

/**
 * Generate and download invoice as PDF
 * All Lithuanian characters are replaced with ASCII equivalents (ą→a, č→c, etc.)
 */
export async function generateInvoicePDF(invoice: Invoice): Promise<void> {
  // Create offscreen container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-10000px';
  container.style.top = '0';
  container.style.width = '794px';
  container.style.background = '#ffffff';
  container.style.padding = '32px';
  container.style.fontFamily = 'Arial, Helvetica, sans-serif';
  container.style.color = '#111827';
  container.style.fontSize = '14px';

  // Calculate values
  const statusLabel = getStatusLabel(invoice.status);
  const amountWithoutVAT = invoice.amount / 1.21;
  const vatAmount = invoice.amount - amountWithoutVAT;
  const remaining = invoice.paidAmount !== undefined ? (invoice.amount - invoice.paidAmount) : undefined;

  // Helper to create element with sanitized text
  const el = (tag: string, styles: Record<string, string>, text: string = '') => {
    const elem = document.createElement(tag);
    Object.assign(elem.style, styles);
    elem.textContent = replaceLithuanianChars(text);
    return elem;
  };

  // Build PDF content
  const wrapper = document.createElement('div');

  // Title
  wrapper.appendChild(el('div', {
    textAlign: 'center',
    color: '#2563eb',
    fontWeight: '700',
    fontSize: '26px'
  }, 'Saskaita faktura'));

  // Invoice number
  wrapper.appendChild(el('div', {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: '6px'
  }, `Nr. ${invoice.number}`));

  // Header line
  wrapper.appendChild(el('div', {
    height: '2px',
    background: '#2563eb',
    margin: '16px 0 8px'
  }));

  // Two columns
  const columns = el('div', {
    display: 'flex',
    gap: '24px',
    marginTop: '16px'
  });

  const leftCol = el('div', { flex: '1' });
  leftCol.appendChild(el('div', {
    fontSize: '12px',
    color: '#2563eb',
    marginBottom: '6px'
  }, 'UZSAKOVAS'));
  leftCol.appendChild(el('div', {
    fontSize: '14px',
    fontWeight: '700'
  }, invoice.client));

  const rightCol = el('div', { flex: '1' });
  rightCol.appendChild(el('div', {
    fontSize: '12px',
    color: '#2563eb',
    marginBottom: '6px'
  }, 'DATOS'));
  rightCol.appendChild(el('div', {
    fontSize: '12px',
    color: '#374151'
  }, `Israsymo data: ${formatDateSafe(invoice.date)}`));
  rightCol.appendChild(el('div', {
    fontSize: '12px',
    color: '#374151'
  }, `Apmokejimo terminas: ${formatDateSafe(invoice.dueDate)}`));

  columns.appendChild(leftCol);
  columns.appendChild(rightCol);
  wrapper.appendChild(columns);

  // Status
  const statusSection = el('div', { marginTop: '20px' });
  statusSection.appendChild(el('div', {
    fontSize: '12px',
    color: '#2563eb'
  }, 'STATUSAS'));
  statusSection.appendChild(el('div', {
    fontSize: '12px',
    fontWeight: '700',
    color: getStatusColor(invoice.status),
    marginTop: '4px'
  }, statusLabel));
  wrapper.appendChild(statusSection);

  // Table
  const table = el('div', {
    marginTop: '24px',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb'
  });

  const tableHeader = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 12px',
    background: '#2563eb',
    color: '#ffffff',
    fontWeight: '600'
  });
  tableHeader.appendChild(el('div', {}, 'APRASYMAS'));
  tableHeader.appendChild(el('div', {}, 'SUMA'));

  const tableRow = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderTop: '1px solid #e5e7eb',
    fontSize: '12px'
  });
  tableRow.appendChild(el('div', {}, 'Paslaugos pagal sutarti'));
  tableRow.appendChild(el('div', {}, formatCurrencySafe(invoice.amount)));

  table.appendChild(tableHeader);
  table.appendChild(tableRow);
  wrapper.appendChild(table);

  // Summary
  const summary = el('div', {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'flex-end'
  });
  const summaryInner = el('div', { width: '300px' });

  const sumaBePVM = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: '#6b7280'
  });
  sumaBePVM.appendChild(el('div', {}, 'Suma be PVM:'));
  sumaBePVM.appendChild(el('div', { color: '#111827' }, formatCurrencySafe(amountWithoutVAT)));

  const pvm = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '6px',
    fontSize: '12px',
    color: '#6b7280'
  });
  pvm.appendChild(el('div', {}, 'PVM (21%):'));
  pvm.appendChild(el('div', { color: '#111827' }, formatCurrencySafe(vatAmount)));

  const summaryLine = el('div', {
    height: '2px',
    background: '#2563eb',
    margin: '10px 0 8px'
  });

  const total = el('div', {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  });
  total.appendChild(el('div', {
    fontSize: '12px',
    color: '#6b7280'
  }, 'Bendra suma:'));
  total.appendChild(el('div', {
    fontSize: '16px',
    fontWeight: '700',
    color: '#2563eb'
  }, formatCurrencySafe(invoice.amount)));

  summaryInner.appendChild(sumaBePVM);
  summaryInner.appendChild(pvm);
  summaryInner.appendChild(summaryLine);
  summaryInner.appendChild(total);

  if (invoice.paidAmount !== undefined && remaining !== undefined) {
    const paid = el('div', {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '10px',
      fontSize: '12px',
      color: '#6b7280'
    });
    paid.appendChild(el('div', {}, 'Sumoketa:'));
    paid.appendChild(el('div', {
      color: '#059669',
      fontWeight: '600'
    }, formatCurrencySafe(invoice.paidAmount)));

    const remainingEl = el('div', {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '6px',
      fontSize: '12px',
      color: '#6b7280'
    });
    remainingEl.appendChild(el('div', {}, 'Likusi suma:'));
    remainingEl.appendChild(el('div', {
      color: '#dc2626',
      fontWeight: '600'
    }, formatCurrencySafe(remaining)));

    summaryInner.appendChild(paid);
    summaryInner.appendChild(remainingEl);
  }

  summary.appendChild(summaryInner);
  wrapper.appendChild(summary);

  // Notes
  if (invoice.notes) {
    const notesSection = el('div', {
      marginTop: '24px',
      borderTop: '1px solid #e5e7eb',
      paddingTop: '10px'
    });
    notesSection.appendChild(el('div', {
      fontSize: '12px',
      color: '#2563eb',
      fontWeight: '700'
    }, 'PASTABOS'));
    notesSection.appendChild(el('div', {
      fontSize: '12px',
      color: '#4b5563',
      marginTop: '6px'
    }, invoice.notes));
    wrapper.appendChild(notesSection);
  }

  // Footer
  wrapper.appendChild(el('div', {
    textAlign: 'center',
    marginTop: '40px',
    fontSize: '10px',
    color: '#6b7280'
  }, `Saskaita sugeneruota automatiskai • ${formatDateSafe(new Date())}`));

  container.appendChild(wrapper);
  document.body.appendChild(container);

  // Wait for layout
  await new Promise(resolve => setTimeout(resolve, 100));

  // Convert to canvas
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

  document.body.removeChild(container);

  // Create PDF
  const imgData = canvas.toDataURL('image/png');
  const imgWidth = 210; // A4 width in mm
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Handle multi-page content
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

  const filename = `Saskaita_${invoice.number}_${replaceLithuanianChars(invoice.client).replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
}
