import { useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { useInvoiceStore } from '@/store/invoiceStore';

/**
 * Recent actions table component for dashboard
 * Shows the 5 most recent invoices with their actions
 */
export function RecentActionsTable() {
  const getActiveInvoices = useInvoiceStore((state) => state.getActiveInvoices);

  // Get recent actions from invoices
  const recentActions = useMemo(() => {
    const activeInvoices = getActiveInvoices();
    
    // Sort by date (newest first) and take top 5
    const sortedInvoices = [...activeInvoices]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    // Map to action format
    return sortedInvoices.map((invoice) => {
      let action = '';
      if (invoice.status === 'PAID') {
        action = 'Išrašyta sąskaita';
      } else if (invoice.status === 'UNPAID') {
        action = 'Gautas apmokėjimas';
      } else if (invoice.status === 'PENDING') {
        action = 'Išsiųstas AI priminimas';
      }

      return {
        date: invoice.date,
        action,
        client: invoice.client,
        amount: invoice.amount,
      };
    });
  }, [getActiveInvoices]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pastarieji veiksmai</CardTitle>
      </CardHeader>
      <CardContent>
        {recentActions.length === 0 ? (
          <p className="text-center text-gray-500 py-8">Nėra jokių veiksmų</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Veiksmas</TableHead>
                <TableHead>Klientas</TableHead>
                <TableHead className="text-right">Suma</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentActions.map((action, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{formatDate(action.date)}</TableCell>
                  <TableCell>{action.action}</TableCell>
                  <TableCell>{action.client}</TableCell>
                  <TableCell className="text-right">{formatCurrency(action.amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

