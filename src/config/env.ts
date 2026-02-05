/**
 * Configuração de Variáveis de Ambiente
 *
 * Centraliza e valida todas as variáveis de ambiente do projeto.
 * Garante type safety e validação em tempo de execução.
 *
 * IMPORTANTE: Todas as variáveis NEXT_PUBLIC_* são expostas no cliente.
 * Nunca coloque secrets/chaves privadas com esse prefixo!
 */

// Lista de variáveis obrigatórias
const requiredEnvVars = [
  'NEXT_PUBLIC_API_URL',
] as const;

// Lista de variáveis opcionais com valores padrão
const optionalEnvVars = {
  NEXT_PUBLIC_APP_VERSION: '1.0.0',
  NEXT_PUBLIC_ENABLE_DEBUG: 'false',
  NEXT_PUBLIC_ENABLE_ANALYTICS: 'false',
  NEXT_PUBLIC_API_TIMEOUT: '30000',
} as const;

/**
 * Valida se todas as variáveis obrigatórias estão presentes
 * @throws Error se alguma variável obrigatória estiver faltando
 */
function validateEnv(): void {
  // Só validar no servidor (build time)
  if (typeof window !== 'undefined') {
    return;
  }

  const missing = requiredEnvVars.filter(
    (key) => !process.env[key] || process.env[key]?.trim() === ''
  );

  if (missing.length > 0) {
    throw new Error(
      `❌ Variáveis de ambiente obrigatórias não encontradas:\n` +
      `${missing.map(key => `  - ${key}`).join('\n')}\n\n` +
      `Configure essas variáveis no arquivo .env.local`
    );
  }
}

/**
 * Obtém valor de variável de ambiente com fallback
 */
function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key];

  if (value === undefined || value.trim() === '') {
    if (fallback !== undefined) {
      return fallback;
    }
    throw new Error(`Variável de ambiente ${key} não encontrada e sem fallback`);
  }

  return value;
}

/**
 * Parseia boolean de string
 */
function parseBoolean(value: string): boolean {
  return value.toLowerCase() === 'true';
}

/**
 * Parseia número de string
 */
function parseNumber(value: string, fallback: number): number {
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? fallback : parsed;
}

// Executar validação no build/start (apenas servidor)
if (typeof window === 'undefined') {
  validateEnv();
}

/**
 * Configurações de ambiente exportadas
 * Todas tipadas e validadas
 */
export const env = {
  // API Configuration
  apiUrl: getEnvVar('NEXT_PUBLIC_API_URL'),
  apiTimeout: parseNumber(
    getEnvVar('NEXT_PUBLIC_API_TIMEOUT', optionalEnvVars.NEXT_PUBLIC_API_TIMEOUT),
    30000
  ),

  // App Configuration
  appVersion: getEnvVar('NEXT_PUBLIC_APP_VERSION', optionalEnvVars.NEXT_PUBLIC_APP_VERSION),

  // Feature Flags
  isDebugEnabled: parseBoolean(
    getEnvVar('NEXT_PUBLIC_ENABLE_DEBUG', optionalEnvVars.NEXT_PUBLIC_ENABLE_DEBUG)
  ),
  isAnalyticsEnabled: parseBoolean(
    getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', optionalEnvVars.NEXT_PUBLIC_ENABLE_ANALYTICS)
  ),

  // Environment Detection
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // Helper getters
  get isClient(): boolean {
    return typeof window !== 'undefined';
  },

  get isServer(): boolean {
    return typeof window === 'undefined';
  },
} as const;

// Type exports para uso em outras partes do código
export type Environment = typeof env;

/**
 * Helper para debug de configuração (apenas desenvolvimento)
 */
export function logEnvConfig(): void {
  if (!env.isDevelopment) return;

  console.log('🔧 Environment Configuration:');
  console.table({
    'API URL': env.apiUrl,
    'API Timeout': `${env.apiTimeout}ms`,
    'App Version': env.appVersion,
    'Environment': env.nodeEnv,
    'Debug Enabled': env.isDebugEnabled,
    'Analytics Enabled': env.isAnalyticsEnabled,
  });
}

// Export individual para imports específicos
export const {
  apiUrl,
  apiTimeout,
  appVersion,
  isDebugEnabled,
  isAnalyticsEnabled,
  isDevelopment,
  isProduction,
  isTest,
} = env;
