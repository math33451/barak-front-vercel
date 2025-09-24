"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Users, Plus, Edit, Trash2 } from "lucide-react";
import { useClientViewModel } from "@/viewmodels/useClientViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Client } from "@/types";
import ClientForm from "@/components/forms/ClientForm";

export default function Clientes() {
  const {
    isLoading,
    error,
    clients,
    isModalOpen,
    isSubmitting,
    editingClient,
    openModal,
    closeModal,
    handleSaveClient,
    handleDeleteClient,
  } = useClientViewModel();

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
    {
      key: "actions",
      title: "Ações",
      render: (_, client) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(client)}
            className="btn btn-sm btn-outline"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteClient(client.id)}
            className="btn btn-sm btn-outline btn-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading && !clients.length) {
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
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Novo Cliente
          </button>
        </div>
        {clients.length > 0 ? (
          <DataTable<Client>
            columns={columns}
            data={clients}
            title="Lista de Clientes"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhum cliente cadastrado.</p>
          </div>
        )}
      </div>
      <ClientForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        editingClient={editingClient}
        onClose={closeModal}
        onSave={handleSaveClient}
      />
    </DashboardLayout>
  );
}
