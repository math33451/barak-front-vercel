import { UnidadeEmpresaDTO } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchUnits = async (): Promise<UnidadeEmpresaDTO[]> => {
  const response = await httpClient.get<UnidadeEmpresaDTO[]>('/rest/unidade/listar');
  return response;
};

export const UnitService = {
  fetchUnits,
};
