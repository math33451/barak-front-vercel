import { FinancingOption } from '@/types';

const mockFinancingOptions: FinancingOption[] = [
  { id: '1', bank: 'Banco do Brasil', interestRate: 0.08, maxTerm: 60 },
  { id: '2', bank: 'Itaú Unibanco', interestRate: 0.075, maxTerm: 72 },
  { id: '3', bank: 'Bradesco', interestRate: 0.082, maxTerm: 48 },
];

const fetchFinancingOptions = async (): Promise<FinancingOption[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFinancingOptions;
};

export const FinancingService = {
  fetchFinancingOptions,
};
