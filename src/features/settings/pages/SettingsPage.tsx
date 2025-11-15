import { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';
import { usePageTitle } from '@/hooks/usePageTitle';

/**
 * Settings page - "Nustatymai"
 * Contains personal info, company info, and password settings
 */
export default function SettingsPage() {
  usePageTitle('Nustatymai');
  
  const user = useAuthStore(state => state.user);

  // Personal info state
  const [firstName, setFirstName] = useState(user?.firstName || 'Jonas');
  const [lastName, setLastName] = useState(user?.lastName || 'Jonaitis');
  const [email, setEmail] = useState(user?.email || 'jonas@example.lt');
  const [phone, setPhone] = useState('+370 600 00000');

  // Company info state
  const [companyName, setCompanyName] = useState('UAB Pavyzdys');
  const [companyType, setCompanyType] = useState('UAB');
  const [companyCode, setCompanyCode] = useState('307192225');
  const [vatNumber, setVatNumber] = useState('LT100000000');
  const [iban, setIban] = useState('LT00 0000 0000 0000 0000');
  const [bank, setBank] = useState('SEB bankas');
  const [address, setAddress] = useState('Adresas, miestas');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveAll = (e: FormEvent) => {
    e.preventDefault();
    // Mock save action
    alert('Visi pakeitimai išsaugoti!');
  };

  const handlePasswordChange = (e: FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      alert('Slaptažodžiai nesutampa');
      return;
    }

    if (newPassword.length < 6) {
      alert('Slaptažodis turi būti bent 6 simbolių');
      return;
    }

    // Mock password change
    alert('Slaptažodis pakeistas!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Asmeninė informacija</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Vardas"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jonas"
              />
              <Input
                label="Pavardė"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Jonaitis"
              />
              <Input
                label="El. paštas"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jonas@example.lt"
              />
              <Input
                label="Telefono numeris"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+370 600 00000"
              />
            </div>
          </CardContent>
        </Card>

        {/* Company Information */}
        <Card>
          <CardHeader>
            <CardTitle>Įmonės informacija</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Įmonės pavadinimas"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Įveskite pavadinimą"
              />
              <Input
                label="Įmonės tipas"
                value={companyType}
                onChange={(e) => setCompanyType(e.target.value)}
                placeholder="UAB, MB, IĮ"
              />
              <Input
                label="Įmonės kodas"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                placeholder="307192225"
              />
              <Input
                label="PVM/VAT numeris"
                value={vatNumber}
                onChange={(e) => setVatNumber(e.target.value)}
                placeholder="LT100000000"
              />
              <Input
                label="Banko sąskaita (IBAN)"
                value={iban}
                onChange={(e) => setIban(e.target.value)}
                placeholder="LT00 0000 0000 0000 0000"
              />
              <Input
                label="Bankas"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                placeholder="SEB bankas"
              />
              <div className="md:col-span-2">
                <Input
                  label="Adresas"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Adresas, miestas"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="lg">
            Išsaugoti visus pakeitimus
          </Button>
        </div>
      </form>

      {/* Password Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Slaptažodžio nustatymai</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <Input
              label="Dabartinis slaptažodis"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Naujas slaptažodis"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Pakartoti slaptažodį"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
            />
            <div className="flex justify-end">
              <Button type="submit" variant="primary">
                Išsaugoti pakeitimus
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

