/**
 * Constantes de Configuração da Aplicação
 * Centraliza todos os valores de configuração, URLs e chaves
 */

// ============================================
// CONFIGURAÇÕES DE API
// ============================================
export const API_CONFIG = {
  BASE_URL: "https://barak-backend-665569303635.us-central1.run.app",
  TIMEOUT: 30000, // 30 segundos
  RETRY_ATTEMPTS: 3,
} as const;

// ============================================
// STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  AUTH_TOKEN: "jwt_token",
  USER_DATA: "user_data",
  PREFERENCES: "user_preferences",
  THEME: "app_theme",
} as const;

// ============================================
// API ENDPOINTS
// ============================================
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    USER_UNITS: (userId: string) => `/user-unidades/${userId}`,
  },

  // Clientes
  CLIENTS: {
    LIST: "/cliente/listar",
    SAVE: "/cliente/salvar",
    DELETE: (id: string) => `/cliente/delete/${id}`,
  },

  // Funcionários
  EMPLOYEES: {
    LIST: "/funcionarios/listar",
    GET: (id: string) => `/funcionarios/${id}`,
    CREATE: "/funcionarios",
    DELETE: (id: string) => `/funcionarios/${id}`,
    PROPOSALS: (id: string) => `/funcionarios/proposta/${id}`,
  },

  // Propostas
  PROPOSALS: {
    LIST: "/proposta/listar",
    FINALIZED: "/proposta/finalizadas",
    GET: (id: string) => `/proposta/${id}`,
    CREATE: "/proposta",
    CANCEL: (id: string) => `/proposta/cancelar/${id}`,
    APPROVE: (id: string) => `/proposta/aprovar/${id}`,
  },

  // Bancos
  BANKS: {
    LIST: "/banco/listar",
    SAVE: "/banco/salvar",
    DELETE: (id: string) => `/banco/delete/${id}`,
  },

  // Unidades
  UNITS: {
    LIST: "/unidade/listar",
    GET: (id: string) => `/unidade/${id}`,
    CREATE: "/unidade",
    DELETE: (id: string) => `/unidade/${id}`,
    UPDATE_META: (id: string, meta: number) => `/unidade/${id}/${meta}`,
    EMPLOYEES: (id: string) => `/unidade/funcionario/${id}`,
    PROPOSALS: (id: string) => `/unidade/proposta/${id}`,
    AGREEMENTS: (id: string) => `/unidade/acordo/${id}`,
    UPDATE_STOCK: (id: string, qty: number) => `/unidade/estoque/${id}/${qty}`,
    UPDATE_VISITS: (id: string, qty: number) => `/unidade/visitas/${id}/${qty}`,
  },

  // Acordos
  AGREEMENTS: {
    LIST: "/acordo/listar",
    SAVE: "/acordo/salvar",
    DELETE: (id: string) => `/acordo/delete/${id}`,
  },

  // Relatórios
  REPORTS: {
    SUMMARY: "/relatorios/resumo",
    SALES_BY_MONTH: "/relatorios/vendas-mes",
    SALES_BY_BRAND: "/relatorios/vendas-marca",
    TOP_SELLERS: "/relatorios/top-vendedores",
    FINANCING_BY_BANK: "/relatorios/financiamentos-banco",
  },

  // Retorno
  RETORNO: {
    CREATE: "/retorno",
  },

  // Fechamento
  CLOSURE: {
    MONTHLY: "/fechamento/mensal",
  },
} as const;

// ============================================
// ROTAS DA APLICAÇÃO
// ============================================
export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  REPORTS: "/relatorios",
  PROPOSALS: "/propostas",
  CLIENTS: "/clientes",
  EMPLOYEES: "/funcionarios",
  BANKS: "/bancos",
  UNITS: "/unidades",
  VEHICLES: "/veiculos",
  SETTINGS: "/configuracoes",
  TESTS: "/tests",
} as const;

// ============================================
// CONFIGURAÇÕES DE CACHE (React Query)
// ============================================
export const CACHE_CONFIG = {
  STALE_TIME: {
    SHORT: 2 * 60 * 1000, // 2 minutos
    MEDIUM: 5 * 60 * 1000, // 5 minutos
    LONG: 10 * 60 * 1000, // 10 minutos
  },
  GC_TIME: {
    SHORT: 5 * 60 * 1000, // 5 minutos
    MEDIUM: 10 * 60 * 1000, // 10 minutos
    LONG: 15 * 60 * 1000, // 15 minutos
  },
} as const;

// ============================================
// VALIDAÇÕES
// ============================================
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 6,
  CPF_LENGTH: 11,
  PHONE_LENGTH: 11,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

// ============================================
// FORMATOS
// ============================================
export const FORMATS = {
  DATE: "dd/MM/yyyy",
  DATE_TIME: "dd/MM/yyyy HH:mm",
  CURRENCY: "pt-BR",
  CURRENCY_OPTIONS: {
    style: "currency",
    currency: "BRL",
  },
} as const;

// ============================================
// LIMITES E PAGINAÇÃO
// ============================================
export const LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ITEMS_PER_PAGE: 10,
  MAX_RETRIES: 3,
} as const;

// ============================================
// MENSAGENS PADRÃO
// ============================================
export const MESSAGES = {
  SUCCESS: {
    SAVE: "Registro salvo com sucesso",
    DELETE: "Registro excluído com sucesso",
    UPDATE: "Registro atualizado com sucesso",
  },
  ERROR: {
    GENERIC: "Ocorreu um erro. Tente novamente.",
    NETWORK: "Erro de conexão. Verifique sua internet.",
    UNAUTHORIZED: "Sessão expirada. Faça login novamente.",
    NOT_FOUND: "Registro não encontrado.",
  },
} as const;

// ============================================
// TIPOS AUXILIARES
// ============================================
export type ApiEndpoint = typeof API_ENDPOINTS;
export type AppRoute = typeof APP_ROUTES;
export type StorageKey = typeof STORAGE_KEYS;
