'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { Car } from 'lucide-react';

export default function Veiculos() {
  return (
    <DashboardLayout title="Veículos" activePath="/veiculos">
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={Car}
          title="Gerenciamento de Veículos em Breve"
          message="A funcionalidade para cadastrar e gerenciar os veículos da sua concessionária está sendo preparada e estará disponível em breve."
        />
      </div>
    </DashboardLayout>
  );
}