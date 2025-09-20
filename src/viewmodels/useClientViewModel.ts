import { useState, useEffect } from 'react';
import { ClientService } from '@/services/ClientService';
import { Client } from '@/types';

interface ClientViewModel {
  isLoading: boolean;
  error: Error | null;
  clients: Client[];
}

export const useClientViewModel = (): ClientViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const loadClients = async () => {
      try {
        setIsLoading(true);
        const fetchedClients = await ClientService.fetchClients();
        setClients(fetchedClients);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadClients();
  }, []);

  return {
    isLoading,
    error,
    clients,
  };
};