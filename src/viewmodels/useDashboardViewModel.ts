import { useMemo } from "react";
import {
  StatCardData,
  Vehicle,
  Sale,
  Appointment,
  BrandDistribution,
} from "@/types";
import { useReportSummary, useSalesByMonth } from "@/hooks/useReports";

interface DashboardViewModel {
  isLoading: boolean;
  error: Error | null;
  statCards: StatCardData[];
  sales: Sale[];
  recentVehicles: Vehicle[];
  appointments: Appointment[];
  brandDistribution: BrandDistribution[];
  chartData: Array<{ month: string; sales: number }>;
}

export const useDashboardViewModel = (): DashboardViewModel => {
  // Usar React Query hooks
  const {
    data: summaryData,
    isLoading: summaryLoading,
    error: summaryError,
  } = useReportSummary();
  const {
    data: salesByMonthData,
    isLoading: salesLoading,
    error: salesError,
  } = useSalesByMonth();

  const isLoading = summaryLoading || salesLoading;
  const error = summaryError || salesError;

  // Calcular stat cards baseado nos dados reais
  const statCards: StatCardData[] = useMemo(() => {
    if (!summaryData) {
      return [
        {
          title: "Vendas Totais",
          value: "Carregando...",
          icon: "ShoppingBag",
          footer: "Carregando dados",
        },
        {
          title: "Veículos Vendidos",
          value: "Carregando...",
          icon: "Car",
          footer: "Carregando dados",
        },
        {
          title: "Novos Clientes",
          value: "Carregando...",
          icon: "Users",
          footer: "Carregando dados",
        },
        {
          title: "Despesas Totais",
          value: "Carregando...",
          icon: "Bike",
          footer: "Carregando dados",
        },
      ];
    }

    return [
      {
        title: "Vendas Totais",
        value: summaryData.totalSales?.toString() || "0",
        icon: "ShoppingBag",
        footer: "Propostas finalizadas",
        trend:
          summaryData.totalSales > 0
            ? {
                value: "+100%",
                isPositive: true,
                icon: "TrendingUp",
              }
            : undefined,
      },
      {
        title: "Veículos Vendidos",
        value: summaryData.vehiclesSold?.toString() || "0",
        icon: "Car",
        footer: "Veículos entregues",
      },
      {
        title: "Novos Clientes",
        value: summaryData.newClients?.toString() || "0",
        icon: "Users",
        footer: "Clientes únicos",
      },
      {
        title: "Despesas Totais",
        value: `R$ ${summaryData.totalExpenses?.toString() || "0,00"}`,
        icon: "Bike",
        footer: "Total de gastos",
      },
    ];
  }, [summaryData]);

  // Processar dados do gráfico
  const chartData = useMemo(() => {
    if (!salesByMonthData) return [];

    return salesByMonthData.map((item) => ({
      month: item.month || "",
      sales: Number(item.sales) || 0,
    }));
  }, [salesByMonthData]);

  return {
    isLoading,
    error: error as Error | null,
    statCards,
    sales: [],
    recentVehicles: [],
    appointments: [],
    brandDistribution: [],
    chartData,
  };
};
