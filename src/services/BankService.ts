import axios from "axios";
import { Bank } from "@/types";

const API_BASE_URL = "http://localhost:8089";

interface BackendBank {
  idBanco: number;
  nomeBanco: string | null;
  retorno1: number | null;
  retorno2: number | null;
  retorno3: number | null;
  retorno4: number | null;
  retorno5: number | null;
}

const getHeaders = () => {
  const token = localStorage.getItem("jwt_token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
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
    return response.data
      .filter((bank) => bank.nomeBanco != null && bank.nomeBanco.trim() !== "")
      .map((bank) => ({
        id: bank.idBanco.toString(),
        name: bank.nomeBanco as string,
        code: bank.idBanco.toString().padStart(3, "0"),
      }));
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
