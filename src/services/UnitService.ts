import { UnidadeEmpresaDTO } from "@/types";
import { httpClient } from "@/infra/httpClient";

// Interface baseada no que foi usado no script de população
interface BackendUnidadeEmpresa {
  idEmpresa?: number;
  nomeEmpresa: string;
  idUsuario?: number;
  funcionarios?: unknown[];
  idGerente?: number;
  endereco?: string;
  contato?: string;
  propostas?: unknown[];
  clientes?: unknown[];
}

// Função para mapear do frontend para o backend
const mapToBackend = (
  unit: Omit<UnidadeEmpresaDTO, "id">
): Omit<BackendUnidadeEmpresa, "idEmpresa"> => ({
  nomeEmpresa: unit.name,
});

// Função para mapear do backend para o frontend
const mapFromBackend = (
  backendUnit: BackendUnidadeEmpresa
): UnidadeEmpresaDTO => ({
  id: backendUnit.idEmpresa || 0,
  name: backendUnit.nomeEmpresa || "Unidade sem nome",
});

const fetchUnits = async (): Promise<UnidadeEmpresaDTO[]> => {
  try {
    const response = await httpClient.get<BackendUnidadeEmpresa[]>(
      "/rest/unidade/listar"
    );
    if (response && response.length > 0) {
      return response
        .filter((unit) => unit.nomeEmpresa) // Filtra unidades com nome
        .map(mapFromBackend);
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar unidades:", error);
    return [];
  }
};

const saveUnit = async (
  unit: Omit<UnidadeEmpresaDTO, "id">
): Promise<UnidadeEmpresaDTO> => {
  try {
    const backendData = mapToBackend(unit);
    const response = await httpClient.post<BackendUnidadeEmpresa>(
      "/rest/unidade",
      backendData
    );
    return mapFromBackend(response);
  } catch (error) {
    console.error("Erro ao salvar unidade:", error);
    throw error;
  }
};

const deleteUnit = async (unitId: number): Promise<void> => {
  await httpClient.delete<void>(`/rest/unidade/${unitId}`);
};

export const UnitService = {
  fetchUnits,
  saveUnit,
  deleteUnit,
};
