import { ReportSummary, SalesByMonth, VehicleSalesByBrand } from '@/types';

const mockReportSummary: ReportSummary = {
  totalSales: 1856400,
  vehiclesSold: 187,
  newClients: 94,
  totalExpenses: 25000,
};

const mockSalesByMonth: SalesByMonth[] = [
  { month: 'Jan', sales: 150000 },
  { month: 'Fev', sales: 180000 },
  { month: 'Mar', sales: 160000 },
  { month: 'Abr', sales: 200000 },
  { month: 'Mai', sales: 190000 },
  { month: 'Jun', sales: 220000 },
  { month: 'Jul', sales: 210000 },
  { month: 'Ago', sales: 230000 },
  { month: 'Set', sales: 240000 },
  { month: 'Out', sales: 250000 },
  { month: 'Nov', sales: 260000 },
  { month: 'Dez', sales: 270000 },
];

const mockVehicleSalesByBrand: VehicleSalesByBrand[] = [
  { brand: 'Toyota', sales: 50 },
  { brand: 'Honda', sales: 40 },
  { brand: 'Volkswagen', sales: 30 },
  { brand: 'Jeep', sales: 25 },
  { brand: 'Ford', sales: 20 },
];

const fetchReportSummary = async (): Promise<ReportSummary> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockReportSummary;
};

const fetchSalesByMonth = async (): Promise<SalesByMonth[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSalesByMonth;
};

const fetchVehicleSalesByBrand = async (): Promise<VehicleSalesByBrand[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockVehicleSalesByBrand;
};

export const ReportService = {
  fetchReportSummary,
  fetchSalesByMonth,
  fetchVehicleSalesByBrand,
};
