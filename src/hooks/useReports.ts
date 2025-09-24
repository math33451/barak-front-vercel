import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ReportService } from "@/services/ReportService";

// Query keys - centralizados para consistency
export const reportKeys = {
  all: ["reports"] as const,
  summary: () => [...reportKeys.all, "summary"] as const,
  salesByMonth: () => [...reportKeys.all, "salesByMonth"] as const,
  vehiclesByBrand: () => [...reportKeys.all, "vehiclesByBrand"] as const,
  topSellers: () => [...reportKeys.all, "topSellers"] as const,
  financingByBank: () => [...reportKeys.all, "financingByBank"] as const,
};

// Hook para resumo do dashboard
export const useReportSummary = () => {
  return useQuery({
    queryKey: reportKeys.summary(),
    queryFn: ReportService.fetchReportSummary,
    staleTime: 2 * 60 * 1000, // 2 minutos - dados críticos
    gcTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para vendas por mês (gráfico)
export const useSalesByMonth = () => {
  return useQuery({
    queryKey: reportKeys.salesByMonth(),
    queryFn: ReportService.fetchSalesByMonth,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para vendas por marca
export const useVehicleSalesByBrand = () => {
  return useQuery({
    queryKey: reportKeys.vehiclesByBrand(),
    queryFn: ReportService.fetchVehicleSalesByBrand,
    staleTime: 10 * 60 * 1000, // 10 minutos - menos crítico
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para top vendedores
export const useTopSellers = () => {
  return useQuery({
    queryKey: reportKeys.topSellers(),
    queryFn: ReportService.fetchTopSellers,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para financiamentos por banco
export const useFinancingByBank = () => {
  return useQuery({
    queryKey: reportKeys.financingByBank(),
    queryFn: ReportService.fetchFinancingByBank,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hook para invalidar todos os relatórios
export const useInvalidateReports = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () =>
      queryClient.invalidateQueries({ queryKey: reportKeys.all }),
    invalidateSummary: () =>
      queryClient.invalidateQueries({ queryKey: reportKeys.summary() }),
    invalidateSalesChart: () =>
      queryClient.invalidateQueries({ queryKey: reportKeys.salesByMonth() }),
  };
};
