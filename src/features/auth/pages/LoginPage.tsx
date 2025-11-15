import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { AuthForm } from '../components/AuthForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/store/authStore';

/**
 * Login page
 */
export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthForm title="Prisijungti">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="El. paštas"
          type="email"
          placeholder="vardas@pavyzdys.lt"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative">
          <Input
            label="Slaptažodis"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
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

        <div className="flex items-center justify-between">
          <Link
            to="/forgot-password"
            className="text-sm text-primary hover:underline"
          >
            Can't log in?
          </Link>
        </div>

        <Button
          type="submit"
          variant="primary"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Jungiamasi...' : 'Prisijungti'}
        </Button>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ARBA</span>
          </div>
        </div>

        <div className="space-y-3">
          <Button type="button" variant="outline" className="w-full">
            Tęsti su Google
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Tęsti su Facebook
          </Button>
          <Button type="button" variant="outline" className="w-full">
            Prisijungti su el. paštu
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500 mt-6">
          Secure Login with reCAPTCHA subject to Google{' '}
          <a href="#" className="text-primary hover:underline">Terms</a>
          {' & '}
          <a href="#" className="text-primary hover:underline">Privacy</a>
        </p>

        <div className="text-center mt-4">
          <span className="text-sm text-gray-600">Neturite paskyros? </span>
          <Link to="/signup" className="text-sm text-primary hover:underline font-medium">
            Sukurti
          </Link>
        </div>
      </form>
    </AuthForm>
  );
}

