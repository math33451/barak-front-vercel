import axios from "axios";

const API_BASE_URL =  "https://barak-backend-665569303635.us-central1.run.app";

// Função para pegar o token
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token");
  }
  return null;
};

// Função para criar headers
const getHeaders = () => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const httpClient = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    return response.data;
  },

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axios.post(`${API_BASE_URL}${endpoint}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await axios.put(`${API_BASE_URL}${endpoint}`, data, {
      headers: getHeaders(),
    });
    return response.data;
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await axios.delete(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
    });
    return response.data;
  },
};
