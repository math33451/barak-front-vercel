import { httpClient } from '@/infra/httpClient';
import { Retorno } from '@/types';

const updateRetorno = async (retorno: Retorno): Promise<Retorno> => {
  const updatedRetorno = await httpClient.post<Retorno>('/rest/retorno', retorno);
  return updatedRetorno;
};

export const RetornoService = {
  updateRetorno,
};
