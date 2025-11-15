import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthForm } from '../components/AuthForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * Reset password page
 */
export default function ResetPasswordPage() {
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Slaptažodžiai nesutampa');
      return;
    }

    if (password.length < 6) {
      alert('Slaptažodis turi būti bent 6 simbolių');
      return;
    }

    setIsLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsLoading(false);
    navigate('/login');
  };

  const handleClear = () => {
    setCode('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <AuthForm
      title="Įveskite atstatymo kodą"
      subtitle="Įveskite gautą kodą iš el. pašto ir sukurkite naują slaptažodį."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Kodas"
          type="text"
          placeholder="Įveskite 6 skaitmenų kodą"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          required
        />

        <div className="relative">
          <Input
            label="Naujas slaptažodis"
            type={showPassword ? 'text' : 'password'}
            placeholder="Naujas slaptažodis (min 6)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Pakartokite slaptažodį"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Pakartokite slaptažodį"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Kuriama...' : 'Sukurti naują slaptažodį'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handleClear}
          >
            Išvalyti
          </Button>
        </div>
      </form>
    </AuthForm>
  );
}

