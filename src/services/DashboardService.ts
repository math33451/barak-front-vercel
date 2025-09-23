import { StatCardData, Vehicle, Sale, Appointment, BrandDistribution } from '@/types';
import { httpClient } from '@/infra/httpClient';

interface DashboardData {
  statCards: StatCardData[];
  sales: Sale[];
  recentVehicles: Vehicle[];
  appointments: Appointment[];
  brandDistribution: BrandDistribution[];
}

const fetchDashboardData = async (): Promise<DashboardData> => {
  const statCards = await httpClient.get<StatCardData[]>('/dashboard/stat-cards');
  const sales = await httpClient.get<Sale[]>('/dashboard/sales');
  const recentVehicles = await httpClient.get<Vehicle[]>('/dashboard/recent-vehicles');
  const appointments = await httpClient.get<Appointment[]>('/dashboard/appointments');
  const brandDistribution = await httpClient.get<BrandDistribution[]>('/dashboard/brand-distribution');

  return {
    statCards,
    sales,
    recentVehicles,
    appointments,
    brandDistribution,
  };
};

export const DashboardService = {
  fetchDashboardData,
};