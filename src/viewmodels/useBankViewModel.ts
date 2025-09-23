import { useState, useEffect, useCallback } from 'react';
import { BankService } from '@/services/BankService';
import { Bank } from '@/types';

interface BankViewModel {
  isLoading: boolean;
  error: Error | null;
  banks: Bank[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingBank: Partial<Bank> | null;
  openModal: (bank?: Partial<Bank>) => void;
  closeModal: () => void;
  handleSaveBank: (bank: Omit<Bank, 'id'>) => Promise<void>;
  handleDeleteBank: (bankId: string) => Promise<void>;
}

export const useBankViewModel = (): BankViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingBank, setEditingBank] = useState<Partial<Bank> | null>(null);

  const loadBanks = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedBanks = await BankService.fetchBanks();
      setBanks(fetchedBanks);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBanks();
  }, [loadBanks]);

  const openModal = (bank: Partial<Bank> | null = null) => {
    setEditingBank(bank);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingBank(null);
    setIsModalOpen(false);
  };

  const handleSaveBank = async (bank: Omit<Bank, 'id'>) => {
    setIsSubmitting(true);
    try {
      await BankService.saveBank(bank);
      await loadBanks(); // Recarrega a lista
      closeModal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBank = async (bankId: string) => {
    try {
      await BankService.deleteBank(bankId);
      await loadBanks(); // Recarrega a lista
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    banks,
    isModalOpen,
    isSubmitting,
    editingBank,
    openModal,
    closeModal,
    handleSaveBank,
    handleDeleteBank,
  };
};