import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { KpiCard } from '@/components/shared/KpiCard';
import { LineChart } from '@/components/charts/LineChart';
import { formatCurrency } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useAIAnalyticsStore } from '@/store/aiAnalyticsStore';
import { colors } from '@/lib/design-tokens';

/**
 * KPI Panel page
 * Shows comprehensive KPI cards and letter statistics with real data
 */
export default function KpiPanelPage() {
  usePageTitle('KPI Panele');

  const getActiveInvoices = useInvoiceStore((state) => state.getActiveInvoices);
  const { getSendingActivity } = useAIAnalyticsStore();

  // Calculate all KPI data
  const kpiData = useMemo(() => {
    const activeInvoices = getActiveInvoices();
    const now = new Date();

    // Total invoices
    const totalInvoices = activeInvoices.length;

    // Pradelsta invoices - all invoices with UNPAID status (matches invoice table logic)
    const pradelstaInvoices = activeInvoices.filter((inv) => inv.status === 'UNPAID');
    const pradelstaCount = pradelstaInvoices.length;
    const pradelstaTotal = pradelstaInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // Past due - invoices that are UNPAID AND past their due date
    const pastDueInvoices = pradelstaInvoices.filter((inv) => {
      const dueDate = new Date(inv.dueDate);
      return dueDate < now;
    });
    const pastDueCount = pastDueInvoices.length;

    // Active invoices (non-deleted)
    const activeCount = activeInvoices.length;

    // Average delay in days (only for invoices past due date)
    const averageDelay = pastDueInvoices.length > 0
      ? Math.round(
          pastDueInvoices.reduce((sum, inv) => {
            const dueDate = new Date(inv.dueDate);
            const daysOverdue = Math.floor((now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24));
            return sum + daysOverdue;
          }, 0) / pastDueInvoices.length
        )
      : 0;

    // Sent reminders from AI analytics
    const allMessages = useAIAnalyticsStore.getState().getMessages();
    const sentReminders = allMessages.length;

    return {
      sentReminders,
      totalInvoices,
      pradelstaCount,
      pradelstaTotal,
      activeCount,
      pastDueCount,
      averageDelay,
    };
  }, [getActiveInvoices]);

  // Letter statistics data (sending activity)
  const letterStatsData = useMemo(() => {
    return getSendingActivity();
  }, [getSendingActivity]);

  const chartLines = [
    {
      dataKey: 'siustu',
      name: 'Išsiųsta',
      color: colors.primary.default,
    },
    {
      dataKey: 'atidaryta',
      name: 'Atidaryta',
      color: colors.chart.green,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Letter Statistics at Top */}
      <Card>
        <CardHeader>
          <CardTitle>Laiškų statistika</CardTitle>
        </CardHeader>
        <CardContent>
          <LineChart
            data={letterStatsData}
            lines={chartLines}
            xAxisKey="month"
            height={300}
          />
        </CardContent>
      </Card>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <KpiCard
          title="Išsiųsti priminimai"
          value={kpiData.sentReminders.toString()}
        />
        <KpiCard
          title="Viso sąskaitų"
          value={kpiData.totalInvoices.toString()}
        />
        <KpiCard
          title="Vėluojančios"
          subtitle={`${formatCurrency(kpiData.pradelstaTotal)}`}
          value={`${kpiData.pradelstaCount} vnt.`}
        />
        <KpiCard
          title="Aktyvių sąskaitų skaičius"
          value={kpiData.activeCount.toString()}
        />
        <KpiCard
          title="Viršijusios terminą"
          value={`${kpiData.pradelstaCount} vnt.`}
        />
        <KpiCard
          title="Vidutinis vėlavimas"
          subtitle="Dienų skaičius"
          value={`${kpiData.averageDelay} d.`}
        />
      </div>
    </div>
  );
}

