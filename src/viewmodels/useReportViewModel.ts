import { useState, useEffect, useMemo } from 'react';
import { ProposalService } from '@/services/ProposalService';
import { ClientService } from '@/services/ClientService';
import { BankService } from '@/services/BankService';
import { Proposal, Client, Bank, ReportSummary, SalesByMonth, VehicleSalesByBrand, TopSeller, FinancingByBank } from '@/types';

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
  const [vehicleSalesByBrand, setVehicleSalesByBrand] = useState<VehicleSalesByBrand[]>([]);
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
        const [proposals, clients, banks] = await Promise.all([
          ProposalService.fetchProposals(),
          ClientService.fetchClients(),
          BankService.fetchBanks(),
        ]);

        const approvedProposals = proposals.filter(p => p.status === 'FINALIZADA');

        // Calculate summary
        const totalSales = approvedProposals.reduce((acc, p) => acc + p.value, 0);
        const vehiclesSold = approvedProposals.length;
        const newClients = clients.length;
        const financingContracts = approvedProposals.filter(p => p.financing).length;
        const summaryData: ReportSummary = { totalSales, vehiclesSold, newClients, financingContracts };
        setSummary(summaryData);

        // Calculate sales by month
        const salesByMonthData = approvedProposals.reduce((acc, p) => {
          const month = new Date(p.updatedAt).toLocaleString('default', { month: 'long' });
          const existingMonth = acc.find(m => m.month === month);
          if (existingMonth) {
            existingMonth.sales++;
          } else {
            acc.push({ month, sales: 1 });
          }
          return acc;
        }, [] as SalesByMonth[]);
        setSalesByMonth(salesByMonthData);

        // Calculate vehicle sales by brand
        const vehicleSalesByBrandData = approvedProposals.reduce((acc, p) => {
          const brand = p.vehicle.brand;
          const existingBrand = acc.find(b => b.brand === brand);
          if (existingBrand) {
            existingBrand.sales++;
          } else {
            acc.push({ brand, sales: 1 });
          }
          return acc;
        }, [] as VehicleSalesByBrand[]);
        setVehicleSalesByBrand(vehicleSalesByBrandData);

        // Calculate top sellers
        const topSellersData = approvedProposals.reduce((acc, p) => {
          const sellerName = p.employee.name;
          const existingSeller = acc.find(s => s.name === sellerName);
          if (existingSeller) {
            existingSeller.sales++;
          } else {
            acc.push({ name: sellerName, sales: 1 });
          }
          return acc;
        }, [] as TopSeller[]).sort((a, b) => b.sales - a.sales).slice(0, 5);
        setTopSellers(topSellersData);

        // Calculate financing by bank
        const financingByBankData = approvedProposals.filter(p => p.financing).reduce((acc, p) => {
          const bankName = p.financing.bank.name;
          const existingBank = acc.find(b => b.bank === bankName);
          if (existingBank) {
            existingBank.count++;
          } else {
            acc.push({ bank: bankName, count: 1 });
          }
          return acc;
        }, [] as FinancingByBank[]);
        setFinancingByBank(financingByBankData);

        // Initialize simulation
        setClientes(clients.length);
        setTicketMedio(vehiclesSold > 0 ? totalSales / vehiclesSold : 0);

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