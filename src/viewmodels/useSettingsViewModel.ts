import { useState } from "react";
import { AppSettings } from "@/types";
import { useSettings, useUpdateSettings } from "@/hooks/useOtherServices";

interface SettingsViewModel {
  isLoading: boolean;
  error: Error | null;
  settings: AppSettings | null;
  updateSetting: (
    key: keyof AppSettings,
    value: AppSettings[keyof AppSettings]
  ) => void;
  saveSettings: () => Promise<void>;
  isSaving: boolean;
}

export const useSettingsViewModel = (): SettingsViewModel => {
  const [localSettings, setLocalSettings] = useState<AppSettings | null>(null);

  // React Query hooks
  const { data: settings, isLoading, error } = useSettings();

  const updateSettingsMutation = useUpdateSettings();

  // Use local state for editing, fallback to server data
  const currentSettings = localSettings || settings || null;

  const updateSetting = (
    key: keyof AppSettings,
    value: AppSettings[keyof AppSettings]
  ) => {
    const baseSettings = settings || {
      appName: "Barak",
      currency: "BRL",
      dateFormat: "DD/MM/YYYY",
      notificationsEnabled: true,
    };

    setLocalSettings((prevSettings) => {
      const current = prevSettings || baseSettings;
      return { ...current, [key]: value };
    });
  };

  const saveSettings = async () => {
    if (!currentSettings) return;

    try {
      await updateSettingsMutation.mutateAsync(currentSettings);
      setLocalSettings(null); // Reset local state after successful save
    } catch (err) {
      console.error("Erro ao salvar configurações:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    settings: currentSettings,
    updateSetting,
    saveSettings,
    isSaving: updateSettingsMutation.isPending,
  };
};
