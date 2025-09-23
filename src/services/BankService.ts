import { Bank } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchBanks = async (): Promise<Bank[]> => {
  const response = await httpClient.get<Bank[]>('/rest/banco/listar');
  return response;
};

const saveBank = async (bank: Omit<Bank, 'id'>): Promise<Bank> => {
  const response = await httpClient.post<Bank>('/rest/banco/salvar', bank);
  return response;
};

const deleteBank = async (bankId: string): Promise<void> => {
  await httpClient.delete<void>(`/rest/banco/delete/${bankId}`);
};

export const BankService = {
  fetchBanks,
  saveBank,
  deleteBank,
};
