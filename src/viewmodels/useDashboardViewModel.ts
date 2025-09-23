import { useState } from 'react';
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

const staticStatCards: StatCardData[] = [
  { title: 'Vendas Totais', value: 'R$ 0,00', icon: 'ShoppingBag', footer: 'Dados de vendas não disponíveis' },
  { title: 'Veículos em Estoque', value: '0', icon: 'Car', footer: 'Dados de estoque não disponíveis' },
  { title: 'Novos Clientes', value: '0', icon: 'Users', footer: 'Dados de clientes não disponíveis' },
  { title: 'Motos em Estoque', value: '0', icon: 'Bike', footer: 'Dados de estoque não disponíveis' },
];

export const useDashboardViewModel = (): DashboardViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  return {
    isLoading,
    error,
    statCards: staticStatCards,
    sales: [],
    recentVehicles: [],
    appointments: [],
    brandDistribution: [],
  };
};