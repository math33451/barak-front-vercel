'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import EmptyState from '@/components/ui/EmptyState';
import { BarChart3 } from 'lucide-react';

export default function Relatorios() {
  return (
    <DashboardLayout title="Relatórios" activePath="/relatorios">
      <div className="max-w-4xl mx-auto">
        <EmptyState
          icon={BarChart3}
          title="Relatórios e Simulações em Breve"
          message="A funcionalidade para gerar relatórios detalhados e realizar simulações de vendas está sendo preparada e estará disponível em breve."
        />
      </div>
    </DashboardLayout>
  );
}
