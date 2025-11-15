import { Link } from 'react-router-dom';
import { useState } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useInvoiceStore } from '@/store/invoiceStore';
import { Card } from '@/components/ui/Card';
import { Trash2 } from 'lucide-react';

/**
 * Invoices table component
 * Responsive: table on desktop, cards on mobile
 * Shows only active (non-deleted) invoices
 */
export function InvoicesTable() {
  const isMobile = useIsMobile();
  const getActiveInvoices = useInvoiceStore((state) => state.getActiveInvoices);
  const deleteInvoice = useInvoiceStore((state) => state.deleteInvoice);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const invoices = getActiveInvoices();

  const handleDelete = (id: string, invoiceNumber: string) => {
    if (window.confirm(`Ar tikrai norite ištrinti sąskaitą ${invoiceNumber}?`)) {
      setDeletingId(id);
      setTimeout(() => {
        deleteInvoice(id);
        setDeletingId(null);
      }, 300);
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
                  disabled={deletingId === invoice.id}
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
                  disabled={deletingId === invoice.id}
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

