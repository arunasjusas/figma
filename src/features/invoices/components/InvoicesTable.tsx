import { Link } from 'react-router-dom';
import { useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useInvoiceFilterStore } from '../store/invoiceFilterStore';
import { Card } from '@/components/ui/Card';
import { Trash2 } from 'lucide-react';

/**
 * Invoices table component
 * Responsive: table on desktop, cards on mobile
 * Shows only active (non-deleted) invoices with applied filters
 */
export function InvoicesTable() {
  const isMobile = useIsMobile();
  const allInvoices = useInvoiceStore((state) => state.invoices);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);

  const { amountFrom, amountTo, searchNumber, searchClient, status } = useInvoiceFilterStore();

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

  if (isMobile) {
    return (
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
                <Link to={`/invoices/${invoice.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    Daugiau
                  </Button>
                </Link>
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
    );
  }

  return (
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
                <Link to={`/invoices/${invoice.id}`}>
                  <Button variant="ghost" size="sm">
                    Daugiau
                  </Button>
                </Link>
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
  );
}

