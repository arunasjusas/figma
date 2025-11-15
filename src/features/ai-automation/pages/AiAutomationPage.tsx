import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { SequencesTab } from '../components/SequencesTab';
import { TimeConfigTab } from '../components/TimeConfigTab';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { cn } from '@/lib/utils';
import { usePageTitle } from '@/hooks/usePageTitle';

const TABS = [
  { id: 'sequences', label: 'Sekos', title: 'AI Sekos' },
  { id: 'time', label: 'Laikas', title: 'AI Laikas' },
  { id: 'analytics', label: 'Analitika', title: 'AI Analitika' },
] as const;

/**
 * AI Automation page with tabs
 */
export default function AiAutomationPage() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  
  // Set page title based on active tab
  const activeTab = TABS.find(t => t.id === tab);
  usePageTitle(activeTab?.title || 'AI Automatizacijos');

  // Redirect to sequences tab if no tab specified
  if (!tab || !TABS.find(t => t.id === tab)) {
    return <Navigate to="/ai-automation/sequences" replace />;
  }

  const handleTabChange = (tabId: string) => {
    navigate(`/ai-automation/${tabId}`);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="border-b border-neutral-border">
        <div className="flex gap-8">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => handleTabChange(tabItem.id)}
              className={cn(
                'pb-3 px-1 text-sm font-medium transition-colors relative',
                tab === tabItem.id
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tabItem.label}
              {tab === tabItem.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {tab === 'sequences' && <SequencesTab />}
        {tab === 'time' && <TimeConfigTab />}
        {tab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

