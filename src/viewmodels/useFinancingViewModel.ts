import { useState } from "react";
import { Agreement } from "@/types";
import {
  useFinancingAgreements,
  useCreateAgreement,
  useDeleteAgreement,
} from "@/hooks/useEntities";

interface FinancingViewModel {
  isLoading: boolean;
  error: Error | null;
  agreements: Agreement[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingAgreement: Partial<Agreement> | null;
  openModal: (agreement?: Partial<Agreement>) => void;
  closeModal: () => void;
  handleSaveAgreement: (agreement: Omit<Agreement, "id">) => Promise<void>;
  handleDeleteAgreement: (agreementId: string) => Promise<void>;
}

export const useFinancingViewModel = (): FinancingViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] =
    useState<Partial<Agreement> | null>(null);

  // React Query hooks
  const { data: agreements = [], isLoading, error } = useFinancingAgreements();

  const createAgreementMutation = useCreateAgreement();
  const deleteAgreementMutation = useDeleteAgreement();

  const openModal = (agreement: Partial<Agreement> | null = null) => {
    setEditingAgreement(agreement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAgreement(null);
    setIsModalOpen(false);
  };

  const handleSaveAgreement = async (agreement: Omit<Agreement, "id">) => {
    try {
      await createAgreementMutation.mutateAsync(agreement);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar acordo:", err);
      throw err;
    }
  };

  const handleDeleteAgreement = async (agreementId: string) => {
    try {
      await deleteAgreementMutation.mutateAsync(agreementId);
    } catch (err) {
      console.error("Erro ao deletar acordo:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    agreements,
    isModalOpen,
    isSubmitting:
      createAgreementMutation.isPending || deleteAgreementMutation.isPending,
    editingAgreement,
    openModal,
    closeModal,
    handleSaveAgreement,
    handleDeleteAgreement,
  };
};
