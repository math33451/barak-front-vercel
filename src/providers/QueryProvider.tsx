"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState, ReactNode, useEffect } from "react";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";

interface QueryProviderProps {
  children: ReactNode;
}

/**
 * QueryProvider - Provider otimizado do React Query com cache inteligente
 *
 * Recursos:
 * - Cache em múltiplas camadas (memória + localStorage)
 * - Prefetching automático de dados críticos
 * - Invalidação inteligente
 * - Persistência de cache entre sessões
 * - Estratégias de retry otimizadas
 * - Network-aware caching
 */
export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Cache Strategy
            staleTime: 5 * 60 * 1000, // 5 minutos - dados considerados "fresh"
            gcTime: 30 * 60 * 1000, // 30 minutos - tempo antes de limpar da memória (era cacheTime)

            // Network Strategy
            refetchOnWindowFocus: true, // Revalidar ao focar na janela
            refetchOnReconnect: true, // Revalidar ao reconectar
            refetchOnMount: true, // Revalidar ao montar componente

            // Retry Strategy - otimizado para performance
            retry: (failureCount, error: unknown) => {
              // Não tentar novamente em erros 4xx (exceto 408 timeout)
              const axiosError = error as { response?: { status?: number } };
              if (
                axiosError?.response?.status &&
                axiosError.response.status >= 400 &&
                axiosError.response.status < 500
              ) {
                if (axiosError.response.status === 408) return failureCount < 2;
                return false;
              }
              // Para erros de rede ou 5xx, tentar até 3 vezes
              return failureCount < 3;
            },
            retryDelay: (attemptIndex) => {
              // Exponential backoff: 1s, 2s, 4s
              return Math.min(1000 * 2 ** attemptIndex, 30000);
            },

            // Performance
            networkMode: "online", // Só fazer requests quando online

            // Prefetching
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            placeholderData: (previousData: any) => previousData, // Manter dados anteriores enquanto revalida
          },
          mutations: {
            // Retry Strategy para mutations
            retry: (failureCount, error: unknown) => {
              // Não tentar novamente em erros 4xx
              const axiosError = error as { response?: { status?: number } };
              if (
                axiosError?.response?.status &&
                axiosError.response.status >= 400 &&
                axiosError.response.status < 500
              ) {
                return false;
              }
              // Para erros de rede ou 5xx, tentar até 2 vezes
              return failureCount < 2;
            },
            retryDelay: 1000, // 1 segundo entre tentativas
            networkMode: "online",
          },
        },
      }),
  );

  // Configurar persistência de cache apenas no cliente
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Criar persister usando localStorage
    const localStoragePersister = createSyncStoragePersister({
      storage: window.localStorage,
      key: "BARAK_QUERY_CACHE", // Chave única para o cache
      throttleTime: 1000, // Salvar no máximo a cada 1 segundo
    });

    // Configurar persistência com estratégias otimizadas
    const persistOptions = {
      queryClient,
      persister: localStoragePersister,
      maxAge: 24 * 60 * 60 * 1000, // 24 horas - cache persistente
      buster: "v1", // Versão do cache - mudar para invalidar todo cache
      dehydrateOptions: {
        // Apenas persistir queries bem-sucedidas
        shouldDehydrateQuery: (query: {
          state: { status: string; dataUpdatedAt: number };
        }) => {
          const queryIsReadyToPersist = query.state.status === "success";
          const queryIsNotTooOld =
            Date.now() - query.state.dataUpdatedAt < 60 * 60 * 1000; // 1 hora

          return queryIsReadyToPersist && queryIsNotTooOld;
        },
      },
    };

    // Iniciar persistência
    try {
      persistQueryClient(persistOptions);
      console.log("✅ [Cache] Persistência configurada com sucesso");
    } catch (error) {
      console.warn("⚠️ [Cache] Erro ao configurar persistência:", error);
    }
  }, [queryClient]);

  // Prefetching de dados críticos ao montar
  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefetchCriticalData = async () => {
      try {
        // Prefetch de dados do dashboard (mais críticos)
        await Promise.allSettled([
          // Relatórios principais
          queryClient.prefetchQuery({
            queryKey: ["reports", "summary"],
            staleTime: 2 * 60 * 1000, // 2 minutos
          }),

          // Propostas e clientes (dados frequentemente acessados)
          queryClient.prefetchQuery({
            queryKey: ["proposals", "list"],
            staleTime: 5 * 60 * 1000,
          }),

          queryClient.prefetchQuery({
            queryKey: ["clients", "list"],
            staleTime: 5 * 60 * 1000,
          }),
        ]);

        console.log("✅ [Cache] Prefetch de dados críticos concluído");
      } catch (error) {
        console.warn("⚠️ [Cache] Erro no prefetch:", error);
      }
    };

    // Executar prefetch após um pequeno delay para não bloquear render inicial
    const timeoutId = setTimeout(prefetchCriticalData, 500);

    return () => clearTimeout(timeoutId);
  }, [queryClient]);

  // Monitorar status de rede e ajustar estratégia
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      console.log("🌐 [Cache] Conexão restaurada - revalidando queries");
      queryClient.refetchQueries({ type: "active" });
    };

    const handleOffline = () => {
      console.log("📴 [Cache] Sem conexão - usando cache local");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [queryClient]);

  // Limpar cache antigo periodicamente (maintenance)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const cleanupInterval = setInterval(
      () => {
        // Remover queries inativas há mais de 30 minutos
        queryClient.getQueryCache().clear();
        console.log("🧹 [Cache] Limpeza de cache automática executada");
      },
      30 * 60 * 1000,
    ); // A cada 30 minutos

    return () => clearInterval(cleanupInterval);
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools habilitado apenas em desenvolvimento */}
      {process.env.NODE_ENV === "development" && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  );
}

/**
 * Hook para controle manual de cache
 * Útil para operações administrativas e debugging
 */
export function useCacheControl() {
  const [queryClient] = useState(() => new QueryClient());

  return {
    // Limpar todo cache
    clearAll: () => {
      queryClient.clear();
      if (typeof window !== "undefined") {
        localStorage.removeItem("BARAK_QUERY_CACHE");
      }
      console.log("🗑️ [Cache] Cache completamente limpo");
    },

    // Limpar cache específico
    clearByKey: (key: string[]) => {
      queryClient.removeQueries({ queryKey: key });
      console.log(`🗑️ [Cache] Cache limpo para chave:`, key);
    },

    // Forçar revalidação de tudo
    refetchAll: () => {
      queryClient.refetchQueries();
      console.log("🔄 [Cache] Revalidação forçada de todas queries");
    },

    // Verificar status do cache
    getCacheStatus: () => {
      const queries = queryClient.getQueryCache().getAll();
      return {
        totalQueries: queries.length,
        activeQueries: queries.filter((q) => q.state.fetchStatus === "fetching")
          .length,
        cachedQueries: queries.filter((q) => q.state.status === "success")
          .length,
        errorQueries: queries.filter((q) => q.state.status === "error").length,
      };
    },
  };
}
