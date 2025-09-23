import { useState, useEffect } from 'react';
import { ProposalService } from '@/services/ProposalService';
import { Proposal } from '@/types';

interface SalePageViewModel {
  isLoading: boolean;
  error: Error | null;
  sales: Proposal[];
}

export const useSalePageViewModel = (): SalePageViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [sales, setSales] = useState<Proposal[]>([]);

  useEffect(() => {
    const loadSales = async () => {
      try {
        setIsLoading(true);
        const allProposals = await ProposalService.fetchProposals();
        const approvedSales = allProposals.filter(p => p.status === 'FINALIZADA');
        setSales(approvedSales);
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