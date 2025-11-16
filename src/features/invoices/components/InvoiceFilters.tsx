import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { useInvoiceFilterStore } from '../store/invoiceFilterStore';

/**
 * Invoice filters component
 * Filters invoices by amount range, number, client, and status
 */
export function InvoiceFilters() {
  const {
    amountFrom,
    amountTo,
    searchNumber,
    searchClient,
    status,
    setAmountFrom,
    setAmountTo,
    setSearchNumber,
    setSearchClient,
    setStatus,
  } = useInvoiceFilterStore();

  const statusOptions = [
    { value: '', label: 'Visi statusai' },
    { value: 'PAID', label: 'Apmokėta' },
    { value: 'UNPAID', label: 'Pradelsta' },
    { value: 'PENDING', label: 'Terminas nepasibaigęs' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
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
      <Input
        placeholder="Paieška pagal klientą"
        value={searchClient}
        onChange={(e) => setSearchClient(e.target.value)}
      />
      <Select
        value={status}
        onChange={(value) => setStatus(value as any)}
        options={statusOptions}
        placeholder="Filtruoti pagal statusą"
      />
    </div>
  );
}

