import { useState, useEffect } from 'react';
import { VehiclePageService } from '@/services/VehiclePageService';
import { Vehicle } from '@/types';

interface VehiclePageViewModel {
  isLoading: boolean;
  error: Error | null;
  vehicles: Vehicle[];
}

export const useVehiclePageViewModel = (): VehiclePageViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        setIsLoading(true);
        const fetchedVehicles = await VehiclePageService.fetchVehicles();
        setVehicles(fetchedVehicles);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadVehicles();
  }, []);

  return {
    isLoading,
    error,
    vehicles,
  };
};