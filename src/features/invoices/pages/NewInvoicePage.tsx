import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Card } from '@/components/ui/Card';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useClientStore } from '@/store/clientStore';
import { usePageTitle } from '@/hooks/usePageTitle';
import type { Invoice } from '@/lib/mockData';

interface InvoiceFormData {
  number: string;
  date: string;
  dueDate: string;
  clientId: string;
  amount: string;
  status: Invoice['status'];
  notes: string;
}

/**
 * New Invoice Page
 * Form to create a new invoice
 */
export default function NewInvoicePage() {
  usePageTitle('Nauja sąskaita');
  
  const navigate = useNavigate();
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const clients = useClientStore((state) => state.clients);

  const [formData, setFormData] = useState<InvoiceFormData>({
    number: '',
    date: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientId: '',
    amount: '',
    status: 'PENDING',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InvoiceFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate next invoice number
  const generateInvoiceNumber = () => {
    const invoices = useInvoiceStore.getState().invoices;
    const lastNumber = invoices.length > 0 
      ? parseInt(invoices[0].number.split('-')[1]) || 100
      : 100;
    return `SF-${lastNumber + 1}`;
  };

  // Auto-generate invoice number on mount
  useState(() => {
    if (!formData.number) {
      setFormData((prev) => ({ ...prev, number: generateInvoiceNumber() }));
    }
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InvoiceFormData, string>> = {};

    if (!formData.number.trim()) {
      newErrors.number = 'Sąskaitos numeris yra privalomas';
    }

    if (!formData.date) {
      newErrors.date = 'Data yra privaloma';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Mokėjimo terminas yra privalomas';
    } else if (new Date(formData.dueDate) < new Date(formData.date)) {
      newErrors.dueDate = 'Mokėjimo terminas negali būti ankstesnis už sąskaitos datą';
    }

    if (!formData.clientId) {
      newErrors.clientId = 'Klientas yra privalomas';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Suma yra privaloma';
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Suma turi būti teigiamas skaičius';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const selectedClient = clients.find((c) => c.id === formData.clientId);

    const newInvoice: Omit<Invoice, 'id'> = {
      number: formData.number,
      date: formData.date,
      dueDate: formData.dueDate,
      client: selectedClient?.name || '',
      amount: parseFloat(formData.amount),
      status: formData.status,
      notes: formData.notes || undefined,
    };

    try {
      await addInvoice(newInvoice);
      setIsSubmitting(false);
      // Navigate back to invoices list
      navigate('/invoices');
    } catch (error) {
      setIsSubmitting(false);
      // Handle error (you might want to show a toast here)
      console.error('Failed to create invoice:', error);
    }
  };

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const statusOptions = [
    { value: 'PENDING', label: 'Terminas nepasibaigęs' },
    { value: 'UNPAID', label: 'Pradelsta' },
    { value: 'PAID', label: 'Sumokėta' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/invoices')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atgal
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Nauja sąskaita</h1>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Invoice Number */}
            <Input
              label="Sąskaitos numeris"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              placeholder="SF-101"
              required
              error={errors.number}
              fullWidth
            />

            {/* Client */}
            <Select
              label="Klientas"
              value={formData.clientId}
              onChange={(value) => setFormData({ ...formData, clientId: value })}
              options={clientOptions}
              placeholder="Pasirinkite klientą"
              required
              error={errors.clientId}
              fullWidth
            />

            {/* Issue Date */}
            <Input
              label="Sąskaitos data"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
              error={errors.date}
              fullWidth
            />

            {/* Due Date */}
            <Input
              label="Mokėjimo terminas"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              required
              error={errors.dueDate}
              fullWidth
            />

            {/* Amount */}
            <Input
              label="Suma (€)"
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="0.00"
              required
              error={errors.amount}
              fullWidth
            />

            {/* Status */}
            <Select
              label="Būsena"
              value={formData.status}
              onChange={(value) => setFormData({ ...formData, status: value as Invoice['status'] })}
              options={statusOptions}
              required
              fullWidth
            />
          </div>

          {/* Notes */}
          <Textarea
            label="Pastabos (neprivaloma)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Papildoma informacija apie sąskaitą..."
            rows={4}
            fullWidth
          />

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => navigate('/invoices')}
              disabled={isSubmitting}
            >
              Atšaukti
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
            >
              Sukurti sąskaitą
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}

