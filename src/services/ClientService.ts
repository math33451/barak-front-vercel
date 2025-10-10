import { Client } from "@/types";
import { httpClient } from "@/infra/httpClient";

// Interface baseada no que foi usado no script de população
interface BackendCliente {
  idCliente?: number;
  nomeCliente: string;
  email: string;
  telefoneContato: string;
  cpfCnpj: string;
  dataNascimento?: string;
  idUnidadeEmpresa?: number;
}

// Função para mapear do frontend para o backend
const mapToBackend = (
  client: Omit<Client, "id">
): Omit<BackendCliente, "idCliente"> => ({
  nomeCliente: client.name as string,
  email: client.email as string,
  telefoneContato: client.phone as string,
  cpfCnpj: "00000000000", // Campo obrigatório no backend
});

// Função para mapear do backend para o frontend
const mapFromBackend = (backendCliente: BackendCliente): Client => ({
  id: backendCliente.idCliente?.toString() || "",
  name: backendCliente.nomeCliente,
  email: backendCliente.email,
  phone: backendCliente.telefoneContato,
  address: "", // Não disponível no backend atual
});

const fetchClients = async (): Promise<Client[]> => {
  try {
    const response = await httpClient.get<BackendCliente[]>(
      "/cliente/listar"
    );
    if (response && response.length > 0) {
      return response.map(mapFromBackend);
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar clientes:", error);
    return [];
  }
};

const saveClient = async (client: Omit<Client, "id">): Promise<Client> => {
  try {
    const backendData = mapToBackend(client);
    const response = await httpClient.post<BackendCliente>(
      "/cliente/salvar",
      backendData
    );
    return mapFromBackend(response);
  } catch (error) {
    console.error("Erro ao salvar cliente:", error);
    throw error;
  }
};

const deleteClient = async (clientId: string): Promise<void> => {
  await httpClient.delete<void>(`/cliente/delete/${clientId}`);
};

export const ClientService = {
  fetchClients,
  saveClient,
  deleteClient,
};
