import { httpClient } from "@/infra/httpClient";
import { API_ENDPOINTS } from "@/core/config/constants";

interface FechamentoRequest {
  idUnidadeEmpresa: number;
  mesEAnoReferencia: string; // YYYY-MM-DD
}

interface FechamentoResponse {
  // Adicionar campos se soubermos a resposta, por enquanto 'any'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

const performMonthlyClosure = async (data: FechamentoRequest): Promise<FechamentoResponse> => {
  return await httpClient.post(API_ENDPOINTS.CLOSURE.MONTHLY, data);
};

export const ClosureService = {
  performMonthlyClosure,
};
