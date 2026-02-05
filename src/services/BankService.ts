import axios from "axios";
import { Bank } from "@/types";
import { storage } from "@/utils/storage";
import { API_CONFIG } from "@/core/config/constants";

const API_BASE_URL = API_CONFIG.BASE_URL;

interface BackendBank {
  idBanco: number;
  nomeBanco: string | null;
  retorno1: number | null;
  retorno2: number | null;
  retorno3: number | null;
  retorno4: number | null;
  retorno5: number | null;
}

interface BackendProposta {
  id: number;
  idBanco: number;
  valorPropostaReal: number;
  isFinanciado: string; // "SIM" | "NAO"
}

const getHeaders = () => {
  const token = storage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const fetchBanks = async (): Promise<Bank[]> => {
  try {
    const [banksResponse, proposalsResponse] = await Promise.all([
      axios.get<BackendBank[]>(`${API_BASE_URL}/banco/listar`, {
        headers: getHeaders(),
      }),
      axios.get<BackendProposta[]>(`${API_BASE_URL}/proposta/listar`, {
        headers: getHeaders(),
      }),
    ]);

    const proposals = proposalsResponse.data || [];
    const banks = banksResponse.data || [];

    if (banks.length > 0) {
      // Filter out null names
      const validBanks = banks.filter(
        (bank) => bank.nomeBanco != null && bank.nomeBanco.trim() !== ""
      );

      // Calculate totals in memory
      const financingMap = new Map<number, number>();
      
      proposals.forEach((prop) => {
        if (prop.idBanco && prop.isFinanciado === "SIM") {
          const currentTotal = financingMap.get(prop.idBanco) || 0;
          financingMap.set(prop.idBanco, currentTotal + (prop.valorPropostaReal || 0));
        }
      });

      return validBanks.map((bank) => ({
        id: bank.idBanco.toString(),
        name: bank.nomeBanco as string,
        code: bank.idBanco.toString().padStart(3, "0"),
        totalFinancing: financingMap.get(bank.idBanco) || 0,
        return1: bank.retorno1 || 0,
        return2: bank.retorno2 || 0,
        return3: bank.retorno3 || 0,
        return4: bank.retorno4 || 0,
        return5: bank.retorno5 || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar bancos:", error);
    return [];
  }
};

const saveBank = async (bank: Omit<Bank, "id">): Promise<Bank> => {
  const backendBank: Partial<BackendBank> = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    idBanco: (bank as any).id ? parseInt((bank as any).id) : undefined,
    nomeBanco: bank.name as string,
    retorno1: bank.return1 as number,
    retorno2: bank.return2 as number,
    retorno3: bank.return3 as number,
    retorno4: bank.return4 as number,
    retorno5: bank.return5 as number,
  };

  const response = await axios.post<BackendBank>(
    `${API_BASE_URL}/banco/salvar`,
    backendBank,
    {
      headers: getHeaders(),
    },
  );
  
  // Map response back to frontend Bank
  const savedBank = response.data;
  return {
    id: savedBank.idBanco.toString(),
    name: savedBank.nomeBanco as string,
    code: savedBank.idBanco.toString().padStart(3, "0"),
    return1: savedBank.retorno1 || 0,
    return2: savedBank.retorno2 || 0,
    return3: savedBank.retorno3 || 0,
    return4: savedBank.retorno4 || 0,
    return5: savedBank.retorno5 || 0,
  };
};

const deleteBank = async (bankId: string): Promise<void> => {
  await axios.delete<void>(`${API_BASE_URL}/banco/delete/${bankId}`, {
    headers: getHeaders(),
  });
};

export const BankService = {
  fetchBanks,
  saveBank,
  deleteBank,
};
