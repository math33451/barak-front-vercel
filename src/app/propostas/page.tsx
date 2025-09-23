'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { FileText, Plus, Check, X, Edit } from 'lucide-react';
import { useProposalViewModel } from '@/viewmodels/useProposalViewModel';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Proposal } from '@/types';
import ProposalForm from '@/components/forms/ProposalForm';

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
    { key: 'client', title: 'Cliente', render: (p) => p.client.name },
    { key: 'vehicle', title: 'Veículo', render: (p) => p.vehicle.name },
    { key: 'value', title: 'Valor', render: (p) => `R$ ${p.value.toFixed(2)}` },
    { key: 'status', title: 'Status' },
    {
      key: 'actions',
      title: 'Ações',
      render: (proposal) => (
        <div className="flex gap-2">
          <button onClick={() => openModal(proposal)} className="btn btn-sm btn-outline">
            <Edit className="h-4 w-4" />
          </button>
          {proposal.status === 'PENDENTE' && (
            <>
              <button onClick={() => handleApproveProposal(proposal.id)} className="btn btn-sm btn-outline btn-success">
                <Check className="h-4 w-4" />
              </button>
              <button onClick={() => handleCancelProposal(proposal.id)} className="btn btn-sm btn-outline btn-error">
                <X className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (isLoading && !proposals.length) {
    return (
      <DashboardLayout title="Propostas" activePath="/propostas">
        <div>Loading proposals...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Propostas" activePath="/propostas">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Propostas" activePath="/propostas">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <FileText className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            Propostas de Venda
          </h2>
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Nova Proposta
          </button>
        </div>
        {proposals.length > 0 ? (
          <DataTable<Proposal> columns={columns} data={proposals} title="Lista de Propostas" />
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
