import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { useClientStore } from '@/store/clientStore';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  notes: string;
}

/**
 * Add Client Modal Component
 * Modal dialog for adding a new client
 */
export function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  const addClient = useClientStore((state) => state.addClient);

  const [formData, setFormData] = useState<ClientFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ClientFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      taxId: '',
      notes: '',
    });
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ClientFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Pavadinimas yra privalomas';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El. paštas yra privalomas';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Neteisingas el. pašto formatas';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefono numeris yra privalomas';
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

    addClient({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      address: formData.address || undefined,
      taxId: formData.taxId || undefined,
      notes: formData.notes || undefined,
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

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Naujas klientas" size="md">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-4">
          {/* Client Name */}
          <Input
            label="Kliento pavadinimas"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="UAB Pavyzdys"
            required
            error={errors.name}
            fullWidth
          />

          {/* Email */}
          <Input
            label="El. paštas"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="info@pavyzdys.lt"
            required
            error={errors.email}
            fullWidth
          />

          {/* Phone */}
          <Input
            label="Telefono numeris"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+370 600 00000"
            required
            error={errors.phone}
            fullWidth
          />

          {/* Address */}
          <Input
            label="Adresas (neprivaloma)"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Vilnius, Gedimino pr. 1"
            fullWidth
          />

          {/* Tax ID */}
          <Input
            label="Įmonės kodas (neprivaloma)"
            value={formData.taxId}
            onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
            placeholder="123456789"
            fullWidth
          />

          {/* Notes */}
          <Textarea
            label="Pastabos (neprivaloma)"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Papildoma informacija apie klientą..."
            rows={3}
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
            Pridėti klientą
          </Button>
        </div>
      </form>
    </Modal>
  );
}

