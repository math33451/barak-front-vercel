'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import RetornoForm from '@/components/forms/RetornoForm';
import Card from '@/components/ui/Card';
import { Repeat } from 'lucide-react';

export default function RetornoPage() {
  return (
    <DashboardLayout title="Retorno" activePath="/retorno">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-[color:var(--heading)] mb-6 flex items-center gap-2">
          <Repeat className="h-6 w-6" style={{ color: "var(--primary)" }} />
          Atualizar Retorno
        </h2>
        <Card>
          <RetornoForm />
        </Card>
      </div>
    </DashboardLayout>
  );
}
