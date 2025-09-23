import { useState } from 'react';
import { AutomateService } from '@/services/AutomateService';

interface AutomateViewModel {
  isUpdating: boolean;
  error: Error | null;
  triggerUpdate: () => Promise<void>;
}

export const useAutomateViewModel = (): AutomateViewModel => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const triggerUpdate = async () => {
    try {
      setIsUpdating(true);
      setError(null);
      await AutomateService.triggerIlaUpdate();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    error,
    triggerUpdate,
  };
};