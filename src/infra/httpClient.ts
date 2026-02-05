import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { API_CONFIG, STORAGE_KEYS } from "@/core/config/constants";
import { storage } from "@/utils/storage";
import { logger } from "@/utils/logger";

/**
 * HttpClient - Singleton Pattern
 * Centraliza todas as requisições HTTP da aplicação
 * Implementa interceptors, tratamento de erros e gerenciamento de token
 *
 * Recursos de Performance:
 * - Cache HTTP com headers Cache-Control
 * - Compressão gzip/deflate
 * - ETags para validação de cache
 * - Request deduplication
 * - Timeouts otimizados por tipo de operação
 */
class HttpClient {
  private static instance: HttpClient;
  private axiosInstance: AxiosInstance;
  private readonly baseURL: string;
  private readonly tokenKey: string;
  private requestCache: Map<string, Promise<unknown>> = new Map();

  private constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    this.tokenKey = STORAGE_KEYS.AUTH_TOKEN;

    // Log de debug para verificar a URL configurada
    logger.debug(
      "Inicializando HttpClient",
      {
        baseURL: this.baseURL,
        timeout: API_CONFIG.TIMEOUT,
      },
      "HttpClient",
    );

    // Criar instância do axios com configurações otimizadas para performance
    this.axiosInstance = axios.create({
      baseURL: this.baseURL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        "Content-Type": "application/json",
        // Habilitar compressão para reduzir tamanho dos dados
        "Accept-Encoding": "gzip, deflate, br",
        // Habilitar cache HTTP
        "Cache-Control": "public, max-age=300", // 5 minutos padrão
      },
      // Permitir que o navegador use cache HTTP nativo
      withCredentials: false,
      // Decodificar automaticamente responses comprimidos
      decompress: true,
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
    // Request interceptor - adiciona token, cache headers e otimizações
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        logger.http(config.method?.toUpperCase() || "GET", config.url || "");

        const token = this.getToken();
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Configurar cache headers baseado no tipo de request
        if (config.method?.toLowerCase() === "get" && config.headers) {
          // GET requests podem usar cache mais agressivo
          // Se não tem cache-control customizado, usar padrão otimizado
          if (!config.headers["Cache-Control"]) {
            // Determinar tempo de cache baseado no endpoint
            const cacheTime = this.getCacheTimeForEndpoint(config.url || "");
            config.headers["Cache-Control"] = `public, max-age=${cacheTime}`;
          }

          // Adicionar If-None-Match para suportar ETags
          const etag = this.getStoredETag(config.url || "");
          if (etag) {
            config.headers["If-None-Match"] = etag;
          }
        } else if (config.headers) {
          // POST, PUT, DELETE não devem usar cache
          config.headers["Cache-Control"] =
            "no-cache, no-store, must-revalidate";
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // Response interceptor - trata erros e gerencia cache
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Armazenar ETag para requests futuros
        const etag = response.headers["etag"];
        if (etag && response.config.url) {
          this.storeETag(response.config.url, etag);
        }

        // Log de cache hits
        const cacheStatus =
          response.headers["x-cache"] ||
          response.headers["cf-cache-status"] ||
          "MISS";

        logger.cache(
          cacheStatus === "HIT" ? "HIT" : "MISS",
          response.config.url || "",
          { status: response.status },
        );

        return response;
      },
      (error: AxiosError) => {
        // Se receber 304 Not Modified, usar cache local
        if (error.response?.status === 304) {
          logger.cache("HIT", error.config?.url || "", { status: 304 });
          // Axios já trata 304 automaticamente, apenas log
        }

        this.handleError(error);
        return Promise.reject(error);
      },
    );
  }

  /**
   * Determina tempo de cache ideal baseado no endpoint
   */
  private getCacheTimeForEndpoint(url: string): number {
    // Dados menos voláteis = cache mais longo
    if (url.includes("/banco/") || url.includes("/unidade/")) {
      return 600; // 10 minutos
    }
    if (url.includes("/funcionario/") || url.includes("/cliente/")) {
      return 300; // 5 minutos
    }
    if (url.includes("/relatorios/")) {
      return 180; // 3 minutos (dados analíticos)
    }
    if (url.includes("/proposta/")) {
      return 120; // 2 minutos (dados mais voláteis)
    }
    // Padrão
    return 300; // 5 minutos
  }

  /**
   * Armazena ETag para validação de cache
   */
  private storeETag(url: string, etag: string): void {
    if (typeof window !== "undefined") {
      try {
        const key = `etag_${url}`;
        sessionStorage.setItem(key, etag);
      } catch {
        // Ignorar erros de storage
      }
    }
  }

  /**
   * Recupera ETag armazenado
   */
  private getStoredETag(url: string): string | null {
    if (typeof window !== "undefined") {
      try {
        const key = `etag_${url}`;
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Obtém o token de autenticação do localStorage
   */
  private getToken(): string | null {
    return storage.getItem(this.tokenKey);
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
          logger.warn(
            "Token inválido ou expirado - redirecionando",
            undefined,
            "HttpClient",
          );
          this.clearToken();
          if (
            typeof window !== "undefined" &&
            window.location.pathname !== "/login"
          ) {
            window.location.href = "/login";
          }
          break;
        case 403:
          logger.warn("Acesso negado", { status: 403 }, "HttpClient");
          break;
        case 404:
          logger.warn(
            "Recurso não encontrado",
            { url: error.config?.url },
            "HttpClient",
          );
          break;
        case 500:
          logger.error("Erro interno do servidor", error, "HttpClient");
          break;
        default:
          logger.error(
            `Erro na requisição: ${error.response.status}`,
            { status: error.response.status, url: error.config?.url },
            "HttpClient",
          );
      }
    } else if (error.request) {
      // Requisição foi feita mas não houve resposta
      logger.error(
        "Erro de rede - sem resposta do servidor",
        error,
        "HttpClient",
      );
    } else {
      // Erro ao configurar a requisição
      logger.error("Erro ao configurar requisição", error, "HttpClient");
    }
  }

  /**
   * GET - Busca dados com deduplication
   * Previne múltiplas requests simultâneas para o mesmo endpoint
   */
  public async get<T>(endpoint: string, useCache: boolean = true): Promise<T> {
    // Request deduplication - se já existe request pendente, reusar
    const cacheKey = `GET:${endpoint}`;

    if (useCache && this.requestCache.has(cacheKey)) {
      logger.cache("HIT", endpoint, { type: "request-deduplication" });
      return this.requestCache.get(cacheKey) as Promise<T>;
    }

    const requestPromise = this.axiosInstance
      .get<T>(endpoint)
      .then((response) => {
        this.requestCache.delete(cacheKey);
        return response.data;
      })
      .catch((error) => {
        this.requestCache.delete(cacheKey);
        throw error;
      });

    if (useCache) {
      this.requestCache.set(cacheKey, requestPromise);
    }

    return requestPromise;
  }

  /**
   * POST - Cria novo recurso
   * Invalida cache relacionado após mutação
   */
  public async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.post<T>(endpoint, data);
    this.invalidateRelatedCache(endpoint);
    return response.data;
  }

  /**
   * PUT - Atualiza recurso existente
   * Invalida cache relacionado após mutação
   */
  public async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const response = await this.axiosInstance.put<T>(endpoint, data);
    this.invalidateRelatedCache(endpoint);
    return response.data;
  }

  /**
   * DELETE - Remove recurso
   * Invalida cache relacionado após mutação
   */
  public async delete<T>(endpoint: string): Promise<T> {
    const response = await this.axiosInstance.delete<T>(endpoint);
    this.invalidateRelatedCache(endpoint);
    return response.data;
  }

  /**
   * Invalida cache relacionado após mutações
   */
  private invalidateRelatedCache(endpoint: string): void {
    // Remover requests em cache que podem estar desatualizados
    const keysToDelete: string[] = [];

    this.requestCache.forEach((_, key) => {
      // Se o endpoint da mutação é relacionado ao cache, invalidar
      if (key.includes(endpoint.split("/")[1])) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach((key) => this.requestCache.delete(key));

    // Limpar ETags relacionados
    if (typeof window !== "undefined") {
      try {
        const pattern = endpoint.split("/")[1];
        Object.keys(sessionStorage)
          .filter((key) => key.startsWith("etag_") && key.includes(pattern))
          .forEach((key) => sessionStorage.removeItem(key));
      } catch {
        // Ignorar erros de storage
      }
    }

    logger.cache("INVALIDATE", endpoint, { keysCleared: keysToDelete.length });
  }

  /**
   * Salva token de autenticação
   */
  public setToken(token: string): void {
    storage.setItem(this.tokenKey, token);
  }

  /**
   * Remove token de autenticação
   */
  public clearToken(): void {
    storage.removeItem(this.tokenKey);
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

  /**
   * Limpa todo cache de requests em memória
   */
  public clearRequestCache(): void {
    const size = this.requestCache.size;
    this.requestCache.clear();
    logger.cache("INVALIDATE", "all-requests", { clearedCount: size });
  }

  /**
   * Limpa ETags armazenados
   */
  public clearETags(): void {
    if (typeof window !== "undefined") {
      try {
        const etags = Object.keys(sessionStorage).filter((key) =>
          key.startsWith("etag_"),
        );
        etags.forEach((key) => sessionStorage.removeItem(key));
        logger.cache("INVALIDATE", "all-etags", { clearedCount: etags.length });
      } catch (error) {
        logger.warn("Erro ao limpar ETags", error, "HttpClient");
      }
    }
  }

  /**
   * Retorna estatísticas de cache
   */
  public getCacheStats() {
    return {
      pendingRequests: this.requestCache.size,
      storedETags:
        typeof window !== "undefined"
          ? Object.keys(sessionStorage).filter((k) => k.startsWith("etag_"))
              .length
          : 0,
    };
  }
}

// Exportar instância única (Singleton)
export const httpClient = HttpClient.getInstance();
