import { LoginDTO, RegisterDTO, AuthResponse, UnidadeEmpresaDTO } from '@/types';
import { httpClient } from '@/infra/httpClient';

const login = async (credentials: LoginDTO): Promise<string> => {
  const response = await httpClient.post<AuthResponse>('/auth/login', credentials);
  return response.token;
};

const register = async (userData: RegisterDTO): Promise<string> => {
  const response = await httpClient.post<string>('/auth/register', userData);
  return response;
};

const getUserUnits = async (idUser: number): Promise<UnidadeEmpresaDTO[]> => {
  const response = await httpClient.get<UnidadeEmpresaDTO[]>(`/user-unidades/${idUser}`);
  return response;
};

export const AuthService = {
  login,
  register,
  getUserUnits,
};
