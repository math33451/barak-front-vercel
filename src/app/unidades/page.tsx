"use client";

import { Suspense, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Building2, Plus, Edit, Trash2, Settings } from "lucide-react";
import { useUnitViewModel } from "@/viewmodels/useUnitViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { UnidadeEmpresaDTO } from "@/types";
import UnitForm from "@/components/forms/UnitForm";
import UnitManagementModal from "@/components/modals/UnitManagementModal";
import { usePrefetch } from "@/hooks/usePrefetch";
import { useEffect } from "react";
import { logger } from "@/utils/logger";

// Skeleton Loading Component
const UnitsTableSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="bg-white rounded-lg border border-gray-100 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 py-3">
                <div className="h-4 bg-gray-200 rounded w-40"></div>
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
                  <div className="h-4 bg-gray-100 rounded w-48"></div>
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
const UnitsContent = () => {
  const {
    isLoading,
    error,
    units,
    isModalOpen,
    isSubmitting,
    editingUnit,
    openModal,
    closeModal,
    handleSaveUnit,
    handleDeleteUnit,
  } = useUnitViewModel();

  const [activeUnitForManagement, setActiveUnitForManagement] = useState<UnidadeEmpresaDTO | null>(null);

  const columns: Column<UnidadeEmpresaDTO>[] = [
    { key: "name", title: "Nome da Unidade" },
    {
      key: "actions",
      title: "Ações",
      render: (_, unit) => (
        <div className="flex gap-2">
          <button
            onClick={() => setActiveUnitForManagement(unit)}
            className="btn btn-sm btn-outline btn-info"
            aria-label="Gerenciar metas e estoque"
            title="Gerenciar metas e estoque"
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => openModal(unit)}
            className="btn btn-sm btn-outline"
            aria-label="Editar unidade"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUnit(unit.id)}
            className="btn btn-sm btn-outline btn-error"
            aria-label="Deletar unidade"
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
              Erro ao carregar unidades
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
            <Building2 className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Unidades Cadastradas
          </h2>
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Nova Unidade
          </button>
        </div>

        {isLoading ? (
          <UnitsTableSkeleton />
        ) : units.length > 0 ? (
          <DataTable<UnidadeEmpresaDTO>
            columns={columns}
            data={units}
            title="Lista de Unidades"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4 text-center text-gray-500">
              Nenhuma unidade cadastrada ainda.{" "}
              <button
                onClick={() => openModal()}
                className="text-blue-600 hover:underline"
              >
                Cadastre a primeira unidade
              </button>
            </p>
          </div>
        )}
      </div>

      <UnitForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        editingUnit={editingUnit}
        onClose={closeModal}
        onSave={handleSaveUnit}
      />

      <UnitManagementModal
        isOpen={!!activeUnitForManagement}
        unit={activeUnitForManagement}
        onClose={() => setActiveUnitForManagement(null)}
      />
    </>
  );
};

// Main Page Component with Optimization
export default function Unidades() {
  const { prefetchUnits } = usePrefetch();

  // ⚡ Prefetch agressivo ao montar
  useEffect(() => {
    logger.startPerformance("unidades-prefetch");

    prefetchUnits().then(() => {
      logger.endPerformance("unidades-prefetch");
    });
  }, [prefetchUnits]);

  return (
    <DashboardLayout title="Unidades" activePath="/unidades">
      <Suspense fallback={<UnitsTableSkeleton />}>
        <UnitsContent />
      </Suspense>
    </DashboardLayout>
  );
}
