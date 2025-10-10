import {
  ReportSummary,
  SalesByMonth,
  VehicleSalesByBrand,
  TopSeller,
  FinancingByBank,
} from "@/types";
import { httpClient } from "@/infra/httpClient";

const fetchReportSummary = async (): Promise<ReportSummary> => {
  const response = await httpClient.get<ReportSummary>(
    "/relatorios/resumo"
  );
  return (
    response || {
      totalSales: 0,
      vehiclesSold: 0,
      newClients: 0,
      totalExpenses: 0,
    }
  );
};

const fetchSalesByMonth = async (): Promise<SalesByMonth[]> => {
  const response = await httpClient.get<SalesByMonth[]>(
    "/relatorios/vendas-mes"
  );
  return response || [];
};

const fetchVehicleSalesByBrand = async (): Promise<VehicleSalesByBrand[]> => {
  const response = await httpClient.get<VehicleSalesByBrand[]>(
    "/relatorios/vendas-marca"
  );
  return response || [];
};

const fetchTopSellers = async (): Promise<TopSeller[]> => {
  const response = await httpClient.get<TopSeller[]>(
    "/relatorios/top-vendedores"
  );
  return response || [];
};

const fetchFinancingByBank = async (): Promise<FinancingByBank[]> => {
  const response = await httpClient.get<FinancingByBank[]>(
    "/relatorios/financiamentos-banco"
  );
  return response || [];
};

export const ReportService = {
  fetchReportSummary,
  fetchSalesByMonth,
  fetchVehicleSalesByBrand,
  fetchTopSellers,
  fetchFinancingByBank,
};
