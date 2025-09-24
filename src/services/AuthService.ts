import axios from "axios";
import { LoginDTO, RegisterDTO, UnidadeEmpresaDTO } from "@/types";

const API_BASE_URL = "http://localhost:8089";

const login = async (credentials: LoginDTO): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials, {
    headers: { "Content-Type": "application/json" },
  });

  if (!response.data.token) {
    throw new Error("Token não recebido");
  }

  return response.data.token;
};

const register = async (userData: RegisterDTO): Promise<string> => {
  const response = await axios.post(`${API_BASE_URL}/auth/register`, userData, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

const getUserUnits = async (idUser: number): Promise<UnidadeEmpresaDTO[]> => {
  const token = localStorage.getItem("jwt_token");
  const response = await axios.get(`${API_BASE_URL}/user-unidades/${idUser}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
  return response.data;
};

export const AuthService = {
  login,
  register,
  getUserUnits,
};
