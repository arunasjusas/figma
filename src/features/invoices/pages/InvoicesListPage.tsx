import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { InvoiceFilters } from '../components/InvoiceFilters';
import { InvoicesTable } from '../components/InvoicesTable';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * Invoices list page - "Sąskaitos"
 */
export default function InvoicesListPage() {
  usePageTitle('Sąskaitos');

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

