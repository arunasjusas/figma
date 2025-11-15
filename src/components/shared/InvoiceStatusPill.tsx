import { Pill } from '@/components/ui/Pill';
import { INVOICE_STATUS, INVOICE_STATUS_LABELS } from '@/lib/constants';

interface InvoiceStatusPillProps {
  status: keyof typeof INVOICE_STATUS;
}

/**
 * Invoice status pill component
 * Maps invoice status to appropriate colored pill
 */
export function InvoiceStatusPill({ status }: InvoiceStatusPillProps) {
  const statusValue = INVOICE_STATUS[status];
  const label = INVOICE_STATUS_LABELS[statusValue];

  const variantMap = {
    [INVOICE_STATUS.PAID]: 'paid' as const,
    [INVOICE_STATUS.UNPAID]: 'unpaid' as const,
    [INVOICE_STATUS.PENDING]: 'pending' as const,
  };

  return (
    <Pill variant={variantMap[statusValue]}>
      {label}
    </Pill>
  );
}

