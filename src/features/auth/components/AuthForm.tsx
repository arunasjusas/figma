import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface AuthFormProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

/**
 * Auth form wrapper component
 * Provides consistent styling for all auth pages
 */
export function AuthForm({ children, title, subtitle, className }: AuthFormProps) {
  return (
    <div className="min-h-screen bg-neutral-bg flex items-center justify-center p-4">
      <Card className={cn('w-full max-w-md', className)} padding="lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-sm text-gray-600">{subtitle}</p>
          )}
        </div>
        {children}
      </Card>
    </div>
  );
}

