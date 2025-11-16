import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { colors } from '@/lib/design-tokens';
import { useInvoiceStore } from '@/store/invoiceStore';

/**
 * Statistics chart component for dashboard
 * Shows invoice statistics over 12 months with real data
 */
export function StatisticsChart() {
  const getActiveInvoices = useInvoiceStore((state) => state.getActiveInvoices);

  // Generate chart data from real invoices
  const chartData = useMemo(() => {
    const activeInvoices = getActiveInvoices();
    const now = new Date();
    const currentYear = now.getFullYear();

    // Generate last 12 months
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentYear, now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('lt-LT', { month: 'short' });
      
      // Count invoices by status for this month
      const monthInvoices = activeInvoices.filter((inv) => {
        const invDate = new Date(inv.date);
        return (
          invDate.getMonth() === date.getMonth() &&
          invDate.getFullYear() === date.getFullYear()
        );
      });

      const paid = monthInvoices.filter((inv) => inv.status === 'PAID').length;
      const unpaid = monthInvoices.filter((inv) => inv.status === 'UNPAID').length;
      const pending = monthInvoices.filter((inv) => inv.status === 'PENDING').length;

      months.push({
        month: monthName.charAt(0).toUpperCase() + monthName.slice(1),
        paid,
        unpaid,
        pending,
      });
    }

    return months;
  }, [getActiveInvoices]);

  const lines = [
    {
      dataKey: 'paid',
      name: 'Sumokėtos',
      color: colors.chart.green,
    },
    {
      dataKey: 'unpaid',
      name: 'Nesumokėtos',
      color: colors.chart.purple,
    },
    {
      dataKey: 'pending',
      name: 'Terminas Nepasibaigęs',
      color: colors.chart.blue,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sąskaitų statistika</CardTitle>
      </CardHeader>
      <CardContent>
        <LineChart
          data={chartData}
          lines={lines}
          xAxisKey="month"
          height={300}
        />
      </CardContent>
    </Card>
  );
}

