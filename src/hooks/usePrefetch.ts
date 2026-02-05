"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useCallback } from "react";

// Import query keys
import { reportKeys } from "./useReports";
import { proposalKeys } from "./useProposalsAndSales";
import { clientKeys, employeeKeys, bankKeys, unitKeys } from "./useEntities";

// Import services
import { ReportService } from "@/services/ReportService";
import { ProposalService } from "@/services/ProposalService";
import { ClientService } from "@/services/ClientService";
import { EmployeeService } from "@/services/EmployeeService";
import { BankService } from "@/services/BankService";
import { UnitService } from "@/services/UnitService";

/**
 * usePrefetch - Hook para prefetching inteligente de dados
 *
 * Estratégias:
 * 1. Prefetch on hover - carregar dados quando usuário passa mouse em link
 * 2. Prefetch on route - carregar dados ao navegar
 * 3. Prefetch on idle - carregar dados quando navegador está ocioso
 * 4. Prefetch predictive - carregar dados baseado em padrões de uso
 *
 * Benefícios:
 * - Reduz tempo de carregamento percebido
 * - Melhora experiência do usuário
 * - Otimiza uso de banda
 * - Carregamento antecipado inteligente
 */

interface PrefetchOptions {
  staleTime?: number;
  priority?: "high" | "normal" | "low";
}

export function usePrefetch() {
  const queryClient = useQueryClient();

  /**
   * Prefetch do Dashboard completo
   * Carrega todos os dados críticos do dashboard
   */
  const prefetchDashboard = useCallback(
    async (options?: PrefetchOptions) => {
      const staleTime = options?.staleTime || 2 * 60 * 1000;

      console.log("🚀 [Prefetch] Iniciando prefetch do Dashboard");

      await Promise.allSettled([
        // Relatório resumo (mais crítico)
        queryClient.prefetchQuery({
          queryKey: reportKeys.summary(),
          queryFn: ReportService.fetchReportSummary,
          staleTime,
        }),

        // Vendas por mês
        queryClient.prefetchQuery({
          queryKey: reportKeys.salesByMonth(),
          queryFn: ReportService.fetchSalesByMonth,
          staleTime: 5 * 60 * 1000,
        }),

        // Top vendedores
        queryClient.prefetchQuery({
          queryKey: reportKeys.topSellers(),
          queryFn: ReportService.fetchTopSellers,
          staleTime: 5 * 60 * 1000,
        }),

        // Financiamentos por banco
        queryClient.prefetchQuery({
          queryKey: reportKeys.financingByBank(),
          queryFn: ReportService.fetchFinancingByBank,
          staleTime: 10 * 60 * 1000,
        }),

        // Propostas completas
        queryClient.prefetchQuery({
          queryKey: reportKeys.propostasCompletas(),
          queryFn: ProposalService.fetchPropostasCompletas,
          staleTime: 5 * 60 * 1000,
        }),

        // Vendas finalizadas
        queryClient.prefetchQuery({
          queryKey: reportKeys.vendasFinalizadas(),
          queryFn: ProposalService.fetchVendasFinalizadas,
          staleTime,
        }),
      ]);

      console.log("✅ [Prefetch] Dashboard prefetch concluído");
    },
    [queryClient],
  );

  /**
   * Prefetch de Propostas
   */
  const prefetchProposals = useCallback(
    async (options?: PrefetchOptions) => {
      const staleTime = options?.staleTime || 5 * 60 * 1000;

      console.log("🚀 [Prefetch] Iniciando prefetch de Propostas");

      await Promise.allSettled([
        queryClient.prefetchQuery({
          queryKey: proposalKeys.list(),
          queryFn: ProposalService.fetchProposals,
          staleTime,
        }),
      ]);

      console.log("✅ [Prefetch] Propostas prefetch concluído");
    },
    [queryClient],
  );

  /**
   * Prefetch de Clientes
   */
  const prefetchClients = useCallback(
    async (options?: PrefetchOptions) => {
      const staleTime = options?.staleTime || 5 * 60 * 1000;

      console.log("🚀 [Prefetch] Iniciando prefetch de Clientes");

      await queryClient.prefetchQuery({
        queryKey: clientKeys.list(),
        queryFn: ClientService.fetchClients,
        staleTime,
      });

      console.log("✅ [Prefetch] Clientes prefetch concluído");
    },
    [queryClient],
  );

  /**
   * Prefetch de Funcionários
   */
  const prefetchEmployees = useCallback(
    async (options?: PrefetchOptions) => {
      const staleTime = options?.staleTime || 8 * 60 * 1000;

      console.log("🚀 [Prefetch] Iniciando prefetch de Funcionários");

      await queryClient.prefetchQuery({
        queryKey: employeeKeys.list(),
        queryFn: EmployeeService.fetchEmployees,
        staleTime,
      });

      console.log("✅ [Prefetch] Funcionários prefetch concluído");
    },
    [queryClient],
  );

  /**
   * Prefetch de Bancos
   */
  const prefetchBanks = useCallback(
    async (options?: PrefetchOptions) => {
      const staleTime = options?.staleTime || 10 * 60 * 1000;

      console.log("🚀 [Prefetch] Iniciando prefetch de Bancos");

      await queryClient.prefetchQuery({
        queryKey: bankKeys.list(),
        queryFn: BankService.fetchBanks,
        staleTime,
      });

      console.log("✅ [Prefetch] Bancos prefetch concluído");
    },
    [queryClient],
  );

  /**
   * Prefetch de Unidades
   */
  const prefetchUnits = useCallback(
    async (options?: PrefetchOptions) => {
      const staleTime = options?.staleTime || 10 * 60 * 1000;

      console.log("🚀 [Prefetch] Iniciando prefetch de Unidades");

      await queryClient.prefetchQuery({
        queryKey: unitKeys.list(),
        queryFn: UnitService.fetchUnits,
        staleTime,
      });

      console.log("✅ [Prefetch] Unidades prefetch concluído");
    },
    [queryClient],
  );

  /**
   * Prefetch por rota - carrega dados necessários para cada página
   */
  const prefetchByRoute = useCallback(
    async (route: string) => {
      console.log(`🚀 [Prefetch] Prefetch para rota: ${route}`);

      switch (route) {
        case "/":
        case "/dashboard":
          await prefetchDashboard();
          break;

        case "/propostas":
          await Promise.all([prefetchProposals(), prefetchClients()]);
          break;

        case "/clientes":
          await prefetchClients();
          break;

        case "/funcionarios":
          await Promise.all([prefetchEmployees(), prefetchUnits()]);
          break;

        case "/bancos":
          await prefetchBanks();
          break;

        case "/unidades":
          await prefetchUnits();
          break;

        case "/relatorios":
          await prefetchDashboard();
          break;

        default:
          console.log("⚠️ [Prefetch] Rota sem prefetch configurado:", route);
      }
    },
    [
      prefetchDashboard,
      prefetchProposals,
      prefetchClients,
      prefetchEmployees,
      prefetchBanks,
      prefetchUnits,
    ],
  );

  /**
   * Prefetch on hover - carrega dados quando mouse passa sobre link
   * Usar em componentes de navegação
   */
  const prefetchOnHover = useCallback(
    (route: string) => {
      return {
        onMouseEnter: () => {
          // Usar requestIdleCallback se disponível, senão setTimeout
          if (
            typeof window !== "undefined" &&
            "requestIdleCallback" in window
          ) {
            window.requestIdleCallback(() => prefetchByRoute(route), {
              timeout: 2000,
            });
          } else {
            setTimeout(() => prefetchByRoute(route), 100);
          }
        },
      };
    },
    [prefetchByRoute],
  );

  /**
   * Prefetch on visibility - carrega dados quando elemento fica visível
   * Útil para scroll infinito ou lazy loading
   */
  const prefetchOnVisible = useCallback((callback: () => Promise<void>) => {
    if (typeof window === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 },
    );

    return observer;
  }, []);

  /**
   * Prefetch inteligente - analisa padrões e prefetch preditivo
   */
  const smartPrefetch = useCallback(() => {
    if (typeof window === "undefined") return;

    // Usar requestIdleCallback para não interferir com performance
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(
        async () => {
          // Analisar histórico de navegação (localStorage)
          const navigationHistory =
            JSON.parse(localStorage.getItem("nav_history") || "[]") || [];

          // Se usuário acessa dashboard frequentemente, prefetch automático
          const dashboardVisits = navigationHistory.filter((h: string) =>
            h.includes("dashboard"),
          ).length;

          if (dashboardVisits > 3) {
            console.log(
              "🧠 [Prefetch] Smart prefetch detectou padrão - carregando dashboard",
            );
            await prefetchDashboard({ priority: "low" });
          }

          // Se usuário acessa propostas frequentemente
          const proposalsVisits = navigationHistory.filter((h: string) =>
            h.includes("propostas"),
          ).length;

          if (proposalsVisits > 2) {
            console.log(
              "🧠 [Prefetch] Smart prefetch detectou padrão - carregando propostas",
            );
            await prefetchProposals({ priority: "low" });
          }
        },
        { timeout: 5000 },
      );
    }
  }, [prefetchDashboard, prefetchProposals]);

  /**
   * Auto prefetch - executa na montagem do componente
   */
  useEffect(() => {
    // Executar smart prefetch após um delay
    const timeoutId = setTimeout(smartPrefetch, 3000);
    return () => clearTimeout(timeoutId);
  }, [smartPrefetch]);

  /**
   * Salvar histórico de navegação para análise preditiva
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const saveNavigation = () => {
      const history =
        JSON.parse(localStorage.getItem("nav_history") || "[]") || [];
      history.push(window.location.pathname);

      // Manter apenas últimas 50 navegações
      if (history.length > 50) {
        history.shift();
      }

      localStorage.setItem("nav_history", JSON.stringify(history));
    };

    saveNavigation();
  }, []);

  return {
    // Prefetch por tipo de dado
    prefetchDashboard,
    prefetchProposals,
    prefetchClients,
    prefetchEmployees,
    prefetchBanks,
    prefetchUnits,

    // Prefetch por rota
    prefetchByRoute,

    // Prefetch strategies
    prefetchOnHover,
    prefetchOnVisible,
    smartPrefetch,
  };
}

/**
 * Hook para status de cache
 * Útil para debugging e monitoramento
 */
export function useCacheStatus() {
  const queryClient = useQueryClient();

  const getCacheStatus = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();

    const status = {
      total: queries.length,
      active: queries.filter((q) => q.getObserversCount() > 0).length,
      inactive: queries.filter((q) => q.getObserversCount() === 0).length,
      fetching: queries.filter((q) => q.state.fetchStatus === "fetching")
        .length,
      success: queries.filter((q) => q.state.status === "success").length,
      error: queries.filter((q) => q.state.status === "error").length,
      stale: queries.filter((q) => q.isStale()).length,
      fresh: queries.filter((q) => !q.isStale()).length,
    };

    return status;
  }, [queryClient]);

  const getQueryDetails = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();

    return queries.map((q) => ({
      key: q.queryKey,
      status: q.state.status,
      fetchStatus: q.state.fetchStatus,
      dataUpdatedAt: new Date(q.state.dataUpdatedAt).toLocaleString(),
      isStale: q.isStale(),
      observers: q.getObserversCount(),
    }));
  }, [queryClient]);

  return {
    getCacheStatus,
    getQueryDetails,
  };
}

/**
 * Hook para limpar cache
 */
export function useClearCache() {
  const queryClient = useQueryClient();

  const clearAll = useCallback(() => {
    queryClient.clear();
    if (typeof window !== "undefined") {
      localStorage.removeItem("BARAK_QUERY_CACHE");
      sessionStorage.clear();
    }
    console.log("🗑️ [Cache] Cache completamente limpo");
  }, [queryClient]);

  const clearByKey = useCallback(
    (key: unknown[]) => {
      queryClient.removeQueries({ queryKey: key });
      console.log("🗑️ [Cache] Cache limpo para chave:", key);
    },
    [queryClient],
  );

  const clearStale = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    queries.forEach((q) => {
      if (q.isStale()) {
        queryClient.removeQueries({ queryKey: q.queryKey });
      }
    });
    console.log("🗑️ [Cache] Queries stale removidas");
  }, [queryClient]);

  const clearInactive = useCallback(() => {
    const queries = queryClient.getQueryCache().getAll();
    queries.forEach((q) => {
      if (q.getObserversCount() === 0) {
        queryClient.removeQueries({ queryKey: q.queryKey });
      }
    });
    console.log("🗑️ [Cache] Queries inativas removidas");
  }, [queryClient]);

  return {
    clearAll,
    clearByKey,
    clearStale,
    clearInactive,
  };
}
