import { AppSettings } from "@/types";
import { httpClient } from "@/infra/httpClient";

const fetchSettings = async (): Promise<AppSettings> => {
  const response = await httpClient.get<AppSettings>("/rest/configuracoes");
  return (
    response || {
      appName: "Barak",
      currency: "BRL",
      dateFormat: "DD/MM/YYYY",
      notificationsEnabled: true,
    }
  );
};

const updateSettings = async (settings: AppSettings): Promise<AppSettings> => {
  const response = await httpClient.post<AppSettings>(
    "/rest/configuracoes",
    settings
  );
  return response;
};

export const SettingsService = {
  fetchSettings,
  updateSettings,
};
