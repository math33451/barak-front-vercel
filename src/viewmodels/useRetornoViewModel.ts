import { useState, useEffect, useCallback } from "react";
import { RetornoService } from "@/services/RetornoService";
import { Agreement, Retorno } from "@/types";

interface RetornoViewModel {
  agreements: Agreement[];
  isLoading: boolean;
  error: Error | null;
  isSaving: boolean;
  fetchAgreements: () => Promise<void>;
  saveRetorno: (retorno: Retorno) => Promise<void>;
}

export const useRetornoViewModel = (): RetornoViewModel => {
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fetchAgreements = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await RetornoService.fetchAgreements();
      setAgreements(data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAgreements();
  }, [fetchAgreements]);

  const saveRetorno = async (retorno: Retorno) => {
    try {
      setIsSaving(true);
      setError(null);
      await RetornoService.updateRetorno(retorno);
      // Optionally, refetch agreements if the save operation could affect them
      // await fetchAgreements();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSaving(false);
    }
  };

  return {
    agreements,
    isLoading,
    error,
    isSaving,
    fetchAgreements,
    saveRetorno,
  };
};
