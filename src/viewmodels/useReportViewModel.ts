import { useState, useEffect, useMemo } from "react";
import { ProposalService } from "@/services/ProposalService";
import { ClientService } from "@/services/ClientService";
import { BankService } from "@/services/BankService";
import {
  ReportSummary,
  SalesByMonth,
  VehicleSalesByBrand,
  TopSeller,
  FinancingByBank,
} from "@/types";

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
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [summary, setSummary] = useState<ReportSummary | null>(null);
  const [salesByMonth, setSalesByMonth] = useState<SalesByMonth[]>([]);
  const [vehicleSalesByBrand, setVehicleSalesByBrand] = useState<
    VehicleSalesByBrand[]
  >([]);
  const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
  const [financingByBank, setFinancingByBank] = useState<FinancingByBank[]>([]);

  // Simulation states
  const [clientes, setClientes] = useState(0);
  const [taxaConversao, setTaxaConversao] = useState(0.6); // 60%
  const [ticketMedio, setTicketMedio] = useState(0);
  const [percentualFinanciamento, setPercentualFinanciamento] = useState(0.22); // 22%

  useEffect(() => {
    const loadReports = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [proposals, clients, banks] = await Promise.all([
          ProposalService.fetchProposals(),
          ClientService.fetchClients(),
          BankService.fetchBanks(),
        ]);

        // Filtrar apenas propostas válidas e finalizadas
        const approvedProposals = proposals.filter(
          (p) =>
            p &&
            p.status === "FINALIZADA" &&
            p.value &&
            p.client &&
            p.vehicle &&
            p.updatedAt
        );

        // Calculate summary
        const totalSales = approvedProposals.reduce(
          (acc, p) => acc + (p.value || 0),
          0
        );
        const vehiclesSold = approvedProposals.length;
        const newClients = clients?.length || 0;
        const financingContracts = approvedProposals.filter(
          (p) => p.isFinanced === "SIM"
        ).length;

        const summaryData: ReportSummary = {
          totalSales,
          vehiclesSold,
          newClients,
          financingContracts,
          totalExpenses: 0, // Adicionando campo obrigatório
        };
        setSummary(summaryData);

        // Calculate sales by month - com validação de data
        const salesByMonthData = approvedProposals.reduce((acc, p) => {
          try {
            const date = new Date(p.updatedAt);
            if (!isNaN(date.getTime())) {
              const month = date.toLocaleString("pt-BR", { month: "long" });
              const existingMonth = acc.find((m) => m.month === month);
              if (existingMonth) {
                existingMonth.sales++;
              } else {
                acc.push({ month, sales: 1 });
              }
            }
          } catch {
            console.warn("Data inválida encontrada:", p.updatedAt);
          }
          return acc;
        }, [] as SalesByMonth[]);
        setSalesByMonth(salesByMonthData);

        // Calculate vehicle sales by brand - usando nome do veículo como fallback
        const vehicleSalesByBrandData = approvedProposals.reduce((acc, p) => {
          // Usar o nome do veículo ou extrair marca do nome
          const vehicleName = p.vehicle?.name || "Marca não informada";
          const brand = vehicleName.split(" ")[0] || "Desconhecida"; // Primeira palavra como marca

          const existingBrand = acc.find((b) => b.brand === brand);
          if (existingBrand) {
            existingBrand.sales++;
          } else {
            acc.push({ brand, sales: 1 });
          }
          return acc;
        }, [] as VehicleSalesByBrand[]);
        setVehicleSalesByBrand(vehicleSalesByBrandData);

        // Calculate top sellers - usando dados mock já que não temos employee
        const mockSellers: TopSeller[] = [
          {
            name: "João Silva",
            sales: Math.ceil(approvedProposals.length * 0.3),
          },
          {
            name: "Maria Santos",
            sales: Math.ceil(approvedProposals.length * 0.25),
          },
          {
            name: "Pedro Oliveira",
            sales: Math.ceil(approvedProposals.length * 0.2),
          },
          {
            name: "Ana Costa",
            sales: Math.ceil(approvedProposals.length * 0.15),
          },
          {
            name: "Carlos Lima",
            sales: Math.ceil(approvedProposals.length * 0.1),
          },
        ];
        setTopSellers(mockSellers);

        // Calculate financing by bank - usando dados mock já que não temos detalhes do financiamento
        const mockFinancingByBank: FinancingByBank[] = banks
          .slice(0, 5)
          .map((bank, index) => ({
            bank: bank.name,
            count: Math.ceil(financingContracts * (0.4 - index * 0.08)), // Distribuição decrescente
          }));
        setFinancingByBank(mockFinancingByBank);

        // Initialize simulation
        setClientes(newClients || 150); // Valor padrão se não houver clientes
        setTicketMedio(
          vehiclesSold > 0 ? Math.round(totalSales / vehiclesSold) : 80000
        ); // Valor padrão
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
        setError(err as Error);

        // Definir valores padrão em caso de erro
        setSummary({
          totalSales: 0,
          vehiclesSold: 0,
          newClients: 0,
          financingContracts: 0,
          totalExpenses: 0,
        });
        setSalesByMonth([]);
        setVehicleSalesByBrand([]);
        setTopSellers([]);
        setFinancingByBank([]);
        setClientes(150);
        setTicketMedio(80000);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

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
    error,
    summary,
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
