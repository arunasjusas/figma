import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileSidebar } from './MobileSidebar';
import { TopBar } from './TopBar';
import { useIsMobile } from '@/hooks/useMediaQuery';

interface AppLayoutProps {
  pageTitle?: string;
  showActions?: boolean;
}

/**
 * Main application layout with sidebar and top bar
 */
export function AppLayout({ pageTitle = 'Sąskaitų statistika', showActions = true }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && <Sidebar />}

      {/* Mobile Sidebar */}
      {isMobile && (
        <MobileSidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className={!isMobile ? 'ml-60 bg-[#808080] min-h-screen' : ''}>
        <TopBar
          title={pageTitle}
          onMenuClick={() => setIsMobileMenuOpen(true)}
          showActions={showActions}
        />

        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

