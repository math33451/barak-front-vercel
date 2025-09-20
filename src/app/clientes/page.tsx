"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Users, Plus } from "lucide-react";
import { useClientViewModel } from "@/viewmodels/useClientViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Client } from "@/types";

export default function Clientes() {
  const { isLoading, error, clients } = useClientViewModel();

  const columns: Column<Client>[] = [
    {
      key: "name",
      title: "Nome",
    },
    {
      key: "email",
      title: "E-mail",
    },
    {
      key: "phone",
      title: "Telefone",
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Clientes" activePath="/clientes">
        <div>Loading clients...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Clientes" activePath="/clientes">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Clientes" activePath="/clientes">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <Users className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Clientes cadastrados
          </h2>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Novo Cliente
          </button>
        </div>
        {clients.length > 0 ? (
          <DataTable<Client> columns={columns} data={clients} title="Lista de Clientes" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhum cliente cadastrado.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}