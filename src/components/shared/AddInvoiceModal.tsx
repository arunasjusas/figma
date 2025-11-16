import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useInvoiceStore } from '@/store/invoiceStore';
import { useClientStore } from '@/store/clientStore';
import { useToastStore } from '@/components/ui/Toast';
import type { Invoice } from '@/lib/mockData';

interface AddInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
 * Add Invoice Modal Component
 * Modal dialog for adding a new invoice
 */
export function AddInvoiceModal({ isOpen, onClose }: AddInvoiceModalProps) {
  const addInvoice = useInvoiceStore((state) => state.addInvoice);
  const clients = useClientStore((state) => state.clients);
  const addToast = useToastStore((state) => state.addToast);

  // Generate next invoice number
  const generateInvoiceNumber = () => {
    const invoices = useInvoiceStore.getState().invoices;
    const lastNumber = invoices.length > 0 
      ? parseInt(invoices[0].number.split('-')[1]) || 100
      : 100;
    return `SF-${lastNumber + 1}`;
  };

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

  // Auto-generate invoice number when modal opens
  useEffect(() => {
    if (isOpen && !formData.number) {
      setFormData((prev) => ({ ...prev, number: generateInvoiceNumber() }));
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      number: generateInvoiceNumber(),
      date: new Date().toISOString().split('T')[0],
      dueDate: '',
      clientId: '',
      amount: '',
      status: 'PENDING',
      notes: '',
    });
    setErrors({});
  };

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
    await new Promise((resolve) => setTimeout(resolve, 800));

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

    addInvoice(newInvoice);

    addToast({
      type: 'success',
      title: 'Sąskaita sukurta',
      message: `Sąskaita ${formData.number} sėkmingai sukurta.`,
    });

    setIsSubmitting(false);
    resetForm();
    onClose();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Nauja sąskaita" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              label="Klientas *"
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
              placeholder="mm/dd/yyyy"
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
              label="Būsena *"
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
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Atšaukti
          </Button>
          <Button type="submit" variant="primary" loading={isSubmitting}>
            Sukurti sąskaitą
          </Button>
        </div>
      </form>
    </Modal>
  );
}

