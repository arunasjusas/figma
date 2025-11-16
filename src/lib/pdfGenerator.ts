import jsPDF from 'jspdf';
import type { Invoice } from './mockData';
import { formatCurrency } from './utils';

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
 * Generate and download invoice as PDF
 * Uses jsPDF library to create actual PDF files
 */
export function generateInvoicePDF(invoice: Invoice): void {
  // Create new PDF document (A4 size)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set font
  doc.setFont('helvetica');

  // Colors
  const primaryColor = '#2563eb';
  const textColor = '#333333';
  const grayColor = '#666666';

  // Header - Title (ASCII-only text to avoid encoding issues)
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text('SASKAITA FAKTURA', 105, 20, { align: 'center' });

  // Invoice Number
  doc.setFontSize(12);
  doc.setTextColor(grayColor);
  doc.text(`Nr. ${invoice.number}`, 105, 28, { align: 'center' });

  // Draw header line
  doc.setDrawColor(37, 99, 235); // primaryColor
  doc.setLineWidth(1);
  doc.line(20, 32, 190, 32);

  // Client Information
  let yPos = 45;
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text('UZSAKOVAS', 20, yPos);
  
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.client, 20, yPos + 6);
  doc.setFont('helvetica', 'normal');

  // Dates
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text('DATOS', 105, yPos);
  
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  doc.text(`Israsymo data: ${formatDateForPdf(invoice.date)}`, 105, yPos + 6);
  doc.text(`Apmokejimo terminas: ${formatDateForPdf(invoice.dueDate)}`, 105, yPos + 12);

  // Status
  yPos += 25;
  doc.setFontSize(10);
  doc.setTextColor(primaryColor);
  doc.text('STATUSAS', 20, yPos);
  
  doc.setFontSize(10);
  const statusLabel = getStatusLabel(invoice.status);
  const statusColor = getStatusColor(invoice.status);
  doc.setTextColor(statusColor);
  doc.setFont('helvetica', 'bold');
  doc.text(statusLabel, 20, yPos + 6);
  doc.setFont('helvetica', 'normal');

  // Details Table
  yPos += 20;
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255); // White text
  doc.setFillColor(37, 99, 235); // Primary blue background
  doc.rect(20, yPos, 170, 8, 'F');
  doc.text('APRASYMAS', 25, yPos + 5.5);
  doc.text('SUMA', 175, yPos + 5.5, { align: 'right' });

  // Table row
  yPos += 8;
  doc.setTextColor(textColor);
  doc.setDrawColor(229, 231, 235); // Light gray border
  doc.line(20, yPos, 190, yPos);
  
  yPos += 6;
  doc.text('Paslaugos pagal sutarti', 25, yPos);
  doc.text(formatCurrency(invoice.amount), 175, yPos, { align: 'right' });
  
  yPos += 2;
  doc.line(20, yPos, 190, yPos);

  // Summary section
  yPos += 15;
  const summaryX = 120;
  
  doc.setFontSize(10);
  doc.setTextColor(grayColor);
  
  // Amount without VAT
  const amountWithoutVAT = invoice.amount / 1.21;
  doc.text('Suma be PVM:', summaryX, yPos);
  doc.setTextColor(textColor);
  doc.text(formatCurrency(amountWithoutVAT), 185, yPos, { align: 'right' });
  
  // VAT
  yPos += 6;
  doc.setTextColor(grayColor);
  doc.text('PVM (21%):', summaryX, yPos);
  doc.setTextColor(textColor);
  doc.text(formatCurrency(invoice.amount - amountWithoutVAT), 185, yPos, { align: 'right' });
  
  // Total - with line
  yPos += 8;
  doc.setDrawColor(37, 99, 235);
  doc.setLineWidth(0.5);
  doc.line(summaryX, yPos - 2, 190, yPos - 2);
  
  yPos += 4;
  doc.setFontSize(11);
  doc.setTextColor(grayColor);
  doc.text('Bendra suma:', summaryX, yPos);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(primaryColor);
  doc.text(formatCurrency(invoice.amount), 185, yPos, { align: 'right' });
  doc.setFont('helvetica', 'normal');

  // Paid and remaining amounts (if applicable)
  if (invoice.paidAmount !== undefined) {
    yPos += 12;
    doc.setFontSize(10);
    doc.setTextColor(grayColor);
    doc.text('Sumoketa:', summaryX, yPos);
    doc.setTextColor('#059669'); // Green
    doc.text(formatCurrency(invoice.paidAmount), 185, yPos, { align: 'right' });
    
    yPos += 6;
    doc.setTextColor(grayColor);
    doc.text('Likusi suma:', summaryX, yPos);
    doc.setTextColor('#dc2626'); // Red
    doc.text(formatCurrency(invoice.amount - invoice.paidAmount), 185, yPos, { align: 'right' });
  }

  // Notes section (if applicable)
  if (invoice.notes) {
    yPos += 15;
    doc.setFillColor(249, 250, 251); // Light gray background
    doc.setDrawColor(37, 99, 235);
    doc.setLineWidth(1);
    doc.rect(20, yPos, 170, 0, 'S'); // Top border only
    
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(primaryColor);
    doc.setFont('helvetica', 'bold');
    doc.text('PASTABOS', 25, yPos);
    doc.setFont('helvetica', 'normal');
    
    yPos += 5;
    doc.setFontSize(9);
    doc.setTextColor(grayColor);
    const notesLines = doc.splitTextToSize(invoice.notes, 160);
    doc.text(notesLines, 25, yPos);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(grayColor);
  const footerText = `Saskaita sugeneruota automatiskai • ${formatDateForPdf(new Date())}`;
  doc.text(footerText, 105, 280, { align: 'center' });

  // Generate filename
  const filename = `Saskaita_${invoice.number}_${invoice.client.replace(/\s+/g, '_')}.pdf`;

  // Save the PDF
  doc.save(filename);
}

/**
 * Get status label in Lithuanian (ASCII-only for PDF safety)
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
