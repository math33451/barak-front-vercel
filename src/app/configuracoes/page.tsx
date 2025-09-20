"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { useSettingsViewModel } from "@/viewmodels/useSettingsViewModel";

export default function ConfiguracoesPage() {
  const { isLoading, error, settings, updateSetting, saveSettings, isSaving } = useSettingsViewModel();

  if (isLoading) {
    return (
      <DashboardLayout title="Configurações" activePath="/configuracoes">
        <div>Loading settings...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Configurações" activePath="/configuracoes">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  if (!settings) {
    return (
      <DashboardLayout title="Configurações" activePath="/configuracoes">
        <div>No settings found.</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Configurações" activePath="/configuracoes">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[color:var(--heading)] mb-6">
          Configurações do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-[color:var(--primary)] mb-4">
              Geral
            </h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="appName" className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Nome do Aplicativo
                </label>
                <input
                  id="appName"
                  name="appName"
                  type="text"
                  value={settings.appName}
                  onChange={(e) => updateSetting("appName", e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Moeda
                </label>
                <input
                  id="currency"
                  name="currency"
                  type="text"
                  value={settings.currency}
                  onChange={(e) => updateSetting("currency", e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
              <div>
                <label htmlFor="dateFormat" className="block text-sm font-medium text-[color:var(--foreground)] mb-1">
                  Formato de Data
                </label>
                <input
                  id="dateFormat"
                  name="dateFormat"
                  type="text"
                  value={settings.dateFormat}
                  onChange={(e) => updateSetting("dateFormat", e.target.value)}
                  className="input w-full text-sm"
                />
              </div>
              <div className="flex items-center">
                <input
                  id="notificationsEnabled"
                  name="notificationsEnabled"
                  type="checkbox"
                  checked={settings.notificationsEnabled}
                  onChange={(e) => updateSetting("notificationsEnabled", e.target.checked)}
                  className="form-checkbox h-5 w-5 text-[color:var(--primary)]"
                />
                <label htmlFor="notificationsEnabled" className="ml-2 block text-sm font-medium text-[color:var(--foreground)]">
                  Habilitar Notificações
                </label>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-[color:var(--primary)] mb-4">
              Ações
            </h3>
            <button
              onClick={saveSettings}
              disabled={isSaving}
              className="btn btn-primary w-full"
            >
              {isSaving ? "Salvando..." : "Salvar Configurações"}
            </button>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}