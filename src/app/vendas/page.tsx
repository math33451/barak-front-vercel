"use client";

import { ShoppingBag, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useSalePageViewModel } from "@/viewmodels/useSalePageViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Proposal } from "@/types";

export default function Vendas() {
  const { isLoading, error, sales } = useSalePageViewModel();

  const columns: Column<Proposal>[] = [
    {
      key: "updatedAt",
      title: "Data da Venda",
      render: (_, sale) => {
        try {
          return sale.updatedAt
            ? new Date(sale.updatedAt).toLocaleDateString("pt-BR")
            : "Data não disponível";
        } catch {
          return "Data inválida";
        }
      },
    },
    {
      key: "client",
      title: "Cliente",
      render: (_, sale) => sale.client?.name || "Cliente não informado",
    },
    {
      key: "vehicle",
      title: "Veículo",
      render: (_, sale) => sale.vehicle?.name || "Veículo não informado",
    },
    {
      key: "value",
      title: "Valor",
      render: (_, sale) => {
        try {
          return sale.value
            ? new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(sale.value)
            : "Valor não disponível";
        } catch {
          return "Valor inválido";
        }
      },
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
          <button className="btn btn-primary flex items-center gap-2" disabled>
            <Plus className="h-5 w-5" /> Nova Venda
          </button>
        </div>
        {sales.length > 0 ? (
          <DataTable<Proposal>
            columns={columns}
            data={sales}
            title="Lista de Vendas"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhuma venda cadastrada.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
