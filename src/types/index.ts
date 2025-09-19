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