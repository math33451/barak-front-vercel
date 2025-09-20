"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { Plus, FileMinus2 } from "lucide-react";
import { useExpenseViewModel } from "@/viewmodels/useExpenseViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Expense } from "@/types";

export default function DespesasPage() {
  const { isLoading, error, expenses } = useExpenseViewModel();

  // Grouping logic moved to ViewModel or can be done here if needed for display
  const expensesByArea = expenses.reduce((acc, expense) => {
    const area = expense.category; // Assuming category is the "area"
    if (!acc[area]) {
      acc[area] = [];
    }
    acc[area].push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const sortedAreas = Object.keys(expensesByArea).sort();

  const columns: Column<Expense>[] = [
    {
      key: "description",
      title: "Descrição",
    },
    {
      key: "amount",
      title: "Valor",
      render: (value: unknown) => (
        <span>
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value as number)}
        </span>
      ),
    },
    {
      key: "date",
      title: "Data",
      render: (value: unknown) => (
        <span>{new Date(value as string).toLocaleDateString("pt-BR")}</span>
      ),
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Despesas" activePath="/despesas">
        <div>Loading expenses...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Despesas" activePath="/despesas">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Despesas" activePath="/despesas">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <FileMinus2 className="h-6 w-6 text-[color:var(--primary)]" />
            Despesas por Categoria
          </h2>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nova Despesa
          </button>
        </div>
        <div className="space-y-6">
          {sortedAreas.length === 0 && (
            <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
              <p className="p-4">Nenhuma despesa cadastrada.</p>
            </div>
          )}
          {sortedAreas.map((area) => (
            <Card key={area}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[color:var(--primary)]">
                  {area}
                </span>
                <span className="font-bold text-[color:var(--heading)]">
                  Total:{" "}
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    expensesByArea[area].reduce((sum, d) => sum + d.amount, 0)
                  )}
                </span>
              </div>
              <DataTable<Expense>
                columns={columns}
                data={expensesByArea[area]}
                title={`Despesas de ${area}`}
                viewAllLink="#" // Placeholder, adjust as needed
              />
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}