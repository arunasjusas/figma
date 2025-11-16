import { SequencesTab } from '../components/SequencesTab';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * AI Pagalba page - shows sequence configuration
 */
export default function AiHelpPage() {
  usePageTitle('AI Sekos');
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">AI Sekos</h1>
      </div>
      <SequencesTab />
    </div>
  );
}

