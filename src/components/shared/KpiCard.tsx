import { Card, CardContent } from '@/components/ui/Card';
import { Pill } from '@/components/ui/Pill';

interface KpiCardProps {
  title: string;
  value: string;
  subtitle?: string;
  label?: string;
  className?: string;
}

/**
 * KPI Card component for dashboard metrics
 * Shows key performance indicators with optional label pill
 */
export function KpiCard({ title, value, subtitle, label, className }: KpiCardProps) {
  return (
    <Card className={className}>
      <CardContent>
        {label && (
          <Pill variant="default" className="mb-3">
            {label}
          </Pill>
        )}
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        {subtitle && (
          <p className="text-sm text-gray-600 mb-2">{subtitle}</p>
        )}
        <p className="text-xl font-medium text-gray-900">{value}</p>
      </CardContent>
    </Card>
  );
}

