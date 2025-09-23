import { useState, useEffect, useCallback } from 'react';
import { ClientService } from '@/services/ClientService';
import { Client } from '@/types';

interface ClientViewModel {
  isLoading: boolean;
  error: Error | null;
  clients: Client[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingClient: Partial<Client> | null;
  openModal: (client?: Partial<Client>) => void;
  closeModal: () => void;
  handleSaveClient: (client: Omit<Client, 'id'>) => Promise<void>;
  handleDeleteClient: (clientId: string) => Promise<void>;
}

export const useClientViewModel = (): ClientViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);

  const loadClients = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedClients = await ClientService.fetchClients();
      setClients(fetchedClients);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const openModal = (client: Partial<Client> | null = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSaveClient = async (client: Omit<Client, 'id'>) => {
    setIsSubmitting(true);
    try {
      await ClientService.saveClient(client);
      await loadClients(); // Recarrega a lista
      closeModal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClient = async (clientId: string) => {
    try {
      await ClientService.deleteClient(clientId);
      await loadClients(); // Recarrega a lista
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    clients,
    isModalOpen,
    isSubmitting,
    editingClient,
    openModal,
    closeModal,
    handleSaveClient,
    handleDeleteClient,
  };
};