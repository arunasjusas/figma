import { Menu, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface TopBarProps {
  title: string;
  onMenuClick?: () => void;
  showActions?: boolean;
}

/**
 * Top bar component with page title and action buttons
 */
export function TopBar({ title, onMenuClick, showActions = true }: TopBarProps) {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-neutral-border shadow-header">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          {isMobile && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          <h1 className="text-2xl md:text-4xl font-bold text-primary">{title}</h1>
        </div>

        {showActions && (
          <div className="flex items-center gap-3">
            <Button variant="primary" size={isMobile ? 'sm' : 'md'}>
              <Plus className="w-4 h-4 mr-2" />
              {!isMobile && 'Nauja sąskaita'}
              {isMobile && 'Sąskaita'}
            </Button>
            {!isMobile && (
              <Button variant="outline" size="md">
                <UserPlus className="w-4 h-4 mr-2" />
                Pridėti klientą
              </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

