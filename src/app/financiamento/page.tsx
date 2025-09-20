"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Plus } from "lucide-react";
import { useFinancingViewModel } from "@/viewmodels/useFinancingViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { FinancingOption } from "@/types";

export default function Financiamento() {
  const { isLoading, error, financingOptions } = useFinancingViewModel();

  const columns: Column<FinancingOption>[] = [
    {
      key: "bank",
      title: "Banco",
    },
    {
      key: "interestRate",
      title: "Taxa de Juros",
      render: (value: unknown) => (
        <span>{(value as number * 100).toFixed(2)}%</span>
      ),
    },
    {
      key: "maxTerm",
      title: "Prazo Máximo (meses)",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Financiamento" activePath="/financiamento">
        <div>Loading financing options...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Financiamento" activePath="/financiamento">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Financiamento" activePath="/financiamento">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <CreditCard
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Opções de Financiamento
          </h2>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nova Opção
          </button>
        </div>
        {financingOptions.length > 0 ? (
          <DataTable<FinancingOption> columns={columns} data={financingOptions} title="Opções de Financiamento" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhuma opção de financiamento cadastrada.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}