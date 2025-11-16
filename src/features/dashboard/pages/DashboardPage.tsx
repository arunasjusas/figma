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

    // Total revenue from all PAID invoices (all paid invoices regardless of date)
    const totalPaidRevenue = activeInvoices
      .filter((inv) => inv.status === 'PAID')
      .reduce((sum, inv) => sum + inv.amount, 0);

    // Pradelsta invoices - all invoices with UNPAID status (matches invoice table logic)
    const pradelstaInvoices = activeInvoices.filter((inv) => inv.status === 'UNPAID');
    const pradelstaCount = pradelstaInvoices.length;
    const pradelstaTotal = pradelstaInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    // AI reminders (mock for now - can be implemented later)
    const aiReminders = 24;

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

