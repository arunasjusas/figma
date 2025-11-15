import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoicesTable } from '../components/InvoicesTable';

/**
 * Invoices list page - "Sąskaitos"
 */
export default function InvoicesListPage() {
  return (
    <div className="space-y-6">
      <InvoiceFilters />

      <Card>
        <CardHeader>
          <CardTitle>Sąskaitų sąrašas</CardTitle>
        </CardHeader>
        <CardContent>
          <InvoicesTable />
        </CardContent>
      </Card>
    </div>
  );
}

