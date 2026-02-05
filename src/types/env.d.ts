/**
 * Declarações de tipos para variáveis de ambiente
 * Garante type safety ao acessar process.env
 */

declare namespace NodeJS {
  interface ProcessEnv {
    // Ambiente
    NODE_ENV: 'development' | 'production' | 'test';

    // API
    NEXT_PUBLIC_API_URL: string;

    // App Config
    NEXT_PUBLIC_APP_VERSION?: string;
    NEXT_PUBLIC_APP_NAME?: string;

    // Debug & Development
    NEXT_PUBLIC_ENABLE_DEBUG?: string;
    NEXT_PUBLIC_DISABLE_CACHE?: string;

    // Analytics (opcional para futuro)
    NEXT_PUBLIC_GA_ID?: string;
    NEXT_PUBLIC_VERCEL_ANALYTICS?: string;

    // Feature Flags
    NEXT_PUBLIC_ENABLE_MOCK_DATA?: string;
    NEXT_PUBLIC_ENABLE_DEVTOOLS?: string;
  }
}

// Exportar para permitir imports
export {};
