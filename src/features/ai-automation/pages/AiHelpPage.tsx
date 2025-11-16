import { useState } from 'react';
import { SequencesTab } from '../components/SequencesTab';
import { TimeConfigTab } from '../components/TimeConfigTab';
import { AnalyticsTab } from '../components/AnalyticsTab';
import { usePageTitle } from '@/hooks/usePageTitle';
import { cn } from '@/lib/utils';

const TABS = [
  { id: 'sequences', label: 'Sekos', title: 'AI Sekos' },
  { id: 'time', label: 'Laikas', title: 'AI Laikas' },
  { id: 'analytics', label: 'Analitika', title: 'AI Analitika' },
] as const;

/**
 * AI Pagalba page - shows sequence configuration with tabs
 */
export default function AiHelpPage() {
  const [activeTab, setActiveTab] = useState<'sequences' | 'time' | 'analytics'>('sequences');
  
  const activeTabData = TABS.find(t => t.id === activeTab);
  usePageTitle(activeTabData?.title || 'AI Pagalba');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">AI Sekos</h1>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-neutral-border">
        <div className="flex gap-8">
          {TABS.map((tabItem) => (
            <button
              key={tabItem.id}
              onClick={() => setActiveTab(tabItem.id)}
              className={cn(
                'pb-3 px-1 text-sm font-medium transition-colors relative',
                activeTab === tabItem.id
                  ? 'text-primary'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tabItem.label}
              {activeTab === tabItem.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'sequences' && <SequencesTab />}
        {activeTab === 'time' && <TimeConfigTab />}
        {activeTab === 'analytics' && <AnalyticsTab />}
      </div>
    </div>
  );
}

