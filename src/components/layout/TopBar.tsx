import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Plus, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { AddClientModal } from '@/components/shared/AddClientModal';

interface TopBarProps {
  title?: string;
  onMenuClick?: () => void;
  showActions?: boolean;
}

/**
 * Top bar component with page title and action buttons
 * Action buttons only show on the Invoices page (/invoices)
 * Title is dynamically set by each page using usePageTitle hook
 */
export function TopBar({ title: defaultTitle = 'Sąskaitų Sistema', onMenuClick, showActions = true }: TopBarProps) {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [pageTitle, setPageTitle] = useState(defaultTitle);

  // Listen for page title changes from individual pages
  useEffect(() => {
    const handleTitleChange = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setPageTitle(customEvent.detail);
    };

    window.addEventListener('page-title-change', handleTitleChange);
    return () => window.removeEventListener('page-title-change', handleTitleChange);
  }, []);

  // Show action buttons only on the invoices list page
  // To revert: remove this line and the condition below
  const shouldShowActions = showActions && location.pathname === '/invoices';

  const handleNewInvoice = () => {
    navigate('/invoices/new');
  };

  const handleAddClient = () => {
    setIsClientModalOpen(true);
  };

  return (
    <>
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
            <h1 className="text-2xl md:text-4xl font-bold text-primary">{pageTitle}</h1>
          </div>

          {/* Changed from showActions to shouldShowActions */}
          {shouldShowActions && (
            <div className="flex items-center gap-3">
              <Button 
                variant="primary" 
                size={isMobile ? 'sm' : 'md'}
                onClick={handleNewInvoice}
              >
                <Plus className="w-4 h-4 mr-2" />
                {!isMobile && 'Nauja sąskaita'}
                {isMobile && 'Sąskaita'}
              </Button>
              {!isMobile && (
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={handleAddClient}
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Pridėti klientą
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Add Client Modal */}
      <AddClientModal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
      />
    </>
  );
}

