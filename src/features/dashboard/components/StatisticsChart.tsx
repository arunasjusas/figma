import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { LineChart } from '@/components/charts/LineChart';
import { colors } from '@/lib/design-tokens';
import { mockChartData } from '@/lib/mockData';

/**
 * Statistics chart component for dashboard
 * Shows invoice statistics over 12 months
 */
export function StatisticsChart() {
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
          data={mockChartData}
          lines={lines}
          xAxisKey="month"
        />
      </CardContent>
    </Card>
  );
}

