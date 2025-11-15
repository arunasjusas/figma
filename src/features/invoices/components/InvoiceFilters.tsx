import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Search } from 'lucide-react';

/**
 * Invoice filters component
 */
export function InvoiceFilters() {
  const [amountFrom, setAmountFrom] = useState('');
  const [amountTo, setAmountTo] = useState('');
  const [searchNumber, setSearchNumber] = useState('');
  const [searchClient, setSearchClient] = useState('');

  const handleFilter = () => {
    // Mock filter action
    console.log('Filtering:', { amountFrom, amountTo, searchNumber, searchClient });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Input
        placeholder="Suma nuo €"
        type="number"
        value={amountFrom}
        onChange={(e) => setAmountFrom(e.target.value)}
      />
      <Input
        placeholder="Suma iki €"
        type="number"
        value={amountTo}
        onChange={(e) => setAmountTo(e.target.value)}
      />
      <Input
        placeholder="Paieška pagal numerį"
        value={searchNumber}
        onChange={(e) => setSearchNumber(e.target.value)}
      />
      <div className="flex gap-2">
        <Input
          placeholder="Paieška pagal klientą"
          value={searchClient}
          onChange={(e) => setSearchClient(e.target.value)}
          className="flex-1"
        />
        <Button variant="primary" onClick={handleFilter}>
          <Search className="w-4 h-4 md:mr-2" />
          <span className="hidden md:inline">Filtruoti</span>
        </Button>
      </div>
    </div>
  );
}

