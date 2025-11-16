import { useMemo } from 'react';
import { KpiCard } from '@/components/shared/KpiCard';
import { RecentActionsTable } from '../components/RecentActionsTable';
import { StatisticsChart } from '../components/StatisticsChart';
import { formatCurrency } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useAIAnalyticsStore } from '@/store/aiAnalyticsStore';

/**
 * Dashboard page - "Peržiūra"
 * Shows KPI cards, recent actions, and statistics chart with real data
 */
export default function DashboardPage() {
  usePageTitle('Peržiūra');

  const getActiveInvoices = useInvoiceStore((state) => state.getActiveInvoices);

  // Calculate real KPI data
  const kpiData = useMemo(() => {
    const activeInvoices = getActiveInvoices();
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Total revenue from all PAID invoices (all paid invoices regardless of date)
    const totalPaidRevenue = activeInvoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Pradelsta invoices - all invoices with UNPAID status (matches invoice table logic)
    const pradelstaInvoices = activeInvoices.filter((inv) => inv.status === 'UNPAID');
    const pradelstaCount = pradelstaInvoices.length;
    const pradelstaTotal = pradelstaInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // AI reminders - count messages sent in the last 7 days
    const allMessages = useAIAnalyticsStore.getState().getMessages();
    const aiReminders = allMessages.filter((msg) => {
      const msgDate = new Date(msg.date);
      return msgDate >= sevenDaysAgo && msgDate <= now;
    }).length;

    return {
      totalPaidRevenue,
      pradelstaCount,
      pradelstaTotal,
      aiReminders,
    };
  }, [getActiveInvoices]);

  return (
    <div className="space-y-6">
      {/* Statistics Chart - First */}
      <StatisticsChart />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          title="Gautos pajamos"
          value={formatCurrency(kpiData.totalPaidRevenue)}
        />
        <KpiCard
          title="Pradelsta"
          subtitle="Vėluojančios sąskaitos"
          value={`${kpiData.pradelstaCount} vnt. · ${formatCurrency(kpiData.pradelstaTotal)}`}
        />
        <KpiCard
          title="AI žinutės"
          subtitle="Išsiųsta priminimų"
          value={`${kpiData.aiReminders} per 7 d.`}
        />
      </div>

      {/* Recent Actions Table */}
      <RecentActionsTable />
    </div>
  );
}

