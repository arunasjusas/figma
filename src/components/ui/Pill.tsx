import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface PillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'paid' | 'unpaid' | 'pending';
}

/**
 * Pill/Badge component for status indicators and labels
 */
export const Pill = forwardRef<HTMLSpanElement, PillProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
          {
            'bg-pill-bg text-pill-text': variant === 'default',
            'bg-status-paid text-white': variant === 'paid',
            'bg-status-unpaid text-white': variant === 'unpaid',
            'bg-status-pending text-white': variant === 'pending',
          },
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Pill.displayName = 'Pill';

