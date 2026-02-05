import axios from "axios";
import { Agreement } from "@/types";
import { storage } from "@/utils/storage";
import { API_CONFIG } from "@/core/config/constants";

const API_BASE_URL = API_CONFIG.BASE_URL;

// Backend types
interface BackendAcordo {
  idAcordoBanco: number;
  idUnidadeEmpresa: number | null;
  idBanco: number;
  percentualAcordo: number | null;
}

interface BackendBanco {
  idBanco: number;
  nomeBanco: string | null;
  retorno1: number | null;
  retorno2: number | null;
  retorno3: number | null;
  retorno4: number | null;
  retorno5: number | null;
}

const getHeaders = () => {
  const token = storage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const fetchAgreements = async (): Promise<Agreement[]> => {
  try {
    // Buscar acordos e bancos
    const [acordosResponse, bancosResponse] = await Promise.all([
      axios.get<BackendAcordo[]>(`${API_BASE_URL}/acordo/listar`, {
        headers: getHeaders(),
      }),
      axios.get<BackendBanco[]>(`${API_BASE_URL}/banco/listar`, {
        headers: getHeaders(),
      }),
    ]);

    const acordos = acordosResponse.data;
    const bancos = bancosResponse.data;

    // Criar um map para facilitar busca de bancos
    const bancosMap = new Map<number, BackendBanco>();
    bancos.forEach((banco) => {
      if (banco.nomeBanco) {
        bancosMap.set(banco.idBanco, banco);
      }
    });

    // Mapear acordos para o formato do frontend
    const result = acordos
      .filter((acordo) => bancosMap.has(acordo.idBanco))
      .map((acordo) => {
        const banco = bancosMap.get(acordo.idBanco)!;

        return {
          id: acordo.idAcordoBanco.toString(),
          unitId: acordo.idUnidadeEmpresa?.toString() || "",
          bankId: acordo.idBanco.toString(),
          bankName: banco.nomeBanco || "",
          agreementPercent: acordo.percentualAcordo ?? 0,
        } as Agreement;
      });

    return result;
  } catch (error) {
    console.error("Error fetching agreements:", error);
    return [];
  }
};

const saveAgreement = async (
  agreement: Omit<Agreement, "id">,
): Promise<Agreement> => {
  try {
    // Mapear para o formato do backend
    const backendData = {
      idUnidadeEmpresa: agreement.unitId
        ? parseInt(agreement.unitId as string)
        : null,
      idBanco: parseInt(agreement.bankId as string),
      percentualAcordo: agreement.agreementPercent,
    };

    const response = await axios.post<BackendAcordo>(
      `${API_BASE_URL}/acordo/salvar`,
      backendData,
      { headers: getHeaders() },
    );

    // Buscar todos os bancos para encontrar o específico
    const bancosResponse = await axios.get<BackendBanco[]>(
      `${API_BASE_URL}/banco/listar`,
      { headers: getHeaders() },
    );
    const banco = bancosResponse.data.find(
      (b) => b.idBanco === response.data.idBanco,
    );

    return {
      id: response.data.idAcordoBanco.toString(),
      unitId: response.data.idUnidadeEmpresa?.toString() || "",
      bankId: response.data.idBanco.toString(),
      bankName: banco?.nomeBanco || "",
      agreementPercent: response.data.percentualAcordo ?? 0,
    } as Agreement;
  } catch (error) {
    console.error("Error saving agreement:", error);
    throw error;
  }
};

const deleteAgreement = async (agreementId: string): Promise<void> => {
  try {
    await axios.delete<void>(`${API_BASE_URL}/acordo/delete/${agreementId}`, {
      headers: getHeaders(),
    });
  } catch (error) {
    console.error("Error deleting agreement:", error);
    throw error;
  }
};

export const FinancingService = {
  fetchAgreements,
  saveAgreement,
  deleteAgreement,
};
