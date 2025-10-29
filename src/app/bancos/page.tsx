"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { useBankViewModel } from "@/viewmodels/useBankViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Bank } from "@/types";
import BankForm from "@/components/forms/BankForm";

export default function Bancos() {
  const {
    isLoading,
    error,
    banks,
    isModalOpen,
    isSubmitting,
    editingBank,
    openModal,
    closeModal,
    handleSaveBank,
    handleDeleteBank,
  } = useBankViewModel();

  const columns: Column<Bank>[] = [
    {
      key: "name",
      title: "Nome do Banco",
    },
    {
      key: "code",
      title: "Código",
    },
    {
      key: "totalFinancing",
      title: "Total Financiado",
      render: (_, bank) => (
        <span className="font-semibold text-green-600">
          {bank.totalFinancing
            ? `R$ ${bank.totalFinancing.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            : "R$ 0,00"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "Ações",
      render: (_, bank) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(bank)}
            className="btn btn-sm btn-outline"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteBank(bank.id)}
            className="btn btn-sm btn-outline btn-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading && !banks.length) {
    return (
      <DashboardLayout title="Bancos" activePath="/bancos">
        <div>Loading banks...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Bancos" activePath="/bancos">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Bancos" activePath="/bancos">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <CreditCard
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Bancos cadastrados
          </h2>
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Novo Banco
          </button>
        </div>
        {banks.length > 0 ? (
          <DataTable<Bank>
            columns={columns}
            data={banks}
            title="Lista de Bancos"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhum banco cadastrado.</p>
          </div>
        )}
      </div>
      <BankForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        editingBank={editingBank}
        onClose={closeModal}
        onSave={handleSaveBank}
      />
    </DashboardLayout>
  );
}
