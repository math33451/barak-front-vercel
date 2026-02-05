import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ProposalService } from "@/services/ProposalService";

// Query keys para propostas
export const proposalKeys = {
  all: ["proposals"] as const,
  list: () => [...proposalKeys.all, "list"] as const,
  detail: (id: string | number) => [...proposalKeys.all, "detail", id] as const,
};

// Hook para todas as propostas
export const useProposals = () => {
  return useQuery({
    queryKey: proposalKeys.list(),
    queryFn: ProposalService.fetchProposals,
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 6 * 60 * 1000, // 6 minutos
  });
};

// Hook para criar proposta
export const useCreateProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProposalService.saveProposal,
    onSuccess: () => {
      // Invalidar cache de listas após criar
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      // Invalidar relatórios também já que pode afetar
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Hooks para aprovação/cancelamento
export const useApproveProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProposalService.approveProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

export const useCancelProposal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ProposalService.cancelProposal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: proposalKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
