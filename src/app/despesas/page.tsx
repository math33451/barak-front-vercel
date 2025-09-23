'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { FileMinus2 } from 'lucide-react';

export default function Despesas() {
  return (
    <DashboardLayout title="Despesas" activePath="/despesas">
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={FileMinus2}
          title="Gerenciamento de Despesas em Breve"
          message="A funcionalidade para cadastrar e gerenciar as despesas da sua concessionária está sendo preparada e estará disponível em breve."
        />
      </div>
    </DashboardLayout>
  );
}