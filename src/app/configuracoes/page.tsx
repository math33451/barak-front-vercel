'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { Settings } from 'lucide-react';

export default function Configuracoes() {
  return (
    <DashboardLayout title="Configurações" activePath="/configuracoes">
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={Settings}
          title="Gerenciamento de Configurações em Breve"
          message="A funcionalidade para gerenciar as configurações do sistema está sendo preparada e estará disponível em breve."
        />
      </div>
    </DashboardLayout>
  );
}