import { AppSettings } from '@/types';

const mockSettings: AppSettings = {
  appName: 'Barak',
  currency: 'BRL',
  dateFormat: 'DD/MM/YYYY',
  notificationsEnabled: true,
};

const fetchSettings = async (): Promise<AppSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockSettings;
};

const updateSettings = async (settings: AppSettings): Promise<AppSettings> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  // In a real app, this would update the backend
  return settings;
};

export const SettingsService = {
  fetchSettings,
  updateSettings,
};
