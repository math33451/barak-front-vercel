import { Client } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchClients = async (): Promise<Client[]> => {
  const response = await httpClient.get<Client[]>('/rest/cliente/listar');
  return response;
};

const saveClient = async (client: Omit<Client, 'id'>): Promise<Client> => {
  const response = await httpClient.post<Client>('/rest/cliente/salvar', client);
  return response;
};

const deleteClient = async (clientId: string): Promise<void> => {
  await httpClient.delete<void>(`/rest/cliente/delete/${clientId}`);
};

export const ClientService = {
  fetchClients,
  saveClient,
  deleteClient,
};
