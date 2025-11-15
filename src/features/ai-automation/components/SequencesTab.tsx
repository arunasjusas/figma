import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus } from 'lucide-react';
import { mockSequenceSteps } from '@/lib/mockData';

/**
 * Sequences tab component for AI Automation
 */
export function SequencesTab() {
  const [selectedStep, setSelectedStep] = useState(mockSequenceSteps[0]);
  const [subject, setSubject] = useState(selectedStep.subject);
  const [content, setContent] = useState(selectedStep.content);
  const [tone, setTone] = useState(selectedStep.tone);
  const [aiStrength, setAiStrength] = useState(selectedStep.aiStrength);
  const [delay, setDelay] = useState(selectedStep.delay);
  const [additionalRule, setAdditionalRule] = useState(selectedStep.additionalRule);

  const handleStepSelect = (step: typeof mockSequenceSteps[0]) => {
    setSelectedStep(step);
    setSubject(step.subject);
    setContent(step.content);
    setTone(step.tone);
    setAiStrength(step.aiStrength);
    setDelay(step.delay);
    setAdditionalRule(step.additionalRule);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sequence Steps List */}
      <Card>
        <CardHeader>
          <CardTitle>Sekų žingsniai</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSequenceSteps.map((step) => (
              <div
                key={step.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedStep.id === step.id
                    ? 'border-primary bg-primary/5'
                    : 'border-neutral-border hover:border-primary/50'
                }`}
                onClick={() => handleStepSelect(step)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold">Step {step.number}</span>
                    <span className="mx-2">·</span>
                    <span>{step.title}</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    + Pridėti variantą
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              <Plus className="w-4 h-4 mr-2" />
              Pridėti naują žingsnį
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step Configuration Form */}
      <Card>
        <CardHeader>
          <CardTitle>Žingsnio konfigūracija</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Tema"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Pvz. Dėl artėjančio mokėjimo termino"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Žinutės turinys
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Įveskite žinutės tekstą..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Žinutės tonas
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value as 'neutral' | 'friendly')}
                className="w-full px-3 py-2 border border-neutral-border rounded focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="neutral">Neutralus</option>
                <option value="friendly">Draugiškas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                AI "strength" (0–100%)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={aiStrength}
                  onChange={(e) => setAiStrength(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-semibold w-12 text-right">{aiStrength}%</span>
              </div>
            </div>

            <Input
              label="Vėlavimas"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              placeholder="Pvz. 24 val."
            />

            <Input
              label="Papildoma taisyklė"
              value={additionalRule}
              onChange={(e) => setAdditionalRule(e.target.value)}
              placeholder="Pvz. siųsti tik jei klientas neatsakė"
            />

            <Button variant="primary" className="w-full">
              Išsaugoti žingsnį
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

