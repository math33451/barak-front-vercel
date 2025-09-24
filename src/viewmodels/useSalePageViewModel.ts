import { useMemo } from "react";
import { useSales } from "@/hooks/useProposalsAndSales";
import { Proposal } from "@/types";

interface SalePageViewModel {
  isLoading: boolean;
  error: Error | null;
  sales: Proposal[];
}

export const useSalePageViewModel = (): SalePageViewModel => {
  // Usar React Query hook para vendas
  const { data: salesData, isLoading, error } = useSales();

  // Converter dados de vendas para formato de Proposal se necessário
  const sales = useMemo(() => {
    if (!salesData) return [];

    // Se salesData já são Proposals (vindas do ProposalService), usar diretamente
    // Se são Sale[], converter para Proposal format
    if (Array.isArray(salesData) && salesData.length > 0) {
      const firstItem = salesData[0];

      // Verificar se já são objetos Proposal
      if ("client" in firstItem && "vehicle" in firstItem) {
        return salesData as unknown as Proposal[];
      }

      // Converter Sale[] para Proposal[]
      return salesData.map(
        (sale: { date: string; amount: number }, index: number) => ({
          id: index.toString(),
          status: "FINALIZADA" as const,
          value: sale.amount || 0,
          updatedAt: sale.date,
          client: { id: "1", name: "Cliente", email: "", phone: "" },
          vehicle: {
            id: "1",
            name: "Veículo",
            price: sale.amount || 0,
            type: "car",
            status: "sold",
          },
          sellerId: "1",
          bankId: "1",
          isFinanced: "SIM" as const,
          ilaValue: 0,
          returnValue: 0,
          bankReturnMultiplier: 1,
          selectedReturn: 1,
        })
      ) as Proposal[];
    }

    return [];
  }, [salesData]);

  return {
    isLoading,
    error: error as Error | null,
    sales,
  };
};
