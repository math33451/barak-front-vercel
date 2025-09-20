import { useState, useEffect } from 'react';
import { SalePageService } from '@/services/SalePageService';
import { Sale } from '@/types';

interface SalePageViewModel {
  isLoading: boolean;
  error: Error | null;
  sales: Sale[];
}

export const useSalePageViewModel = (): SalePageViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);

  useEffect(() => {
    const loadSales = async () => {
      try {
        setIsLoading(true);
        const fetchedSales = await SalePageService.fetchSales();
        setSales(fetchedSales);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, []);

  return {
    isLoading,
    error,
    sales,
  };
};