// Centralizando todos os hooks do React Query para importação fácil

// Reports
export * from "./useReports";

// Proposals & Sales
export * from "./useProposalsAndSales";

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
