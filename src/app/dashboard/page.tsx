"use client";

import { Car, ShoppingBag, Users, Bike, TrendingUp } from "lucide-react";

// Chart.js registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import VehicleStockChart from "@/components/dashboard/VehicleStockChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import BrandDistributionChart from "@/components/ui/BrandDistributionChart";
import RecentVehiclesTable from "@/components/dashboard/RecentVehiclesTable";
import AppointmentsTable from "@/components/ui/AppointmentsTable";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  return (
    <DashboardLayout title="Dashboard" activePath="/dashboard">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Vendas Totais"
          value="R$ 1.856.400"
          icon={<ShoppingBag className="h-6 w-6 text-[color:var(--primary)]" />}
          trend={{
            value: "+12.5% no mês",
            isPositive: true,
            icon: <TrendingUp className="h-4 w-4 mr-1" />,
          }}
        />

        <StatCard
          title="Veículos Vendidos"
          value="187"
          icon={<Car className="h-6 w-6 text-[color:var(--primary)]" />}
          trend={{
            value: "+8.3% no mês",
            isPositive: true,
            icon: <TrendingUp className="h-4 w-4 mr-1" />,
          }}
        />

        <StatCard
          title="Novos Clientes"
          value="94"
          icon={<Users className="h-6 w-6 text-[color:var(--primary)]" />}
          trend={{
            value: "+5.2% no mês",
            isPositive: true,
            icon: <TrendingUp className="h-4 w-4 mr-1" />,
          }}
        />

        <StatCard
          title="Estoque Atual"
          value="212"
          icon={<Bike className="h-6 w-6 text-[color:var(--primary)]" />}
          footer="138 carros, 74 motos"
        />
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart />
        <VehicleStockChart />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart />
        <BrandDistributionChart />
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <RecentVehiclesTable />
        <AppointmentsTable />
      </div>
    </DashboardLayout>
  );
}
