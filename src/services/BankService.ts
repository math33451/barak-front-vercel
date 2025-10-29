import axios from "axios";
import { Bank } from "@/types";

const API_BASE_URL = "https://barak-backend-665569303635.us-central1.run.app";

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
  idProposta: number;
  idBanco: number;
  valorFinanciado: number;
}

const getHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Função auxiliar para buscar financiamentos de um banco
const fetchBankFinancing = async (bankId: number): Promise<number> => {
  try {
    // Buscar propostas do banco
    const response = await axios.get<BackendProposta[]>(
      `${API_BASE_URL}/proposta/listar`,
      {
        headers: getHeaders(),
      }
    );

    if (response.data && Array.isArray(response.data)) {
      // Filtrar propostas do banco e somar valores financiados
      const total = response.data
        .filter((proposta: BackendProposta) => proposta.idBanco === bankId)
        .reduce((sum: number, proposta: BackendProposta) => {
          const valorFinanciado = proposta.valorFinanciado || 0;
          return sum + valorFinanciado;
        }, 0);

      return total;
    }
  } catch (error) {
    console.error(`Erro ao buscar financiamentos do banco ${bankId}:`, error);
  }

  return 0;
};

const fetchBanks = async (): Promise<Bank[]> => {
  const response = await axios.get<BackendBank[]>(
    `${API_BASE_URL}/banco/listar`,
    {
      headers: getHeaders(),
    }
  );

  if (response.data && response.data.length > 0) {
    // Map backend response to our Bank interface and filter out null names
    const banks = response.data.filter(
      (bank) => bank.nomeBanco != null && bank.nomeBanco.trim() !== ""
    );

    // Buscar totais de financiamento para cada banco
    const banksWithFinancing = await Promise.all(
      banks.map(async (bank) => {
        const totalFinancing = await fetchBankFinancing(bank.idBanco);

        return {
          id: bank.idBanco.toString(),
          name: bank.nomeBanco as string,
          code: bank.idBanco.toString().padStart(3, "0"),
          totalFinancing,
        };
      })
    );

    return banksWithFinancing;
  }

  return [];
};

const saveBank = async (bank: Omit<Bank, "id">): Promise<Bank> => {
  const response = await axios.post<Bank>(
    `${API_BASE_URL}/banco/salvar`,
    bank,
    {
      headers: getHeaders(),
    }
  );
  return response.data;
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
