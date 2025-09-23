import { UnidadeEmpresaDTO } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchUnits = async (): Promise<UnidadeEmpresaDTO[]> => {
  const response = await httpClient.get<UnidadeEmpresaDTO[]>('/rest/unidade/listar');
  return response;
};

const saveUnit = async (unit: Omit<UnidadeEmpresaDTO, 'id'>): Promise<UnidadeEmpresaDTO> => {
  const response = await httpClient.post<UnidadeEmpresaDTO>('/rest/unidade', unit);
  return response;
};

const deleteUnit = async (unitId: number): Promise<void> => {
  await httpClient.delete<void>(`/rest/unidade/${unitId}`);
};

export const UnitService = {
  fetchUnits,
  saveUnit,
  deleteUnit,
};
