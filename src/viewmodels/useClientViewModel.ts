import { useState } from "react";
import { Client } from "@/types";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
} from "@/hooks/useEntities";

interface ClientViewModel {
  isLoading: boolean;
  error: Error | null;
  clients: Client[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingClient: Partial<Client> | null;
  openModal: (client?: Partial<Client>) => void;
  closeModal: () => void;
  handleSaveClient: (client: Omit<Client, "id">) => Promise<void>;
  handleDeleteClient: (clientId: string) => Promise<void>;
}

export const useClientViewModel = (): ClientViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(
    null
  );

  // React Query hooks
  const { data: clients = [], isLoading, error } = useClients();

  const createClientMutation = useCreateClient();
  const deleteClientMutation = useDeleteClient();

  const openModal = (client: Partial<Client> | null = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSaveClient = async (client: Omit<Client, "id">) => {
    try {
      await createClientMutation.mutateAsync(client);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar cliente:", err);
      throw err;
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteClientMutation.mutateAsync(clientId);
    } catch (err) {
      console.error("Erro ao deletar cliente:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    clients,
    isModalOpen,
    isSubmitting:
      createClientMutation.isPending || deleteClientMutation.isPending,
    editingClient,
    openModal,
    closeModal,
    handleSaveClient,
    handleDeleteClient,
  };
};
