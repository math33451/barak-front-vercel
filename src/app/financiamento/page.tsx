"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { useFinancingViewModel } from "@/viewmodels/useFinancingViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Agreement } from "@/types";
import AgreementForm from "@/components/forms/AgreementForm";

export default function Financiamento() {
  const {
    isLoading,
    error,
    agreements,
    isModalOpen,
    isSubmitting,
    editingAgreement,
    openModal,
    closeModal,
    handleSaveAgreement,
    handleDeleteAgreement,
  } = useFinancingViewModel();

  const columns: Column<Agreement>[] = [
    { key: "bankName", title: "Banco" },
    {
      key: "return1",
      title: "Retorno 1",
      render: (agreement) => {
        const agr = agreement as Agreement;
        const value = agr.return1 || 0;
        const percentage = (value * 100).toFixed(2);
        // Valor base médio de financiamento usado para cálculo (R$ 50.000)
        const baseValue = 50000;
        const monetaryValue = (value * baseValue).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-green-600">
              {monetaryValue}
            </span>
            <span className="text-xs text-gray-500">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      key: "return2",
      title: "Retorno 2",
      render: (agreement) => {
        const agr = agreement as Agreement;
        const value = agr.return2 || 0;
        const percentage = (value * 100).toFixed(2);
        const baseValue = 50000;
        const monetaryValue = (value * baseValue).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-green-600">
              {monetaryValue}
            </span>
            <span className="text-xs text-gray-500">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      key: "return3",
      title: "Retorno 3",
      render: (agreement) => {
        const agr = agreement as Agreement;
        const value = agr.return3 || 0;
        const percentage = (value * 100).toFixed(2);
        const baseValue = 50000;
        const monetaryValue = (value * baseValue).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-green-600">
              {monetaryValue}
            </span>
            <span className="text-xs text-gray-500">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      key: "return4",
      title: "Retorno 4",
      render: (agreement) => {
        const agr = agreement as Agreement;
        const value = agr.return4 || 0;
        const percentage = (value * 100).toFixed(2);
        const baseValue = 50000;
        const monetaryValue = (value * baseValue).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-green-600">
              {monetaryValue}
            </span>
            <span className="text-xs text-gray-500">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      key: "return5",
      title: "Retorno 5",
      render: (agreement) => {
        const agr = agreement as Agreement;
        const value = agr.return5 || 0;
        const percentage = (value * 100).toFixed(2);
        const baseValue = 50000;
        const monetaryValue = (value * baseValue).toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        return (
          <div className="flex flex-col">
            <span className="font-semibold text-green-600">
              {monetaryValue}
            </span>
            <span className="text-xs text-gray-500">({percentage}%)</span>
          </div>
        );
      },
    },
    {
      key: "actions",
      title: "Ações",
      render: (agreement) => {
        const agr = agreement as Agreement;
        return (
          <div className="flex gap-2">
            <button
              onClick={() => openModal(agr)}
              className="btn btn-sm btn-outline"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => handleDeleteAgreement(agr.id)}
              className="btn btn-sm btn-outline btn-error"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        );
      },
    },
  ];

  if (isLoading && !agreements.length) {
    return (
      <DashboardLayout title="Financiamento" activePath="/financiamento">
        <div>Loading agreements...</div>
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <CreditCard
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Acordos de Financiamento
          </h2>
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Novo Acordo
          </button>
        </div>
        {agreements.length > 0 ? (
          <DataTable<Agreement>
            columns={columns}
            data={agreements}
            title="Acordos de Financiamento"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhum acordo cadastrado.</p>
          </div>
        )}
      </div>
      <AgreementForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        editingAgreement={editingAgreement}
        onClose={closeModal}
        onSave={handleSaveAgreement}
      />
    </DashboardLayout>
  );
}
