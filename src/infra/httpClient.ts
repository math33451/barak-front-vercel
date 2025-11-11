import axios, { AxiosInstance, AxiosError } from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/core/config/constants";

/**
 * HttpClient - Singleton Pattern
 * Centraliza todas as requisições HTTP da aplicação
 * Implementa interceptors, tratamento de erros e gerenciamento de token
 */
class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;
  private readonly baseURL: string;
  private readonly tokenKey: string;

  private constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.tokenKey = STORAGE_KEYS.AUTH_TOKEN;

    // Criar instância do axios com configurações padrão
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Configurar interceptors
    this.setupInterceptors();
  }

  /**
   * Retorna a instância única do HttpClient (Singleton)
   */
  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  /**
   * Configura interceptors para requests e responses
   */
  private setupInterceptors(): void {
    // Request interceptor - adiciona token automaticamente
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - trata erros globalmente
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtém o token de autenticação do localStorage
   */
  private getToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }
    return localStorage.getItem(this.tokenKey);
  }

  /**
   * Trata erros HTTP de forma centralizada
   */
  private handleError(error: AxiosError): void {
    if (error.response) {
      // Erro de resposta do servidor
      switch (error.response.status) {
        case 401:
          // Token expirado ou inválido - limpar e redirecionar
          this.clearToken();
          if (typeof window !== "undefined" && window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
          break;
        case 403:
          console.error("Acesso negado");
          break;
        case 404:
          console.error("Recurso não encontrado");
          break;
        case 500:
          console.error("Erro interno do servidor");
          break;
        default:
          console.error("Erro na requisição:", error.response.status);
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      console.error("Erro de rede - sem resposta do servidor");
    } else {
      // Erro ao configurar a requisição
      console.error("Erro ao configurar requisição:", error.message);
    }
  }

  /**
   * GET - Busca dados
   */
  public async get<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.get<T>(endpoint);
    return response.data;
  }

  /**
   * POST - Cria novo recurso
   */
  public async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    return response.data;
  }

  /**
   * PUT - Atualiza recurso existente
   */
  public async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data);
    return response.data;
  }

  /**
   * DELETE - Remove recurso
   */
  public async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    return response.data;
  }

  /**
   * Salva token de autenticação
   */
  public setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  /**
   * Remove token de autenticação
   */
  public clearToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(this.tokenKey);
    }
  }

  /**
   * Verifica se usuário está autenticado
   */
  public isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Retorna a baseURL configurada
   */
  public getBaseURL(): string {
    return this.baseURL;
  }
}

// Exportar instância única (Singleton)
export const httpClient = HttpClient.getInstance();
