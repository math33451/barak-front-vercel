import { Agreement } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchAgreements = async (): Promise<Agreement[]> => {
  const response = await httpClient.get<Agreement[]>('/rest/acordo/listar');
  return response;
};

const saveAgreement = async (agreement: Omit<Agreement, 'id'>): Promise<Agreement> => {
  const response = await httpClient.post<Agreement>('/rest/acordo/salvar', agreement);
  return response;
};

const deleteAgreement = async (agreementId: string): Promise<void> => {
  await httpClient.delete<void>(`/rest/acordo/delete/${agreementId}`);
};

export const FinancingService = {
  fetchAgreements,
  saveAgreement,
  deleteAgreement,
};
