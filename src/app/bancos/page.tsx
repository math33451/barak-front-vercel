"use client";

import { Suspense, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Plus, Edit, Trash2, Briefcase } from "lucide-react";
import { useBankViewModel } from "@/viewmodels/useBankViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Bank } from "@/types";
import BankForm from "@/components/forms/BankForm";
import BankAgreementsModal from "@/components/modals/BankAgreementsModal";
import { usePrefetch } from "@/hooks/usePrefetch";
import { useEffect } from "react";
import { logger } from "@/utils/logger";

// Skeleton Loading Component
const BanksTableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </th>
              <th className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </th>
              <th className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
              </th>
              <th className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-20"></div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i}>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-100 rounded w-40"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-100 rounded w-16"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="h-4 bg-gray-100 rounded w-32"></div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <div className="h-8 w-8 bg-gray-100 rounded"></div>
                    <div className="h-8 w-8 bg-gray-100 rounded"></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// Main Content Component
const BanksContent = () => {
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

  const [activeBankForAgreements, setActiveBankForAgreements] = useState<Bank | null>(null);

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
            onClick={() => setActiveBankForAgreements(bank)}
            className="btn btn-sm btn-outline btn-info"
            aria-label="Gerenciar Acordos"
            title="Gerenciar Acordos"
          >
            <Briefcase className="h-4 w-4" />
          </button>
          <button
            onClick={() => openModal(bank)}
            className="btn btn-sm btn-outline"
            aria-label="Editar banco"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteBank(bank.id)}
            className="btn btn-sm btn-outline btn-error"
            aria-label="Deletar banco"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-red-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Erro ao carregar bancos
            </h3>
            <p className="text-sm text-red-700 mt-1">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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

        {isLoading ? (
          <BanksTableSkeleton />
        ) : banks.length > 0 ? (
          <DataTable<Bank>
            columns={columns}
            data={banks}
            title="Lista de Bancos"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4 text-center text-gray-500">
              Nenhum banco cadastrado ainda.{" "}
              <button
                onClick={() => openModal()}
                className="text-blue-600 hover:underline"
              >
                Cadastre o primeiro banco
              </button>
            </p>
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

      <BankAgreementsModal
        isOpen={!!activeBankForAgreements}
        bank={activeBankForAgreements}
        onClose={() => setActiveBankForAgreements(null)}
      />
    </>
  );
};

// Main Page Component with Optimization
export default function Bancos() {
  const { prefetchBanks } = usePrefetch();

  // ⚡ Prefetch agressivo ao montar
  useEffect(() => {
    logger.startPerformance("bancos-prefetch");

    prefetchBanks().then(() => {
      logger.endPerformance("bancos-prefetch");
    });
  }, [prefetchBanks]);

  return (
    <DashboardLayout title="Bancos" activePath="/bancos">
      <Suspense fallback={<BanksTableSkeleton />}>
        <BanksContent />
      </Suspense>
    </DashboardLayout>
  );
}
