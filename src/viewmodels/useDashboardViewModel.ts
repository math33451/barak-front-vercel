import { useState, useEffect } from 'react';
import { DashboardService } from '@/services/DashboardService';
import { StatCardData, Vehicle, Sale, Appointment, BrandDistribution } from '@/types';

interface DashboardViewModel {
  isLoading: boolean;
  error: Error | null;
  statCards: StatCardData[];
  sales: Sale[];
  recentVehicles: Vehicle[];
  appointments: Appointment[];
  brandDistribution: BrandDistribution[];
}

export const useDashboardViewModel = (): DashboardViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<Omit<DashboardViewModel, 'isLoading' | 'error'> | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const dashboardData = await DashboardService.fetchDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return {
    isLoading,
    error,
    statCards: data?.statCards || [],
    sales: data?.sales || [],
    recentVehicles: data?.recentVehicles || [],
    appointments: data?.appointments || [],
    brandDistribution: data?.brandDistribution || [],
  };
};