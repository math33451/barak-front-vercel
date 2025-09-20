import { useState, useEffect } from 'react';
import { SettingsService } from '@/services/SettingsService';
import { AppSettings } from '@/types';

interface SettingsViewModel {
  isLoading: boolean;
  error: Error | null;
  settings: AppSettings | null;
  updateSetting: (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => void;
  saveSettings: () => Promise<void>;
  isSaving: boolean;
}

export const useSettingsViewModel = (): SettingsViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setIsLoading(true);
        const fetchedSettings = await SettingsService.fetchSettings();
        setSettings(fetchedSettings);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const updateSetting = (key: keyof AppSettings, value: AppSettings[keyof AppSettings]) => {
    setSettings(prevSettings => {
      if (!prevSettings) return null;
      return { ...prevSettings, [key]: value };
    });
  };

  const saveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await SettingsService.updateSettings(settings);
      alert('Settings saved successfully!');
    } catch (err) {
      setError(err as Error);
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    isLoading,
    error,
    settings,
    updateSetting,
    saveSettings,
    isSaving,
  };
};