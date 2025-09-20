import { useState, useEffect, useMemo } from 'react'; // Import useMemo
import { ReportService } from '@/services/ReportService';
import { ReportSummary, SalesByMonth, VehicleSalesByBrand } from '@/types';

interface ReportViewModel {
  isLoading: boolean;
  error: Error | null;
  summary: ReportSummary | null;
  salesByMonth: SalesByMonth[];
  vehicleSalesByBrand: VehicleSalesByBrand[];

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [salesByMonth, setSalesByMonth] = useState<SalesByMonth[]>([]);
  const [vehicleSalesByBrand, setVehicleSalesByBrand] = useState<VehicleSalesByBrand[]>([]);

  // Simulation states
  const [clientes, setClientes] = useState(120);
  const [taxaConversao, setTaxaConversao] = useState(0.6); // 60%
  const [ticketMedio, setTicketMedio] = useState(99380); // Initial value from original mock
  const [percentualFinanciamento, setPercentualFinanciamento] = useState(0.22); // 22%

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        const fetchedSummary = await ReportService.fetchReportSummary();
        const fetchedSalesByMonth = await ReportService.fetchSalesByMonth();
        const fetchedVehicleSalesByBrand = await ReportService.fetchVehicleSalesByBrand();

        setSummary(fetchedSummary);
        setSalesByMonth(fetchedSalesByMonth);
        setVehicleSalesByBrand(fetchedVehicleSalesByBrand);

        // Initialize simulation ticketMedio with fetched summary's value if available
        if (fetchedSummary) {
            setTicketMedio(fetchedSummary.totalSales / fetchedSummary.vehiclesSold || 99380);
        }

      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  // Calculated simulation values using useMemo for performance
  const vendasSimuladas = useMemo(() => Math.round(clientes * taxaConversao), [clientes, taxaConversao]);
  const faturamentoSimulado = useMemo(() => vendasSimuladas * ticketMedio, [vendasSimuladas, ticketMedio]);
  const faturamentoFinanciadoSimulado = useMemo(() => Math.round(faturamentoSimulado * percentualFinanciamento), [faturamentoSimulado, percentualFinanciamento]);
  const faturamentoAVistaSimulado = useMemo(() => faturamentoSimulado - faturamentoFinanciadoSimulado, [faturamentoSimulado, faturamentoFinanciadoSimulado]);
  const financiamentosPrevistosSimulado = useMemo(() => Math.round(vendasSimuladas * percentualFinanciamento), [vendasSimuladas, percentualFinanciamento]);
  const estoqueSimulado = useMemo(() => Math.max((summary?.vehiclesSold || 0) - (vendasSimuladas - (summary?.vehiclesSold || 0)), 0), [vendasSimuladas, summary?.vehiclesSold]);
  const crescimentoSimulado = useMemo(() => ((vendasSimuladas - (summary?.vehiclesSold || 0)) / ((summary?.vehiclesSold || 1))) * 100 + (summary?.vehiclesSold || 0), [vendasSimuladas, summary?.vehiclesSold]);
  const ticketMedioRealSimulado = useMemo(() => vendasSimuladas > 0 ? Math.round(faturamentoSimulado / vendasSimuladas) : 0, [vendasSimuladas, faturamentoSimulado]);
  const conversaoRealSimulado = useMemo(() => clientes > 0 ? (vendasSimuladas / clientes) * 100 : 0, [clientes, vendasSimuladas]);


  return {
    isLoading,
    error,
    summary,
    salesByMonth,
    vehicleSalesByBrand,

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