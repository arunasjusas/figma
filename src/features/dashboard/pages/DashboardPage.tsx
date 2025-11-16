import { useMemo } from 'react';
import { KpiCard } from '@/components/shared/KpiCard';
import { RecentActionsTable } from '../components/RecentActionsTable';
import { StatisticsChart } from '../components/StatisticsChart';
import { formatCurrency } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';
import { useInvoiceStore } from '@/store/invoiceStore';

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
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    // This month's revenue (PAID invoices)
    const thisMonthRevenue = activeInvoices
      .filter((inv) => {
        const invDate = new Date(inv.date);
        return (
          inv.status === 'PAID' &&
          invDate.getMonth() === currentMonth &&
          invDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Overdue invoices (UNPAID with past due date) - same logic as KPI Panele
    const overdueInvoices = activeInvoices.filter((inv) => {
      if (inv.status !== 'UNPAID') return false;
      const dueDate = new Date(inv.dueDate);
      return dueDate < now;
    });
    const overdueCount = overdueInvoices.length;
    const overdueTotal = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // AI reminders (mock for now - can be implemented later)
    const aiReminders = 24;

    return {
      thisMonthRevenue,
      overdueCount,
      overdueTotal,
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
          label="Šį mėnesį"
          title="Gautos pajamos"
          value={formatCurrency(kpiData.thisMonthRevenue)}
        />
        <KpiCard
          title="Pradelsta"
          subtitle="Vėluojančios sąskaitos"
          value={`${kpiData.overdueCount} vnt. · ${formatCurrency(kpiData.overdueTotal)}`}
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

