import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

/**
 * Animated Button component with modern hover effects
 * Based on provided design with arrow animations and expanding circle
 */
export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'primary', children, disabled, ...props }, ref) => {
    const isPrimary = variant === 'primary';
    const borderColor = isPrimary ? '#0A61C4' : '#E5E7EB';
    const bgColor = isPrimary ? '#0A61C4' : 'transparent';
    const textColor = isPrimary ? 'white' : '#374151';
    
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn('animated-button', isPrimary ? 'animated-button-primary' : 'animated-button-secondary', className)}
        style={{
          '--border-color': borderColor,
          '--bg-color': bgColor,
          '--text-color': textColor,
        } as React.CSSProperties}
        {...props}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-2" viewBox="0 0 24 24">
          <path
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            fill="currentColor"
          />
        </svg>
        <span className="text">{children}</span>
        <span className="circle"></span>
        <svg xmlns="http://www.w3.org/2000/svg" className="arr-1" viewBox="0 0 24 24">
          <path
            d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"
            fill="currentColor"
          />
        </svg>
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

