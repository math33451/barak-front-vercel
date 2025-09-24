import { useState } from "react";
import { Bank } from "@/types";
import { useBanks, useCreateBank, useDeleteBank } from "@/hooks/useEntities";

interface BankViewModel {
  isLoading: boolean;
  error: Error | null;
  banks: Bank[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingBank: Partial<Bank> | null;
  openModal: (bank?: Partial<Bank> | Bank) => void;
  closeModal: () => void;
  handleSaveBank: (bank: Omit<Bank, "id">) => Promise<void>;
  handleDeleteBank: (bankId: string) => Promise<void>;
}

export const useBankViewModel = (): BankViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Partial<Bank> | null>(null);

  // React Query hooks
  const { data: banks = [], isLoading, error } = useBanks();

  const createBankMutation = useCreateBank();
  const deleteBankMutation = useDeleteBank();

  const openModal = (bank: Partial<Bank> | Bank | null = null) => {
    setEditingBank(bank);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBank(null);
    setIsModalOpen(false);
  };

  const handleSaveBank = async (bank: Omit<Bank, "id">) => {
    try {
      await createBankMutation.mutateAsync(bank);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar banco:", err);
      throw err;
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    try {
      await deleteBankMutation.mutateAsync(bankId);
    } catch (err) {
      console.error("Erro ao deletar banco:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    banks,
    isModalOpen,
    isSubmitting: createBankMutation.isPending || deleteBankMutation.isPending,
    editingBank,
    openModal,
    closeModal,
    handleSaveBank,
    handleDeleteBank,
  };
};
