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
    "/rest/relatorios/resumo"
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
    "/rest/relatorios/vendas-mes"
  );
  return response || [];
};

const fetchVehicleSalesByBrand = async (): Promise<VehicleSalesByBrand[]> => {
  const response = await httpClient.get<VehicleSalesByBrand[]>(
    "/rest/relatorios/vendas-marca"
  );
  return response || [];
};

const fetchTopSellers = async (): Promise<TopSeller[]> => {
  const response = await httpClient.get<TopSeller[]>(
    "/rest/relatorios/top-vendedores"
  );
  return response || [];
};

const fetchFinancingByBank = async (): Promise<FinancingByBank[]> => {
  const response = await httpClient.get<FinancingByBank[]>(
    "/rest/relatorios/financiamentos-banco"
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
