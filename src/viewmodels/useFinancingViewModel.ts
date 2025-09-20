import { useState, useEffect } from 'react';
import { FinancingService } from '@/services/FinancingService';
import { FinancingOption } from '@/types';

interface FinancingViewModel {
  isLoading: boolean;
  error: Error | null;
  financingOptions: FinancingOption[];
}

export const useFinancingViewModel = (): FinancingViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [financingOptions, setFinancingOptions] = useState<FinancingOption[]>([]);

  useEffect(() => {
    const loadFinancingOptions = async () => {
      try {
        setIsLoading(true);
        const fetchedOptions = await FinancingService.fetchFinancingOptions();
        setFinancingOptions(fetchedOptions);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadFinancingOptions();
  }, []);

  return {
    isLoading,
    error,
    financingOptions,
  };
};