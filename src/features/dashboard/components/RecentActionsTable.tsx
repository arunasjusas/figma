import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { formatCurrency, formatDate } from '@/lib/utils';
import { mockRecentActions } from '@/lib/mockData';

/**
 * Recent actions table component for dashboard
 */
export function RecentActionsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pastarieji veiksmai</CardTitle>
      </CardHeader>
      <CardContent>
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
            {mockRecentActions.map((action, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{formatDate(action.date)}</TableCell>
                <TableCell>{action.action}</TableCell>
                <TableCell>{action.client}</TableCell>
                <TableCell className="text-right">{formatCurrency(action.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

