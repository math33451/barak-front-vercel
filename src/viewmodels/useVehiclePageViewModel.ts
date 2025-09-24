import { useState } from "react";
import { Vehicle } from "@/types";
import {
  useVehicles,
  useCreateVehicle,
  useDeleteVehicle,
} from "@/hooks/useEntities";

interface VehiclePageViewModel {
  isLoading: boolean;
  error: Error | null;
  vehicles: Vehicle[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingVehicle: Partial<Vehicle> | null;
  openModal: (vehicle?: Partial<Vehicle>) => void;
  closeModal: () => void;
  handleSaveVehicle: (vehicle: Omit<Vehicle, "id">) => Promise<void>;
  handleDeleteVehicle: (vehicleId: string) => Promise<void>;
}

export const useVehiclePageViewModel = (): VehiclePageViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Partial<Vehicle> | null>(
    null
  );

  // React Query hooks
  const { data: vehicles = [], isLoading, error } = useVehicles();

  const createVehicleMutation = useCreateVehicle();
  const deleteVehicleMutation = useDeleteVehicle();

  const openModal = (vehicle: Partial<Vehicle> | null = null) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingVehicle(null);
    setIsModalOpen(false);
  };

  const handleSaveVehicle = async (vehicle: Omit<Vehicle, "id">) => {
    try {
      await createVehicleMutation.mutateAsync(vehicle);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar veículo:", err);
      throw err;
    }
  };

  const handleDeleteVehicle = async (vehicleId: string) => {
    try {
      await deleteVehicleMutation.mutateAsync(vehicleId);
    } catch (err) {
      console.error("Erro ao deletar veículo:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    vehicles,
    isModalOpen,
    isSubmitting:
      createVehicleMutation.isPending || deleteVehicleMutation.isPending,
    editingVehicle,
    openModal,
    closeModal,
    handleSaveVehicle,
    handleDeleteVehicle,
  };
};
