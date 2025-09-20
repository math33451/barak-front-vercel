import { Bank } from '@/types';

const mockBanks: Bank[] = [
  { id: '1', name: 'Banco do Brasil', code: '001' },
  { id: '2', name: 'Itaú Unibanco', code: '341' },
  { id: '3', name: 'Bradesco', code: '237' },
  { id: '4', name: 'Santander', code: '033' },
];

const fetchBanks = async (): Promise<Bank[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBanks;
};

export const BankService = {
  fetchBanks,
};
