"use client";

import { ShoppingBag, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSalePageViewModel } from "@/viewmodels/useSalePageViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Sale } from "@/types";

export default function Vendas() {
  const { isLoading, error, sales } = useSalePageViewModel();

  const columns: Column<Sale>[] = [
    {
      key: "date",
      title: "Data",
      render: (value: unknown) => (
        <span>{new Date(value as string).toLocaleDateString("pt-BR")}</span>
      ),
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
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Vendas" activePath="/vendas">
        <div>Loading sales...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Vendas" activePath="/vendas">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Vendas" activePath="/vendas">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <ShoppingBag
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Vendas realizadas
          </h2>
          {/* Botão para nova venda (futuro) */}
          <button className="btn btn-primary flex items-center gap-2" disabled>
            <Plus className="h-5 w-5" /> Nova Venda
          </button>
        </div>
        {sales.length > 0 ? (
          <DataTable<Sale> columns={columns} data={sales} title="Lista de Vendas" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhuma venda cadastrada.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}