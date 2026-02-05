import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SettingsService } from "@/services/SettingsService";

// Query keys
export const settingsKeys = {
  all: ["settings"] as const,
  detail: () => [...settingsKeys.all, "detail"] as const,
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
