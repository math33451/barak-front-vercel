import { useState, useEffect, useCallback } from 'react';
import { ProposalService } from '@/services/ProposalService';
import { Proposal } from '@/types';

interface ProposalViewModel {
  isLoading: boolean;
  error: Error | null;
  proposals: Proposal[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingProposal: Partial<Proposal> | null;
  openModal: (proposal?: Partial<Proposal>) => void;
  closeModal: () => void;
  handleSaveProposal: (proposal: Omit<Proposal, 'id'>) => Promise<void>;
  handleApproveProposal: (proposalId: string) => Promise<void>;
  handleCancelProposal: (proposalId: string) => Promise<void>;
}

export const useProposalViewModel = (): ProposalViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProposal, setEditingProposal] = useState<Partial<Proposal> | null>(null);

  const loadProposals = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedProposals = await ProposalService.fetchProposals();
      setProposals(fetchedProposals);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProposals();
  }, [loadProposals]);

  const openModal = (proposal: Partial<Proposal> | null = null) => {
    setEditingProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingProposal(null);
    setIsModalOpen(false);
  };

  const handleSaveProposal = async (proposal: Omit<Proposal, 'id'>) => {
    setIsSubmitting(true);
    try {
      await ProposalService.saveProposal(proposal);
      await loadProposals();
      closeModal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApproveProposal = async (proposalId: string) => {
    try {
      await ProposalService.approveProposal(proposalId);
      await loadProposals();
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleCancelProposal = async (proposalId: string) => {
    try {
      await ProposalService.cancelProposal(proposalId);
      await loadProposals();
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    proposals,
    isModalOpen,
    isSubmitting,
    editingProposal,
    openModal,
    closeModal,
    handleSaveProposal,
    handleApproveProposal,
    handleCancelProposal,
  };
};