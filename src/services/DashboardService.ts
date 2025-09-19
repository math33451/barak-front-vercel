import { StatCardData, Vehicle, Sale, Appointment, BrandDistribution } from '@/types';

// Mock data - in a real application, this would come from an API
const mockStatCards: StatCardData[] = [
  {
    title: "Vendas Totais",
    value: "R$ 1.856.400",
    icon: "ShoppingBag",
    trend: {
      value: "+12.5% no mês",
      isPositive: true,
      icon: "TrendingUp",
    },
  },
  {
    title: "Veículos Vendidos",
    value: "187",
    icon: "Car",
    trend: {
      value: "+8.3% no mês",
      isPositive: true,
      icon: "TrendingUp",
    },
  },
  {
    title: "Novos Clientes",
    value: "94",
    icon: "Users",
    trend: {
      value: "+5.2% no mês",
      isPositive: true,
      icon: "TrendingUp",
    },
  },
  {
    title: "Estoque Atual",
    value: "212",
    icon: "Bike",
    footer: "138 carros, 74 motos",
  },
];

const mockSales: Sale[] = [
  { date: '2025-08-01', amount: 150000 },
  { date: '2025-08-02', amount: 200000 },
  { date: '2025-08-03', amount: 120000 },
  { date: '2025-08-04', amount: 250000 },
  { date: '2025-08-05', amount: 180000 },
  { date: '2025-08-06', amount: 300000 },
  { date: '2025-08-07', amount: 220000 },
];

const mockRecentVehicles: Vehicle[] = [
    {
        id: "1",
        name: "Honda Civic",
        price: 75000,
        type: "car",
        status: "sold",
        imageUrl: "/honda-civic.png",
      },
      {
        id: "2",
        name: "Yamaha MT-07",
        price: 35000,
        type: "motorcycle",
        status: "in_stock",
        imageUrl: "/yamaha-mt07.png",
      },
      {
        id: "3",
        name: "Toyota Corolla",
        price: 85000,
        type: "car",
        status: "sold",
        imageUrl: "/toyota-corolla.png",
      },
      {
        id: "4",
        name: "Kawasaki Ninja 400",
        price: 28000,
        type: "motorcycle",
        status: "in_stock",
        imageUrl: "/kawasaki-ninja-400.png",
      },
];

const mockAppointments: Appointment[] = [
    {
        id: "1",
        clientName: "Carlos Silva",
        date: "2025-09-25T10:00:00",
        vehicle: mockRecentVehicles[0],
        status: "scheduled",
      },
      {
        id: "2",
        clientName: "Mariana Costa",
        date: "2025-09-25T14:30:00",
        vehicle: mockRecentVehicles[2],
        status: "scheduled",
      },
      {
        id: "3",
        clientName: "João Santos",
        date: "2025-09-24T11:00:00",
        vehicle: mockRecentVehicles[1],
        status: "completed",
      },
];

const mockBrandDistribution: BrandDistribution[] = [
    { brand: "Honda", count: 45 },
    { brand: "Toyota", count: 35 },
    { brand: "Yamaha", count: 25 },
    { brand: "Kawasaki", count: 20 },
    { brand: "Outros", count: 15 },
];

const fetchDashboardData = async () => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
        statCards: mockStatCards,
        sales: mockSales,
        recentVehicles: mockRecentVehicles,
        appointments: mockAppointments,
        brandDistribution: mockBrandDistribution,
    };
};

export const DashboardService = {
    fetchDashboardData,
};