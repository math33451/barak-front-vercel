export interface StatCardData {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    icon: React.ReactNode;
  };
  footer?: string;
}

export interface Vehicle {
  [key: string]: unknown;
  id: string;
  name: string;
  price: number;
  type: "car" | "motorcycle";
  status: "sold" | "in_stock";
  imageUrl?: string;
}

export interface Sale {
  [key: string]: unknown; // Added index signature
  date: string;
  amount: number;
}

export interface Appointment {
  [key: string]: unknown;
  id: string;
  clientName: string;
  date: string;
  vehicle: Vehicle;
  status: "scheduled" | "completed" | "canceled";
}

export interface BrandDistribution {
  brand: string;
  count: number;
}

export interface Bank {
  [key: string]: unknown; // Added index signature
  id: string;
  name: string;
  code: string;
}

export interface UserCredentials {
  username: string;
  password: string;
}

export interface FinancingOption {
  [key: string]: unknown; // Added index signature
  id: string;
  bank: string;
  interestRate: number;
  maxTerm: number;
}

export interface Expense {
  [key: string]: unknown; // Added index signature
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

export interface Client {
  [key: string]: unknown; // Added index signature
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface AppSettings {
  appName: string;
  currency: string;
  dateFormat: string;
  notificationsEnabled: boolean;
}

export interface ReportSummary {
  totalSales: number;
  vehiclesSold: number;
  newClients: number;
  totalExpenses: number;
}

export interface SalesByMonth {
  month: string;
  sales: number;
}

export interface VehicleSalesByBrand {
  brand: string;
  sales: number;
}

export interface TopSeller {
  name: string;
  sales: number;
}

export interface FinancingByBank {
  bank: string;
  count: number;
}