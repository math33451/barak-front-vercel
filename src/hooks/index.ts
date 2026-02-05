// Centralizando todos os hooks do React Query para importação fácil

// Reports
export * from "./useReports";

// Hooks para relatórios e dashboard
export * from "./useReports";

// Hooks para propostas e vendas
export * from "./useProposalsAndSales";

// Hooks para entidades (clientes, bancos, funcionários, etc)
export * from "./useEntities";

// Hooks para outros serviços (configurações, retorno)
export * from "./useOtherServices";

// Hooks customizados
export * from "./useToast";
export * from "./useIntegrationTests";

// Hooks de prefetch e cache
export * from "./usePrefetch";

// Entities (Clients, Banks, Employees)
export * from "./useEntities";

// Re-export principais para facilitar uso
export {
  useReportSummary,
  useSalesByMonth,
  useTopSellers,
  useInvalidateReports,
} from "./useReports";

export {
  useSales,
  useProposals,
  useCreateProposal,
  useApproveProposal,
  useCancelProposal,
} from "./useProposalsAndSales";

export {
  useClients,
  useBanks,
  useEmployees,
  useCreateClient,
  useCreateBank,
  useCreateEmployee,
} from "./useEntities";

export { usePrefetch, useCacheStatus, useClearCache } from "./usePrefetch";
