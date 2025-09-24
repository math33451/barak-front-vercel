import { useState } from "react";
import { UnidadeEmpresaDTO } from "@/types";
import { useUnits, useCreateUnit, useDeleteUnit } from "@/hooks/useEntities";

interface UnitViewModel {
  isLoading: boolean;
  error: Error | null;
  units: UnidadeEmpresaDTO[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingUnit: Partial<UnidadeEmpresaDTO> | null;
  openModal: (unit?: Partial<UnidadeEmpresaDTO>) => void;
  closeModal: () => void;
  handleSaveUnit: (unit: Omit<UnidadeEmpresaDTO, "id">) => Promise<void>;
  handleDeleteUnit: (unitId: number) => Promise<void>;
}

export const useUnitViewModel = (): UnitViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] =
    useState<Partial<UnidadeEmpresaDTO> | null>(null);

  // React Query hooks
  const { data: units = [], isLoading, error } = useUnits();

  const createUnitMutation = useCreateUnit();
  const deleteUnitMutation = useDeleteUnit();

  const openModal = (unit: Partial<UnidadeEmpresaDTO> | null = null) => {
    setEditingUnit(unit);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingUnit(null);
    setIsModalOpen(false);
  };

  const handleSaveUnit = async (unit: Omit<UnidadeEmpresaDTO, "id">) => {
    try {
      await createUnitMutation.mutateAsync(unit);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar unidade:", err);
      throw err;
    }
  };

  const handleDeleteUnit = async (unitId: number) => {
    try {
      await deleteUnitMutation.mutateAsync(unitId);
    } catch (err) {
      console.error("Erro ao deletar unidade:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    units,
    isModalOpen,
    isSubmitting: createUnitMutation.isPending || deleteUnitMutation.isPending,
    editingUnit,
    openModal,
    closeModal,
    handleSaveUnit,
    handleDeleteUnit,
  };
};
