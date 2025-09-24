"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { FileText, Plus, Check, X, Edit } from "lucide-react";
import { useProposalViewModel } from "@/viewmodels/useProposalViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Proposal } from "@/types";
import ProposalForm from "@/components/forms/ProposalForm";

export default function Propostas() {
  const {
    isLoading,
    error,
    proposals,
    isModalOpen,
    isSubmitting,
    editingProposal,
    openModal,
    closeModal,
    handleSaveProposal,
    handleApproveProposal,
    handleCancelProposal,
  } = useProposalViewModel();

  const columns: Column<Proposal>[] = [
    {
      key: "client",
      title: "Cliente",
      render: (_, p) => p?.client?.name || "Cliente não informado",
    },
    {
      key: "vehicle",
      title: "Veículo",
      render: (_, p) => p?.vehicle?.name || "Veículo não informado",
    },
    {
      key: "value",
      title: "Valor",
      render: (_, p) => {
        const value = p?.value || 0;
        return `R$ ${value.toLocaleString("pt-BR", {
          minimumFractionDigits: 2,
        })}`;
      },
    },
    {
      key: "status",
      title: "Status",
      render: (_, p) => {
        const status = p?.status || "PENDENTE";
        const statusClasses = {
          FINALIZADA: "badge badge-success",
          PENDENTE: "badge badge-warning",
          CANCELADA: "badge badge-error",
        };
        return (
          <span
            className={
              statusClasses[status as keyof typeof statusClasses] || "badge"
            }
          >
            {status}
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Ações",
      render: (_, proposal) => {
        if (!proposal?.id) return null;

        return (
          <div className="flex gap-2">
            <button
              onClick={() => openModal(proposal)}
              className="btn btn-sm btn-outline"
              title="Editar"
            >
              <Edit className="h-4 w-4" />
            </button>
            {proposal.status === "PENDENTE" && (
              <>
                <button
                  onClick={() => handleApproveProposal(proposal.id)}
                  className="btn btn-sm btn-outline btn-success"
                  title="Aprovar"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleCancelProposal(proposal.id)}
                  className="btn btn-sm btn-outline btn-error"
                  title="Cancelar"
                >
                  <X className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Propostas" activePath="/propostas">
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Carregando propostas...</span>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Propostas" activePath="/propostas">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">
            Erro ao carregar propostas: {error.message}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 btn btn-sm btn-outline"
          >
            Tentar novamente
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Garantir que proposals é um array válido
  const safeProposals = Array.isArray(proposals)
    ? proposals.filter((p) => p && p.id)
    : [];

  return (
    <DashboardLayout title="Propostas" activePath="/propostas">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <FileText className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Propostas de Venda
          </h2>
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Nova Proposta
          </button>
        </div>
        {safeProposals.length > 0 ? (
          <DataTable<Proposal>
            columns={columns}
            data={safeProposals}
            title="Lista de Propostas"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhuma proposta cadastrada.</p>
          </div>
        )}
      </div>
      <ProposalForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        editingProposal={editingProposal}
        onClose={closeModal}
        onSave={handleSaveProposal}
      />
    </DashboardLayout>
  );
}
