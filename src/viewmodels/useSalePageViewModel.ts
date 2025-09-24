import { useState, useEffect } from "react";
import { ProposalService } from "@/services/ProposalService";
import { Proposal } from "@/types";

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
        setError(null);
        const allProposals = await ProposalService.fetchProposals();

        // Filtrar apenas propostas finalizadas e válidas
        const approvedSales = allProposals.filter(
          (p) => p && p.status === "FINALIZADA" && p.client && p.vehicle
        );

        setSales(approvedSales || []);
      } catch (err) {
        console.error("Erro ao carregar vendas:", err);
        setError(err as Error);
        setSales([]); // Garantir que sales não seja undefined
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
