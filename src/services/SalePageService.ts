import { Sale } from '@/types';

const mockSales: Sale[] = [
  { date: '2025-09-01', amount: 75000 },
  { date: '2025-09-05', amount: 120000 },
  { date: '2025-09-10', amount: 90000 },
  { date: '2025-09-12', amount: 150000 },
  { date: '2025-09-15', amount: 80000 },
];

const fetchSales = async (): Promise<Sale[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSales;
};

export const SalePageService = {
  fetchSales,
};
