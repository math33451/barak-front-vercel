import { useState, useEffect } from 'react';
import { BankService } from '@/services/BankService';
import { Bank } from '@/types';

interface BankViewModel {
  isLoading: boolean;
  error: Error | null;
  banks: Bank[];
}

export const useBankViewModel = (): BankViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    const loadBanks = async () => {
      try {
        setIsLoading(true);
        const fetchedBanks = await BankService.fetchBanks();
        setBanks(fetchedBanks);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBanks();
  }, []);

  return {
    isLoading,
    error,
    banks,
  };
};