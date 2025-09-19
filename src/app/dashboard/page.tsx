"use client";

import { Car, ShoppingBag, Users, Bike, TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import VehicleStockChart from "@/components/dashboard/VehicleStockChart";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import BrandDistributionChart from "@/components/ui/BrandDistributionChart";
import RecentVehiclesTable from "@/components/dashboard/RecentVehiclesTable";
import AppointmentsTable from "@/components/ui/AppointmentsTable";
import { useDashboardViewModel } from "@/viewmodels/useDashboardViewModel";
import { useEffect } from "react"; // Import useEffect

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

const ICONS: { [key: string]: React.ReactNode } = {
    ShoppingBag: <ShoppingBag className="h-6 w-6 text-[color:var(--primary)]" />,
    Car: <Car className="h-6 w-6 text-[color:var(--primary)]" />,
    Users: <Users className="h-6 w-6 text-[color:var(--primary)]" />,
    Bike: <Bike className="h-6 w-6 text-[color:var(--primary)]" />,
    TrendingUp: <TrendingUp className="h-4 w-4 mr-1" />,
};

export default function Dashboard() {
  useEffect(() => { // Move Chart.js registration inside useEffect
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
  }, []); // Run only once on mount

  const { 
    isLoading, 
    error, 
    statCards, 
    sales, 
    recentVehicles, 
    appointments, 
    brandDistribution 
  } = useDashboardViewModel();

  if (isLoading) {
    return <DashboardLayout title="Dashboard" activePath="/dashboard"><div>Loading...</div></DashboardLayout>;
  }

  if (error) {
    return <DashboardLayout title="Dashboard" activePath="/dashboard"><div>Error: {error.message}</div></DashboardLayout>;
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
            trend={stat.trend && {
                ...stat.trend,
                icon: ICONS[stat.trend.icon as string]
            }}
            footer={stat.footer}
          />
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart salesData={sales} />
        <VehicleStockChart stockData={brandDistribution} />
      </div>

      {/* Secondary Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <PerformanceChart />
        <BrandDistributionChart brandData={brandDistribution} />
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <RecentVehiclesTable vehicles={recentVehicles} />
        <AppointmentsTable appointments={appointments} />
      </div>
    </DashboardLayout>
  );
}
