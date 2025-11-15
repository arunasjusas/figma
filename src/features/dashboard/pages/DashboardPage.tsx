import { KpiCard } from '@/components/shared/KpiCard';
import { RecentActionsTable } from '../components/RecentActionsTable';
import { StatisticsChart } from '../components/StatisticsChart';
import { formatCurrency } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * Dashboard page - "Peržiūra"
 * Shows KPI cards, recent actions, and statistics chart
 */
export default function DashboardPage() {
  usePageTitle('Peržiūra');

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KpiCard
          label="Šį mėnesį"
          title="Gautos pajamos"
          value={formatCurrency(12430)}
        />
        <KpiCard
          title="Neapmokėta"
          subtitle="Vėluojančios sąskaitos"
          value={`8 vnt. · ${formatCurrency(3210)}`}
        />
        <KpiCard
          title="AI žinutės"
          subtitle="Išsiųsta priminimų"
          value="24 per 7 d."
        />
      </div>

      {/* Recent Actions Table */}
      <RecentActionsTable />

      {/* Statistics Chart */}
      <StatisticsChart />
    </div>
  );
}

