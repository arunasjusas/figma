import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

/**
 * Button component with multiple variants
 * Follows design system specifications
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading = false, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            // Variants - using transparent borders to prevent layout shift
            'bg-primary text-white border-2 border-transparent hover:bg-white hover:text-primary hover:border-primary': variant === 'primary',
            'bg-gray-100 text-gray-900 border-2 border-transparent hover:bg-white hover:border-neutral-border': variant === 'secondary',
            'border-2 border-primary text-primary bg-transparent hover:bg-primary/10': variant === 'outline',
            'border-2 border-transparent text-gray-700 hover:bg-gray-100': variant === 'ghost',
            
            // Sizes
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-sm': size === 'md',
            'h-12 px-6 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {loading && (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

