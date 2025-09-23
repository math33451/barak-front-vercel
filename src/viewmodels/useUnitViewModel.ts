import { useState, useEffect, useCallback } from 'react';
import { UnitService } from '@/services/UnitService';
import { UnidadeEmpresaDTO } from '@/types';

interface UnitViewModel {
  isLoading: boolean;
  error: Error | null;
  units: UnidadeEmpresaDTO[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingUnit: Partial<UnidadeEmpresaDTO> | null;
  openModal: (unit?: Partial<UnidadeEmpresaDTO>) => void;
  closeModal: () => void;
  handleSaveUnit: (unit: Omit<UnidadeEmpresaDTO, 'id'>) => Promise<void>;
  handleDeleteUnit: (unitId: number) => Promise<void>;
}

export const useUnitViewModel = (): UnitViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [units, setUnits] = useState<UnidadeEmpresaDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Partial<UnidadeEmpresaDTO> | null>(null);

  const loadUnits = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedUnits = await UnitService.fetchUnits();
      setUnits(fetchedUnits);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUnits();
  }, [loadUnits]);

  const openModal = (unit: Partial<UnidadeEmpresaDTO> | null = null) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUnit(null);
    setIsModalOpen(false);
  };

  const handleSaveUnit = async (unit: Omit<UnidadeEmpresaDTO, 'id'>) => {
    setIsSubmitting(true);
    try {
      await UnitService.saveUnit(unit);
      await loadUnits();
      closeModal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    try {
      await UnitService.deleteUnit(unitId);
      await loadUnits();
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    units,
    isModalOpen,
    isSubmitting,
    editingUnit,
    openModal,
    closeModal,
    handleSaveUnit,
    handleDeleteUnit,
  };
};