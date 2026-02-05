"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Car,
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
  Target,
  Percent,
  DollarSign,
  CalendarCheck,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import MetricCard from "../../components/dashboard/MetricCard";
import DonutChart from "../../components/dashboard/DonutChart";
import ProgressBar from "../../components/dashboard/ProgressBar";
import RecentActivity from "../../components/dashboard/RecentActivity";
import TopSellers from "../../components/dashboard/TopSellers";
import KPICard from "../../components/dashboard/KPICard";
import StatsComparison from "../../components/dashboard/StatsComparison";
import AlertsPanel, {
  useBusinessAlerts,
} from "../../components/dashboard/AlertsPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";
import ClosureModal from "@/components/modals/ClosureModal";

const ICONS: { [key: string]: React.ReactNode } = {
  ShoppingBag: <ShoppingBag className="h-6 w-6 text-blue-600" />,
  Car: <Car className="h-6 w-6 text-blue-600" />,
  Users: <Users className="h-6 w-6 text-blue-600" />,
  Bike: <CreditCard className="h-6 w-6 text-blue-600" />,
  TrendingUp: <TrendingUp className="h-4 w-4 mr-1" />,
};

export default function Dashboard() {
  const router = useRouter();
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false);
  const {
    isLoading,
    error,
    statCards,
    chartData,
    vehicleSalesByBrand,
    topSellers,
    financingByBank,
    recentActivities,
    conversionRate,
    averageTicket,
    totalRevenue,
    monthlyTarget,
    inventoryStatus,
    weeklyStats,
    kpiMetrics,
  } = useDashboardViewModel();

  const { generateAlerts } = useBusinessAlerts();
  const alerts = generateAlerts({
    totalVehicles:
      parseInt(
        (statCards.find((card) => card.title.includes("Veículos"))
          ?.value as string) || "0"
      ) || 0,
    conversionRate,
    averageTicket,
    totalSales: totalRevenue,
    newClients:
      parseInt(
        (statCards.find((card) => card.title.includes("Clientes"))
          ?.value as string) || "0"
      ) || 0,
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Dashboard" activePath="/dashboard">
        <LoadingSpinner size="lg" message="Carregando dashboard..." />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Dashboard" activePath="/dashboard">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">Erro: {error.message}</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Dashboard" activePath="/dashboard">
      {/* Header com resumo executivo */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold">Visão Geral do Negócio</h1>
            <button
              onClick={() => setIsClosureModalOpen(true)}
              className="btn btn-sm bg-white/20 border-white/30 text-white hover:bg-white/30 hover:border-white/50 backdrop-blur-sm flex items-center gap-2"
            >
              <CalendarCheck className="w-4 h-4" />
              Fechar Mês
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">
                R$ {totalRevenue.toLocaleString()}
              </div>
              <div className="text-blue-100">Receita Total</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {conversionRate.toFixed(1)}%
              </div>
              <div className="text-blue-100">Taxa de Conversão</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                R$ {averageTicket.toLocaleString()}
              </div>
              <div className="text-blue-100">Ticket Médio</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">
                {((totalRevenue / monthlyTarget) * 100).toFixed(0)}%
              </div>
              <div className="text-blue-100">Meta do Mês</div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={ICONS[stat.icon as string]}
            trend={
              stat.trend && {
                ...stat.trend,
                icon: ICONS[stat.trend.icon as string],
              }
            }
            footer={stat.footer}
          />
        ))}
      </div>

      {/* Métricas Avançadas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard
          title="Taxa de Conversão"
          value={`${conversionRate.toFixed(1)}%`}
          change={{
            value: "+2.5%",
            isPositive: true,
          }}
          icon={<Percent className="h-5 w-5 text-blue-600" />}
          onClick={() => router.push("/propostas")}
        />
        <MetricCard
          title="Ticket Médio"
          value={`R$ ${averageTicket.toLocaleString()}`}
          change={{
            value: "+5.2%",
            isPositive: true,
          }}
          icon={<DollarSign className="h-5 w-5 text-blue-600" />}
          onClick={() => router.push("/vendas")}
        />
        <MetricCard
          title="Meta do Mês"
          value={`${((totalRevenue / monthlyTarget) * 100).toFixed(0)}%`}
          icon={<Target className="h-5 w-5 text-blue-600" />}
          onClick={() => router.push("/relatorios")}
        />
        <MetricCard
          title="Vendas Hoje"
          value="7"
          change={{
            value: "+40%",
            isPositive: true,
          }}
          icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
          onClick={() => router.push("/propostas")}
        />
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KPICard
          title="Conversão de Leads"
          value={conversionRate}
          previousValue={Math.max(0, conversionRate - 15)}
          target={75}
          unit="%"
          onClick={() => router.push("/propostas")}
        />
        <KPICard
          title="Ticket Médio"
          value={averageTicket}
          previousValue={Math.max(0, averageTicket - 5000)}
          unit=" R$"
          onClick={() => router.push("/vendas")}
        />
        <KPICard
          title="Satisfação Cliente"
          value={kpiMetrics.customerSatisfaction.current}
          previousValue={kpiMetrics.customerSatisfaction.previous}
          target={kpiMetrics.customerSatisfaction.target}
          unit="/5"
          onClick={() => router.push("/clientes")}
        />
        <KPICard
          title="Rotatividade Estoque"
          value={kpiMetrics.stockTurnover.current}
          previousValue={kpiMetrics.stockTurnover.previous}
          target={kpiMetrics.stockTurnover.target}
          unit=" dias"
          onClick={() => router.push("/veiculos")}
        />
      </div>

      {/* Comparativo Semanal */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Semanal
        </h3>
        <StatsComparison
          stats={[
            {
              title: "Vendas",
              current: weeklyStats.sales.current,
              previous: weeklyStats.sales.previous,
              period: "Esta semana",
              unit: " vendas",
              icon: <div className="w-4 h-4 bg-green-500 rounded" />,
            },
            {
              title: "Leads",
              current: weeklyStats.leads.current,
              previous: weeklyStats.leads.previous,
              period: "Esta semana",
              unit: " leads",
              icon: <div className="w-4 h-4 bg-blue-500 rounded" />,
            },
            {
              title: "Test Drives",
              current: weeklyStats.testDrives.current,
              previous: weeklyStats.testDrives.previous,
              period: "Esta semana",
              unit: " drives",
              icon: <div className="w-4 h-4 bg-purple-500 rounded" />,
            },
            {
              title: "Orçamentos",
              current: weeklyStats.quotations.current,
              previous: weeklyStats.quotations.previous,
              period: "Esta semana",
              unit: " orçamentos",
              icon: <div className="w-4 h-4 bg-orange-500 rounded" />,
            },
          ]}
        />
      </div>

      {/* Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de Vendas */}
        <div className="lg:col-span-2">
          <SalesChart data={chartData} isLoading={isLoading} error={error} />
        </div>

        {/* Status do Inventário */}
        <div>
          <DonutChart
            data={inventoryStatus}
            title="Status do Inventário"
            centerLabel="Veículos"
          />
        </div>
      </div>

      {/* Progresso da Meta */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Progresso da Meta Mensal
          </h3>
          <ProgressBar
            label="Receita"
            value={totalRevenue}
            max={monthlyTarget}
            color="blue"
            showValues={true}
            size="lg"
          />
        </div>
      </div>

      {/* Análises Detalhadas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Vendas por Marca */}
        <DonutChart
          data={vehicleSalesByBrand.slice(0, 5).map((item, index) => ({
            label: item.brand,
            value: item.sales,
            color:
              ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"][index] ||
              "#6b7280",
          }))}
          title="Vendas por Marca"
          centerLabel="Vendas"
        />

        {/* Financiamento por Banco */}
        <DonutChart
          data={financingByBank.slice(0, 5).map((item, index) => ({
            label: item.bank,
            value: item.count,
            color:
              ["#06b6d4", "#84cc16", "#f97316", "#ec4899", "#6366f1"][index] ||
              "#6b7280",
          }))}
          title="Financiamentos por Banco"
          centerLabel="Contratos"
        />
      </div>

      {/* Seção Inferior: Atividades, Top Performers e Alertas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <RecentActivity activities={recentActivities} />
        <TopSellers
          sellers={topSellers}
          onViewAll={() => router.push("/funcionarios")}
        />
        <AlertsPanel alerts={alerts} maxVisible={4} />
      </div>

      <ClosureModal
        isOpen={isClosureModalOpen}
        onClose={() => setIsClosureModalOpen(false)}
      />
    </DashboardLayout>
  );
}
