import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/SettingsService";
import { RetornoService } from "@/services/RetornoService";

// Query keys
export const settingsKeys = {
  all: ["settings"] as const,
  detail: () => [...settingsKeys.all, "detail"] as const,
};

export const retornoKeys = {
  all: ["retorno"] as const,
  list: () => [...retornoKeys.all, "list"] as const,
};

// Hooks para configurações
export const useSettings = () => {
  return useQuery({
    queryKey: settingsKeys.detail(),
    queryFn: SettingsService.fetchSettings,
    staleTime: 30 * 60 * 1000, // 30 minutos - dados muito estáveis
    gcTime: 60 * 60 * 1000, // 1 hora
  });
};

export const useUpdateSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SettingsService.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: settingsKeys.all });
    },
  });
};

// Hooks para retorno (agreements)
export const useRetornoAgreements = () => {
  return useQuery({
    queryKey: retornoKeys.list(),
    queryFn: RetornoService.fetchAgreements,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000,
  });
};

export const useUpdateRetorno = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: RetornoService.updateRetorno,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: retornoKeys.all });
      queryClient.invalidateQueries({ queryKey: ["banks"] }); // Retornos afetam bancos
    },
  });
};
