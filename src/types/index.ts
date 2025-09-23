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

export interface Agreement {
  [key: string]: unknown;
  id: string;
  unitId: string;
  bankId: string;
  bankName: string;
  return1: number;
  return2: number;
  return3: number;
  return4: number;
  return5: number;
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

export interface LoginDTO {
  email: string;
  password: string;
}

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
  // Add other fields if present in your Java RegisterDTO
}

export interface AuthResponse {
  token: string;
}

export interface UnidadeEmpresaDTO {
  id: number;
  name: string;
  // Add other fields if present in your Java UnidadeEmpresaDTO
}

export interface Employee {
  [key: string]: unknown;
  id: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  isActive: boolean;
  isManager: boolean;
  unit: UnidadeEmpresaDTO;
}

export interface Proposal {
  [key: string]: unknown;
  id: string;
  value: number;
  ilaValue: number;
  returnValue: number;
  bankReturnMultiplier: number;
  selectedReturn: number;
  isFinanced: 'SIM' | 'NAO';
  status: 'PENDENTE' | 'FINALIZADA' | 'CANCELADA';
  updatedAt: string; // Assuming ISO date string
  sellerId: string;
  bankId?: string;
  client: Client;
  vehicle: Vehicle;
}