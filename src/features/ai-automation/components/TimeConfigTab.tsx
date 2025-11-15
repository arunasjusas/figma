import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WEEKDAYS } from '@/lib/constants';

/**
 * Time configuration tab component for AI Automation
 */
export function TimeConfigTab() {
  const [selectedDays, setSelectedDays] = useState<boolean[]>(new Array(7).fill(true));
  const [timeFrom, setTimeFrom] = useState('00:00');
  const [timeTo, setTimeTo] = useState('23:59');
  const [maxMessages, setMaxMessages] = useState('1');
  const [minInterval, setMinInterval] = useState('2');
  const [skipHolidays, setSkipHolidays] = useState(true);

  const toggleDay = (index: number) => {
    const newSelectedDays = [...selectedDays];
    newSelectedDays[index] = !newSelectedDays[index];
    setSelectedDays(newSelectedDays);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Laiko Konfigūracija</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Days Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Dienos, kada siųsti žinutes
            </label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDay(index)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedDays[index]
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Time Interval */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Laiko intervalas
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input
                type="time"
                value={timeFrom}
                onChange={(e) => setTimeFrom(e.target.value)}
              />
              <Input
                type="time"
                value={timeTo}
                onChange={(e) => setTimeTo(e.target.value)}
              />
            </div>
          </div>

          {/* Max Messages Per Day */}
          <Input
            label="Maksimalus žinučių kiekis per dieną"
            type="number"
            value={maxMessages}
            onChange={(e) => setMaxMessages(e.target.value)}
            placeholder="Pvz. 1"
          />

          {/* Min Interval Between Messages */}
          <Input
            label="Minimalus tarpas tarp žinučių (val.)"
            type="number"
            value={minInterval}
            onChange={(e) => setMinInterval(e.target.value)}
            placeholder="Pvz. 2"
          />

          {/* Skip Holidays */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="skipHolidays"
              checked={skipHolidays}
              onChange={(e) => setSkipHolidays(e.target.checked)}
              className="w-4 h-4 text-primary border-neutral-border rounded focus:ring-primary"
            />
            <label htmlFor="skipHolidays" className="text-sm font-medium text-gray-700">
              Nesiųsti šventinėmis dienomis
            </label>
          </div>

          <Button variant="primary" className="w-full">
            Išsaugoti
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

