import { useState } from 'react';
import { RetornoService } from '@/services/RetornoService';
import { Retorno } from '@/types';

interface RetornoViewModel {
  isSaving: boolean;
  error: Error | null;
  saveRetorno: (retorno: Retorno) => Promise<void>;
}

export const useRetornoViewModel = (): RetornoViewModel => {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const saveRetorno = async (retorno: Retorno) => {
    try {
      setIsSaving(true);
      setError(null);
      await RetornoService.updateRetorno(retorno);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isSaving,
    error,
    saveRetorno,
  };
};