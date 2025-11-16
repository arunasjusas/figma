import { useMemo, useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useInvoiceFilterStore } from '../store/invoiceFilterStore';
import { Card } from '@/components/ui/Card';
import { Trash2, Download, Send, Edit } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import type { Invoice } from '@/lib/mockData';
import { useToastStore } from '@/components/ui/Toast';
import { generateInvoicePDF } from '@/lib/pdfGenerator';

/**
 * Invoices table component
 * Responsive: table on desktop, cards on mobile
 * Shows only active (non-deleted) invoices with applied filters
 */
export function InvoicesTable() {
  const isMobile = useIsMobile();
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  const addToast = useToastStore((state) => state.addToast);

  const { amountFrom, amountTo, searchNumber, searchClient, status } = useInvoiceFilterStore();

  // Modal states
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiMessageSubject, setAiMessageSubject] = useState('Priminimas dėl sąskaitos');
  const [aiMessageBody, setAiMessageBody] = useState(
    'Gerbiamas kliente,\n\nPrimename apie jūsų sąskaitą. Prašome apmokėti iki nurodyto termino.\n\nAčiū už bendradarbiavimą!'
  );

  // Apply filters to invoices
  const invoices = useMemo(() => {
    // Get only active (non-deleted) invoices
    let filtered = allInvoices.filter((inv) => !inv.deleted);

    // Filter by amount range
    if (amountFrom) {
      const minAmount = parseFloat(amountFrom);
      filtered = filtered.filter((inv) => inv.amount >= minAmount);
    }
    if (amountTo) {
      const maxAmount = parseFloat(amountTo);
      filtered = filtered.filter((inv) => inv.amount <= maxAmount);
    }

    // Filter by invoice number
    if (searchNumber) {
      filtered = filtered.filter((inv) =>
        inv.number.toLowerCase().includes(searchNumber.toLowerCase())
      );
    }

    // Filter by client name
    if (searchClient) {
      filtered = filtered.filter((inv) =>
        inv.client.toLowerCase().includes(searchClient.toLowerCase())
      );
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter((inv) => inv.status === status);
    }

    return filtered;
  }, [allInvoices, amountFrom, amountTo, searchNumber, searchClient, status]);

  const handleDelete = (id: string, invoiceNumber: string) => {
    if (window.confirm(`Ar tikrai norite ištrinti sąskaitą ${invoiceNumber}?`)) {
      deleteInvoice(id);
    }
  };

  const handleViewDetails = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsDetailModalOpen(true);
  };

  const handleOpenAiModal = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setIsAiModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleCloseAiModal = () => {
    setIsAiModalOpen(false);
  };

  const handleDownloadPDF = (invoice: Invoice) => {
    try {
      // Generate and download PDF
      generateInvoicePDF(invoice);
      
      // Show success toast
      addToast({
        type: 'success',
        title: 'PDF generuojamas',
        message: `Sąskaita ${invoice.number} atidaryta naujame lange spausdinimui.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      addToast({
        type: 'error',
        title: 'Klaida',
        message: 'Nepavyko sugeneruoti PDF. Bandykite dar kartą.',
      });
    }
  };

  const handleSendAiMessage = () => {
    if (!selectedInvoice) return;

    // Mock sending AI message
    addToast({
      type: 'success',
      title: 'Pranešimas išsiųstas',
      message: `AI pranešimas sėkmingai išsiųstas klientui ${selectedInvoice.client}!`,
    });

    // Close the modal after sending
    setIsAiModalOpen(false);

    // In a real implementation, this would call an API to send the message
    console.log('Sending AI message:', {
      invoice: selectedInvoice.number,
      client: selectedInvoice.client,
      subject: aiMessageSubject,
      body: aiMessageBody,
    });
  };

  const renderModals = () => {
    if (!selectedInvoice) return null;

    const remainingAmount = selectedInvoice.amount - (selectedInvoice.paidAmount || 0);

    return (
      <>
        {/* Invoice Detail Modal */}
        <Modal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetailModal}
          title="Sąskaitos informacija"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Užsakovas</p>
                  <p className="font-semibold text-lg">{selectedInvoice.client}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Sąskaitos numeris</p>
                  <p className="font-semibold">{selectedInvoice.number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Išrašymo data</p>
                  <p className="font-semibold">{formatDate(selectedInvoice.date)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Apmokėjimo terminas</p>
                  <p className="font-semibold">{formatDate(selectedInvoice.dueDate)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Statusas</p>
                  <div className="mt-1">
                    <InvoiceStatusPill status={selectedInvoice.status} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Bendra suma</p>
                  <p className="font-bold text-2xl text-gray-900">{formatCurrency(selectedInvoice.amount)}</p>
                </div>
                {selectedInvoice.paidAmount !== undefined && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Sumokėta</p>
                      <p className="font-semibold text-lg text-status-paid">{formatCurrency(selectedInvoice.paidAmount)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Likusi suma</p>
                      <p className="font-semibold text-lg text-status-unpaid">{formatCurrency(remainingAmount)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {selectedInvoice.notes && (
              <div className="pt-6 border-t border-neutral-border">
                <p className="text-sm text-gray-600 mb-2">Pastabos</p>
                <p className="text-sm text-gray-700">{selectedInvoice.notes}</p>
              </div>
            )}

            <div className="pt-6 border-t border-neutral-border flex flex-wrap gap-3">
              <Button 
                variant="primary"
                onClick={() => {
                  handleCloseDetailModal();
                  handleOpenAiModal(selectedInvoice);
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Siųsti AI pranešimą
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleDownloadPDF(selectedInvoice)}
              >
                <Download className="w-4 h-4 mr-2" />
                Atsisiųsti sąskaitą PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  handleCloseDetailModal();
                  handleDelete(selectedInvoice.id, selectedInvoice.number);
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Ištrinti sąskaitą
              </Button>
            </div>
          </div>
        </Modal>

        {/* AI Message Modal */}
        <Modal
          isOpen={isAiModalOpen}
          onClose={handleCloseAiModal}
          title="AI Žinutės Peržiūra"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Tema
              </label>
              <input
                type="text"
                value={aiMessageSubject}
                onChange={(e) => setAiMessageSubject(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Žinutės turinys
              </label>
              <textarea
                value={aiMessageBody}
                onChange={(e) => setAiMessageBody(e.target.value)}
                rows={8}
                className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button 
                variant="outline"
                onClick={handleCloseAiModal}
              >
                <Edit className="w-4 h-4 mr-2" />
                Redaguoti
              </Button>
              <Button 
                variant="primary"
                onClick={handleSendAiMessage}
              >
                Patvirtinti ir siųsti
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  };

  if (isMobile) {
    return (
      <>
        <div className="space-y-4">
          {invoices.map((invoice) => (
            <Card key={invoice.id} padding="md">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{invoice.number}</span>
                  <InvoiceStatusPill status={invoice.status} />
                </div>
                <div className="text-sm text-gray-600">
                  <p><span className="font-medium">Data:</span> {formatDate(invoice.date)}</p>
                  <p><span className="font-medium">Klientas:</span> {invoice.client}</p>
                  <p><span className="font-medium">Suma:</span> {formatCurrency(invoice.amount)}</p>
                  <p><span className="font-medium">Apmokėjimo terminas:</span> {formatDate(invoice.dueDate)}</p>
                </div>
                <div className="pt-2 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewDetails(invoice)}
                  >
                    Daugiau
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(invoice.id, invoice.number)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        {renderModals()}
      </>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nr.</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Klientas</TableHead>
            <TableHead className="text-right">Suma</TableHead>
            <TableHead>Apmokėjimo terminas</TableHead>
            <TableHead>Statusas</TableHead>
            <TableHead>Veiksmai</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.number}</TableCell>
              <TableCell>{formatDate(invoice.date)}</TableCell>
              <TableCell>{invoice.client}</TableCell>
              <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
              <TableCell>{formatDate(invoice.dueDate)}</TableCell>
              <TableCell>
                <InvoiceStatusPill status={invoice.status} />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleViewDetails(invoice)}
                  >
                    Daugiau
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(invoice.id, invoice.number)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {renderModals()}
    </>
  );
}

