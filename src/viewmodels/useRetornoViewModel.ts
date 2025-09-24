import { Agreement, Retorno } from "@/types";
import {
  useRetornoAgreements,
  useUpdateRetorno,
} from "@/hooks/useOtherServices";

interface RetornoViewModel {
  agreements: Agreement[];
  isLoading: boolean;
  error: Error | null;
  isSaving: boolean;
  fetchAgreements: () => void;
  saveRetorno: (retorno: Retorno) => Promise<void>;
}

export const useRetornoViewModel = (): RetornoViewModel => {
  // React Query hooks
  const {
    data: agreements = [],
    isLoading,
    error,
    refetch,
  } = useRetornoAgreements();

  const updateRetornoMutation = useUpdateRetorno();

  const fetchAgreements = () => {
    refetch();
  };

  const saveRetorno = async (retorno: Retorno) => {
    try {
      await updateRetornoMutation.mutateAsync(retorno);
    } catch (err) {
      console.error("Erro ao salvar retorno:", err);
      throw err;
    }
  };

  return {
    agreements,
    isLoading,
    error: error as Error | null,
    isSaving: updateRetornoMutation.isPending,
    fetchAgreements,
    saveRetorno,
  };
};
