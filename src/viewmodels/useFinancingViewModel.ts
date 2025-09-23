import { useState, useEffect, useCallback } from 'react';
import { FinancingService } from '@/services/FinancingService';
import { Agreement } from '@/types';

interface FinancingViewModel {
  isLoading: boolean;
  error: Error | null;
  agreements: Agreement[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingAgreement: Partial<Agreement> | null;
  openModal: (agreement?: Partial<Agreement>) => void;
  closeModal: () => void;
  handleSaveAgreement: (agreement: Omit<Agreement, 'id'>) => Promise<void>;
  handleDeleteAgreement: (agreementId: string) => Promise<void>;
}

export const useFinancingViewModel = (): FinancingViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<Partial<Agreement> | null>(null);

  const loadAgreements = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedAgreements = await FinancingService.fetchAgreements();
      setAgreements(fetchedAgreements);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgreements();
  }, [loadAgreements]);

  const openModal = (agreement: Partial<Agreement> | null = null) => {
    setEditingAgreement(agreement);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingAgreement(null);
    setIsModalOpen(false);
  };

  const handleSaveAgreement = async (agreement: Omit<Agreement, 'id'>) => {
    setIsSubmitting(true);
    try {
      await FinancingService.saveAgreement(agreement);
      await loadAgreements();
      closeModal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAgreement = async (agreementId: string) => {
    try {
      await FinancingService.deleteAgreement(agreementId);
      await loadAgreements();
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    agreements,
    isModalOpen,
    isSubmitting,
    editingAgreement,
    openModal,
    closeModal,
    handleSaveAgreement,
    handleDeleteAgreement,
  };
};