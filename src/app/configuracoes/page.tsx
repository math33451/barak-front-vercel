'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import Card from '@/components/ui/Card';
import { useAutomateViewModel } from '@/viewmodels/useAutomateViewModel';
import { Rocket } from 'lucide-react';

export default function ConfiguracoesPage() {
  const { isUpdating, error, triggerUpdate } = useAutomateViewModel();

  return (
    <DashboardLayout title="Configurações" activePath="/configuracoes">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[color:var(--heading)] mb-6">
          Configurações do Sistema
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-[color:var(--primary)] mb-4 flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              Automações
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-[color:var(--muted)] mb-4">
                  Dispare processos automáticos do sistema, como a atualização de dados de integração.
                </p>
                <button
                  onClick={triggerUpdate}
                  disabled={isUpdating}
                  className="btn btn-primary w-full"
                >
                  {isUpdating ? 'Atualizando...' : 'Disparar Atualização ILA'}
                </button>
                {error && <p className="text-red-500 text-sm mt-2">Erro ao atualizar: {error.message}</p>}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
