import { Client } from '@/types';

const mockClients: Client[] = [
  { id: '1', name: 'João Silva', email: 'joao.silva@example.com', phone: '(11) 98765-4321' },
  { id: '2', name: 'Maria Souza', email: 'maria.souza@example.com', phone: '(11) 91234-5678' },
  { id: '3', name: 'Carlos Pereira', email: 'carlos.pereira@example.com', phone: '(11) 99876-5432' },
];

const fetchClients = async (): Promise<Client[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockClients;
};

export const ClientService = {
  fetchClients,
};
