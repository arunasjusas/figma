import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { AuthForm } from '../components/AuthForm';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

/**
 * Forgot password page
 */
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    setIsSuccess(true);
    setIsLoading(false);
  };

  return (
    <AuthForm
      title="Forgot password"
      subtitle="Įveskite savo el. paštą, kad gautumėte nuorodą slaptažodžio atstatymui."
    >
      {!isSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="El. paštas"
            type="email"
            placeholder="vardas@pavyzdys.lt"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Siunčiama...' : 'Siųsti atstatymo nuorodą'}
          </Button>

          <div className="text-center mt-4">
            <Link to="/login" className="text-sm text-primary hover:underline">
              Atgal Prisijungti
            </Link>
          </div>
        </form>
      ) : (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-status-paid/10 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-status-paid" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-600">
            Atstatymo nuoroda išsiųsta į <strong>{email}</strong>
          </p>
          <Link to="/login">
            <Button variant="primary" className="w-full">
              Grįžti į prisijungimą
            </Button>
          </Link>
        </div>
      )}
    </AuthForm>
  );
}

