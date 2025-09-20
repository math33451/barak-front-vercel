import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/AuthService';
import { useAuth } from '@/contexts/AuthContext';
import { UserCredentials } from '@/types';

interface LoginViewModel {
  credentials: UserCredentials;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useLoginViewModel = (): LoginViewModel => {
  const [credentials, setCredentials] = useState<UserCredentials>({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const success = await AuthService.login(credentials);
      if (success) {
        login(); // Update AuthContext
        router.push('/dashboard');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
};