"use client";

import {
  Car,
  ShoppingBag,
  Users,
  Bike,
  TrendingUp,
  PieChart,
  GanttChartSquare,
  CalendarClock,
} from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import EmptyState from "@/components/ui/EmptyState";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";

const ICONS: { [key: string]: React.ReactNode } = {
  ShoppingBag: <ShoppingBag className="h-6 w-6 text-[color:var(--primary)]" />,
  Car: <Car className="h-6 w-6 text-[color:var(--primary)]" />,
  Users: <Users className="h-6 w-6 text-[color:var(--primary)]" />,
  Bike: <Bike className="h-6 w-6 text-[color:var(--primary)]" />,
  TrendingUp: <TrendingUp className="h-4 w-4 mr-1" />,
};

export default function Dashboard() {
  const { isLoading, error, statCards, chartData } = useDashboardViewModel();

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
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart data={chartData} isLoading={isLoading} error={error} />
        <EmptyState
          icon={PieChart}
          title="Gráfico de Estoque em Breve"
          message="O gráfico de distribuição de veículos em estoque estará disponível em breve."
        />
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <EmptyState
          icon={GanttChartSquare}
          title="Veículos Recentes em Breve"
          message="A tabela com os veículos adicionados recentemente estará disponível em breve."
        />
        <EmptyState
          icon={CalendarClock}
          title="Agendamentos em Breve"
          message="A tabela com os próximos agendamentos estará disponível em breve."
        />
      </div>
    </DashboardLayout>
  );
}
