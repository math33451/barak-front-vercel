/**
 * Sistema de Logger Centralizado
 *
 * Gerencia logs de forma inteligente baseado no ambiente:
 * - Desenvolvimento: logs completos no console
 * - Produção: apenas erros críticos, warnings importantes
 * - Suporte a diferentes níveis: debug, info, warn, error
 * - Logs estruturados para facilitar debugging
 * - Performance tracking integrado
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
  enabledInProduction: boolean;
  prefix: string;
  color: string;
}

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  metadata?: Record<string, unknown>;
}

class Logger {
  private isDevelopment: boolean;
  private isProduction: boolean;
  private enableDebug: boolean;
  private performanceMetrics: Map<string, PerformanceMetric> = new Map();

  private readonly configs: Record<LogLevel, LogConfig> = {
    debug: {
      enabledInProduction: false,
      prefix: '🔍 [DEBUG]',
      color: '#9CA3AF', // gray
    },
    info: {
      enabledInProduction: false,
      prefix: 'ℹ️  [INFO]',
      color: '#3B82F6', // blue
    },
    warn: {
      enabledInProduction: true,
      prefix: '⚠️  [WARN]',
      color: '#F59E0B', // amber
    },
    error: {
      enabledInProduction: true,
      prefix: '❌ [ERROR]',
      color: '#EF4444', // red
    },
  };

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isProduction = process.env.NODE_ENV === 'production';
    this.enableDebug = process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true';
  }

  /**
   * Verifica se deve logar baseado no nível e ambiente
   */
  private shouldLog(level: LogLevel): boolean {
    const config = this.configs[level];

    // Em produção, só loga se permitido
    if (this.isProduction) {
      return config.enabledInProduction;
    }

    // Em desenvolvimento, loga tudo exceto debug (se não habilitado)
    if (level === 'debug') {
      return this.enableDebug;
    }

    return true;
  }

  /**
   * Formata mensagem com prefix e contexto
   */
  private formatMessage(level: LogLevel, message: string, context?: string): string {
    const config = this.configs[level];
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const contextStr = context ? ` [${context}]` : '';

    return `${config.prefix}${contextStr} ${timestamp} - ${message}`;
  }

  /**
   * Log de debug - detalhes técnicos de desenvolvimento
   * Apenas em desenvolvimento ou com flag NEXT_PUBLIC_ENABLE_DEBUG
   */
  debug(message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog('debug')) return;

    const formatted = this.formatMessage('debug', message, context);

    if (data !== undefined) {
      console.log(formatted, data);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Log informativo - operações normais do sistema
   * Apenas em desenvolvimento
   */
  info(message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog('info')) return;

    const formatted = this.formatMessage('info', message, context);

    if (data !== undefined) {
      console.log(formatted, data);
    } else {
      console.log(formatted);
    }
  }

  /**
   * Log de warning - situações que merecem atenção
   * Aparece em todos os ambientes
   */
  warn(message: string, data?: unknown, context?: string): void {
    if (!this.shouldLog('warn')) return;

    const formatted = this.formatMessage('warn', message, context);

    if (data !== undefined) {
      console.warn(formatted, data);
    } else {
      console.warn(formatted);
    }
  }

  /**
   * Log de erro - problemas que precisam ser corrigidos
   * Aparece em todos os ambientes
   */
  error(message: string, error?: unknown, context?: string): void {
    if (!this.shouldLog('error')) return;

    const formatted = this.formatMessage('error', message, context);

    if (error !== undefined) {
      // Se for um Error object, mostrar stack trace em dev
      if (error instanceof Error) {
        console.error(formatted, {
          message: error.message,
          stack: this.isDevelopment ? error.stack : undefined,
          name: error.name,
        });
      } else {
        console.error(formatted, error);
      }
    } else {
      console.error(formatted);
    }

    // Em produção, poderia enviar para serviço de monitoramento
    // this.sendToMonitoring(message, error);
  }

  /**
   * Agrupa logs relacionados
   */
  group(label: string, collapsed: boolean = false): void {
    if (!this.isDevelopment) return;

    if (collapsed) {
      console.groupCollapsed(label);
    } else {
      console.group(label);
    }
  }

  /**
   * Finaliza grupo de logs
   */
  groupEnd(): void {
    if (!this.isDevelopment) return;
    console.groupEnd();
  }

  /**
   * Exibe tabela formatada (útil para arrays/objects)
   */
  table(data: unknown, context?: string): void {
    if (!this.isDevelopment) return;

    if (context) {
      console.log(`📊 [TABLE] [${context}]`);
    }
    console.table(data);
  }

  /**
   * Inicia tracking de performance
   */
  startPerformance(name: string, metadata?: Record<string, unknown>): void {
    if (!this.isDevelopment && !this.enableDebug) return;

    const metric: PerformanceMetric = {
      name,
      startTime: performance.now(),
      metadata,
    };

    this.performanceMetrics.set(name, metric);
    this.debug(`Performance tracking iniciado: ${name}`, metadata, 'PERF');
  }

  /**
   * Finaliza tracking de performance e exibe resultado
   */
  endPerformance(name: string, additionalData?: Record<string, unknown>): number | null {
    if (!this.isDevelopment && !this.enableDebug) return null;

    const metric = this.performanceMetrics.get(name);
    if (!metric) {
      this.warn(`Performance metric não encontrada: ${name}`, undefined, 'PERF');
      return null;
    }

    metric.endTime = performance.now();
    metric.duration = Math.round(metric.endTime - metric.startTime);

    const emoji = metric.duration < 100 ? '⚡' : metric.duration < 500 ? '✅' : '⚠️';

    this.info(
      `${emoji} ${name} completado em ${metric.duration}ms`,
      {
        ...metric.metadata,
        ...additionalData,
        duration: `${metric.duration}ms`,
      },
      'PERF'
    );

    this.performanceMetrics.delete(name);
    return metric.duration;
  }

  /**
   * Loga performance de forma simplificada (measure inline)
   */
  async measureAsync<T>(
    name: string,
    fn: () => Promise<T>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context?: string
  ): Promise<T> {
    this.startPerformance(name);

    try {
      const result = await fn();
      this.endPerformance(name);
      return result;
    } catch (error) {
      this.endPerformance(name, { error: true });
      throw error;
    }
  }

  /**
   * Loga performance de função síncrona
   */
  measure<T>(name: string, fn: () => T, 
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context?: string): T {
    this.startPerformance(name);

    try {
      const result = fn();
      this.endPerformance(name);
      return result;
    } catch (error) {
      this.endPerformance(name, { error: true });
      throw error;
    }
  }

  /**
   * Loga requisição HTTP
   */
  http(method: string, url: string, status?: number, duration?: number): void {
    const emoji = !status
      ? '🌐'
      : status < 300
      ? '✅'
      : status < 400
      ? '↪️'
      : status < 500
      ? '⚠️'
      : '❌';

    const message = status
      ? `${emoji} ${method} ${url} - ${status}${duration ? ` (${duration}ms)` : ''}`
      : `${emoji} ${method} ${url}`;

    if (!status || status >= 400) {
      this.warn(message, undefined, 'HTTP');
    } else {
      this.info(message, undefined, 'HTTP');
    }
  }

  /**
   * Loga mudança de estado
   */
  state(component: string, stateName: string, value: unknown): void {
    if (!this.isDevelopment && !this.enableDebug) return;

    this.debug(
      `State change: ${component}.${stateName}`,
      { value },
      'STATE'
    );
  }

  /**
   * Loga navegação de rotas
   */
  navigation(from: string, to: string, params?: Record<string, unknown>): void {
    this.info(
      `Navigation: ${from} → ${to}`,
      params,
      'ROUTER'
    );
  }

  /**
   * Loga operação de cache
   */
  cache(operation: 'HIT' | 'MISS' | 'SET' | 'INVALIDATE', key: string, metadata?: unknown): void {
    const emoji = {
      HIT: '✅',
      MISS: '❌',
      SET: '💾',
      INVALIDATE: '🗑️',
    }[operation];

    this.debug(
      `${emoji} Cache ${operation}: ${key}`,
      metadata,
      'CACHE'
    );
  }

  /**
   * Limpa todos os performance metrics
   */
  clearPerformanceMetrics(): void {
    this.performanceMetrics.clear();
  }

  /**
   * Retorna estatísticas de performance
   */
  getPerformanceStats(): PerformanceMetric[] {
    return Array.from(this.performanceMetrics.values());
  }
}

// Exportar instância singleton
export const logger = new Logger();

// Exportar tipo para uso em outras partes do código
export type { LogLevel, PerformanceMetric };

// Helper para criar logger com contexto fixo
export const createContextLogger = (context: string) => ({
  debug: (message: string, data?: unknown) => logger.debug(message, data, context),
  info: (message: string, data?: unknown) => logger.info(message, data, context),
  warn: (message: string, data?: unknown) => logger.warn(message, data, context),
  error: (message: string, error?: unknown) => logger.error(message, error, context),
  startPerformance: (name: string, metadata?: Record<string, unknown>) =>
    logger.startPerformance(`${context}:${name}`, metadata),
  endPerformance: (name: string, additionalData?: Record<string, unknown>) =>
    logger.endPerformance(`${context}:${name}`, additionalData),
});
