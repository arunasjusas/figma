import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { AreaChart } from '@/components/charts/AreaChart';
import { useInvoiceStore } from '@/store/invoiceStore';
import { colors } from '@/lib/design-tokens';

/**
 * Statistics chart component for dashboard
 * Shows invoice statistics over 12 months with real data
 * Uses area chart with colors matching the design
 */
export function StatisticsChart() {
  const getActiveInvoices = useInvoiceStore((state) => state.getActiveInvoices);

  // Generate chart data from real invoices
  // Shows cumulative totals: for each month, shows all invoices created up to that month
  // with their current status. This way, current month shows all current invoices.
  const chartData = useMemo(() => {
    const activeInvoices = getActiveInvoices();
    const now = new Date();
    const currentYear = now.getFullYear();

    // Generate last 12 months
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('lt-LT', { month: 'short' });
      
      // Get end of this month
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);
      
      // Count all invoices created on or before the end of this month
      // Using their current status (since we don't track status history)
      const invoicesUpToMonth = activeInvoices.filter((inv) => {
        const invDate = new Date(inv.date);
        return invDate <= monthEnd;
      });

      // Count by current status
      const paid = invoicesUpToMonth.filter((inv) => inv.status === 'PAID').length;
      const unpaid = invoicesUpToMonth.filter((inv) => inv.status === 'UNPAID').length;
      const pending = invoicesUpToMonth.filter((inv) => inv.status === 'PENDING').length;

      months.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        paid,
        unpaid,
        pending,
      });
    }

    return months;
  }, [getActiveInvoices]);

  // Colors from status colors: green for paid, red for unpaid, blue for pending
  const areas = [
    {
      dataKey: 'paid',
      name: 'Sumokėtos',
      strokeColor: colors.status.paid, // Green
      fillColor: colors.status.paid,
      fillGradientId: 'colorPaid',
    },
    {
      dataKey: 'unpaid',
      name: 'Pradelsta',
      strokeColor: colors.status.unpaid, // Red
      fillColor: colors.status.unpaid,
      fillGradientId: 'colorUnpaid',
    },
    {
      dataKey: 'pending',
      name: 'Terminas Nepasibaigęs',
      strokeColor: colors.status.pending, // Blue
      fillColor: colors.status.pending,
      fillGradientId: 'colorPending',
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sąskaitų statistika</CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart
          data={chartData}
          areas={areas}
          xAxisKey="month"
          height={300}
        />
      </CardContent>
    </Card>
  );
}

