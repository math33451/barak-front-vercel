import { useState, useMemo } from "react";
import {
  ReportSummary,
  SalesByMonth,
  VehicleSalesByBrand,
  TopSeller,
  FinancingByBank,
} from "@/types";
import {
  useReportSummary,
  useSalesByMonth,
  useVehicleSalesByBrand,
  useTopSellers,
  useFinancingByBank,
} from "@/hooks/useReports";

interface ReportViewModel {
  isLoading: boolean;
  error: Error | null;
  summary: ReportSummary | null;
  salesByMonth: SalesByMonth[];
  vehicleSalesByBrand: VehicleSalesByBrand[];
  topSellers: TopSeller[];
  financingByBank: FinancingByBank[];

  // Simulation states
  clientes: number;
  taxaConversao: number;
  ticketMedio: number;
  percentualFinanciamento: number;

  // Simulation handlers
  setClientes: (value: number) => void;
  setTaxaConversao: (value: number) => void;
  setTicketMedio: (value: number) => void;
  setPercentualFinanciamento: (value: number) => void;

  // Calculated simulation values
  vendasSimuladas: number;
  faturamentoSimulado: number;
  faturamentoFinanciadoSimulado: number;
  faturamentoAVistaSimulado: number;
  financiamentosPrevistosSimulado: number;
  estoqueSimulado: number;
  crescimentoSimulado: number;
  ticketMedioRealSimulado: number;
  conversaoRealSimulado: number;
}

export const useReportViewModel = (): ReportViewModel => {
  // React Query hooks
  const {
    data: summary,
    isLoading: summaryLoading,
    error: summaryError,
  } = useReportSummary();
  const {
    data: salesByMonth = [],
    isLoading: salesLoading,
    error: salesError,
  } = useSalesByMonth();
  const {
    data: vehicleSalesByBrand = [],
    isLoading: vehiclesLoading,
    error: vehiclesError,
  } = useVehicleSalesByBrand();
  const {
    data: topSellers = [],
    isLoading: sellersLoading,
    error: sellersError,
  } = useTopSellers();
  const {
    data: financingByBank = [],
    isLoading: financingLoading,
    error: financingError,
  } = useFinancingByBank();

  // Simulation states
  const [clientes, setClientes] = useState(summary?.newClients || 80); // 80 leads/mês é realista para concessionária
  const [taxaConversao, setTaxaConversao] = useState(0.05); // 5% - Taxa realista para concessionárias
  const [ticketMedio, setTicketMedio] = useState(() => {
    if (summary && summary.vehiclesSold > 0) {
      return Math.round(summary.totalSales / summary.vehiclesSold);
    }
    return 85000; // R$ 85k é mais realista para ticket médio
  });
  const [percentualFinanciamento, setPercentualFinanciamento] = useState(0.75); // 75% é realista no Brasil

  // Update simulation defaults when data loads
  useMemo(() => {
    if (summary) {
      setClientes(summary.newClients || 80); // Ajustado para realidade
      if (summary.vehiclesSold > 0) {
        setTicketMedio(Math.round(summary.totalSales / summary.vehiclesSold));
      }
    }
  }, [summary]);

  // Determine loading and error states
  const isLoading =
    summaryLoading ||
    salesLoading ||
    vehiclesLoading ||
    sellersLoading ||
    financingLoading;
  const error =
    summaryError ||
    salesError ||
    vehiclesError ||
    sellersError ||
    financingError;

  // Calculated simulation values using useMemo for performance
  const vendasSimuladas = useMemo(
    () => Math.round(clientes * taxaConversao),
    [clientes, taxaConversao]
  );

  const faturamentoSimulado = useMemo(
    () => vendasSimuladas * ticketMedio,
    [vendasSimuladas, ticketMedio]
  );

  const faturamentoFinanciadoSimulado = useMemo(
    () => Math.round(faturamentoSimulado * percentualFinanciamento),
    [faturamentoSimulado, percentualFinanciamento]
  );

  const faturamentoAVistaSimulado = useMemo(
    () => faturamentoSimulado - faturamentoFinanciadoSimulado,
    [faturamentoSimulado, faturamentoFinanciadoSimulado]
  );

  const financiamentosPrevistosSimulado = useMemo(
    () => Math.round(vendasSimuladas * percentualFinanciamento),
    [vendasSimuladas, percentualFinanciamento]
  );

  const estoqueSimulado = useMemo(
    () =>
      Math.max(
        (summary?.vehiclesSold || 0) -
          (vendasSimuladas - (summary?.vehiclesSold || 0)),
        0
      ),
    [vendasSimuladas, summary?.vehiclesSold]
  );

  const crescimentoSimulado = useMemo(
    () =>
      ((vendasSimuladas - (summary?.vehiclesSold || 0)) /
        (summary?.vehiclesSold || 1)) *
        100 +
      (summary?.vehiclesSold || 0),
    [vendasSimuladas, summary?.vehiclesSold]
  );

  const ticketMedioRealSimulado = useMemo(
    () =>
      vendasSimuladas > 0
        ? Math.round(faturamentoSimulado / vendasSimuladas)
        : 0,
    [vendasSimuladas, faturamentoSimulado]
  );

  const conversaoRealSimulado = useMemo(
    () => (clientes > 0 ? (vendasSimuladas / clientes) * 100 : 0),
    [clientes, vendasSimuladas]
  );

  return {
    isLoading,
    error: error as Error | null,
    summary: summary || null,
    salesByMonth,
    vehicleSalesByBrand,
    topSellers,
    financingByBank,

    // Simulation states
    clientes,
    taxaConversao,
    ticketMedio,
    percentualFinanciamento,

    // Simulation handlers
    setClientes,
    setTaxaConversao,
    setTicketMedio,
    setPercentualFinanciamento,

    // Calculated simulation values
    vendasSimuladas,
    faturamentoSimulado,
    faturamentoFinanciadoSimulado,
    faturamentoAVistaSimulado,
    financiamentosPrevistosSimulado,
    estoqueSimulado,
    crescimentoSimulado,
    ticketMedioRealSimulado,
    conversaoRealSimulado,
  };
};
