import { useState } from "react";
import {
  useProposals,
  useCreateProposal,
  useApproveProposal,
  useCancelProposal,
} from "@/hooks/useProposalsAndSales";
import { Proposal } from "@/types";

interface ProposalViewModel {
  isLoading: boolean;
  error: Error | null;
  proposals: Proposal[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingProposal: Partial<Proposal> | null;
  openModal: (proposal?: Partial<Proposal>) => void;
  closeModal: () => void;
  handleSaveProposal: (proposal: Omit<Proposal, "id">) => Promise<void>;
  handleApproveProposal: (proposalId: string) => Promise<void>;
  handleCancelProposal: (proposalId: string) => Promise<void>;
}

export const useProposalViewModel = (): ProposalViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProposal, setEditingProposal] =
    useState<Partial<Proposal> | null>(null);

  // React Query hooks
  const { data: proposals = [], isLoading, error } = useProposals();
  const createMutation = useCreateProposal();
  const approveMutation = useApproveProposal();
  const cancelMutation = useCancelProposal();

  const openModal = (proposal: Partial<Proposal> | null = null) => {
    setEditingProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProposal(null);
    setIsModalOpen(false);
  };

  const handleSaveProposal = async (proposal: Omit<Proposal, "id">) => {
    try {
      await createMutation.mutateAsync(proposal);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar proposta:", err);
      throw err;
    }
  };

  const handleApproveProposal = async (proposalId: string) => {
    try {
      await approveMutation.mutateAsync(proposalId);
    } catch (err) {
      console.error("Erro ao aprovar proposta:", err);
    }
  };

  const handleCancelProposal = async (proposalId: string) => {
    try {
      await cancelMutation.mutateAsync(proposalId);
    } catch (err) {
      console.error("Erro ao cancelar proposta:", err);
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    proposals,
    isModalOpen,
    isSubmitting: createMutation.isPending,
    editingProposal,
    openModal,
    closeModal,
    handleSaveProposal,
    handleApproveProposal,
    handleCancelProposal,
  };
};
