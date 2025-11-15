import { Link } from 'react-router-dom';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Button } from '@/components/ui/Button';
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { mockInvoices } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';

/**
 * Invoices table component
 * Responsive: table on desktop, cards on mobile
 */
export function InvoicesTable() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div className="space-y-4">
        {mockInvoices.map((invoice) => (
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
              <div className="pt-2">
                <Link to={`/invoices/${invoice.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Daugiau
                  </Button>
                </Link>
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
          <TableHead>Veiksmas</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {mockInvoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell className="font-medium">{invoice.number}</TableCell>
            <TableCell>{formatDate(invoice.date)}</TableCell>
            <TableCell>{invoice.client}</TableCell>
            <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
            <TableCell>
              <InvoiceStatusPill status={invoice.status} />
            </TableCell>
            <TableCell>
              <Link to={`/invoices/${invoice.id}`}>
                <Button variant="ghost" size="sm">
                  Daugiau
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

