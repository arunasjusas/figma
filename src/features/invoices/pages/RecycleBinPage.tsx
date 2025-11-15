import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { InvoiceStatusPill } from '@/components/shared/InvoiceStatusPill';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useInvoiceStore } from '@/store/invoiceStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import { RotateCcw, Trash2, AlertCircle } from 'lucide-react';
import { useState } from 'react';

/**
 * Recycle Bin Page
 * Shows deleted invoices with restore and permanent delete options
 */
export default function RecycleBinPage() {
  usePageTitle('Šiukšliadėžė');

  const getDeletedInvoices = useInvoiceStore((state) => state.getDeletedInvoices);
  const restoreInvoice = useInvoiceStore((state) => state.restoreInvoice);
  const permanentlyDeleteInvoice = useInvoiceStore((state) => state.permanentlyDeleteInvoice);
  
  const [processingId, setProcessingId] = useState<string | null>(null);

  const deletedInvoices = getDeletedInvoices();

  const handleRestore = (id: string, invoiceNumber: string) => {
    if (window.confirm(`Ar tikrai norite atkurti sąskaitą ${invoiceNumber}?`)) {
      setProcessingId(id);
      setTimeout(() => {
        restoreInvoice(id);
        setProcessingId(null);
      }, 300);
    }
  };

  const handlePermanentDelete = (id: string, invoiceNumber: string) => {
    if (window.confirm(`DĖMESIO: Ar tikrai norite VISAM LAIKUI ištrinti sąskaitą ${invoiceNumber}? Šis veiksmas negrįžtamas!`)) {
      setProcessingId(id);
      setTimeout(() => {
        permanentlyDeleteInvoice(id);
        setProcessingId(null);
      }, 300);
    }
  };

  if (deletedInvoices.length === 0) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent>
            <div className="text-center py-12">
              <Trash2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Šiukšliadėžė tuščia</h3>
              <p className="text-gray-500">Čia nerasime jokių ištrintų sąskaitų</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      <Card>
        <CardContent>
          <div className="flex items-start gap-3 py-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900">Ištrintos sąskaitos</p>
              <p className="text-sm text-gray-600 mt-1">
                Čia rodomos visos ištrintos sąskaitos. Galite jas atkurti arba ištrinti visam laikui.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deleted Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ištrintų sąskaitų sąrašas ({deletedInvoices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nr.</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Klientas</TableHead>
                <TableHead className="text-right">Suma</TableHead>
                <TableHead>Statusas</TableHead>
                <TableHead>Ištrinta</TableHead>
                <TableHead>Veiksmai</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deletedInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="opacity-60 hover:opacity-100 transition-opacity">
                  <TableCell className="font-medium">{invoice.number}</TableCell>
                  <TableCell>{formatDate(invoice.date)}</TableCell>
                  <TableCell>{invoice.client}</TableCell>
                  <TableCell className="text-right">{formatCurrency(invoice.amount)}</TableCell>
                  <TableCell>
                    <InvoiceStatusPill status={invoice.status} />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {invoice.deletedAt ? formatDate(invoice.deletedAt) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(invoice.id, invoice.number)}
                        disabled={processingId === invoice.id}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <RotateCcw className="w-4 h-4 mr-1" />
                        Atkurti
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePermanentDelete(invoice.id, invoice.number)}
                        disabled={processingId === invoice.id}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Ištrinti visam laikui
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

