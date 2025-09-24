"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Building, Plus, Edit, Trash2 } from "lucide-react";
import { useUnitViewModel } from "@/viewmodels/useUnitViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { UnidadeEmpresaDTO } from "@/types";
import UnitForm from "@/components/forms/UnitForm";

export default function Unidades() {
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

  const columns: Column<UnidadeEmpresaDTO>[] = [
    { key: "name", title: "Nome da Unidade" },
    {
      key: "actions",
      title: "Ações",
      render: (_, unit) => (
        <div className="flex gap-2">
          <button
            onClick={() => openModal(unit)}
            className="btn btn-sm btn-outline"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDeleteUnit(unit.id)}
            className="btn btn-sm btn-outline btn-error"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading && !units.length) {
    return (
      <DashboardLayout title="Unidades" activePath="/unidades">
        <div>Loading units...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Unidades" activePath="/unidades">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Unidades" activePath="/unidades">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <Building className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Unidades Cadastradas
          </h2>
          <button
            onClick={() => openModal()}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Nova Unidade
          </button>
        </div>
        {units.length > 0 ? (
          <DataTable<UnidadeEmpresaDTO>
            columns={columns}
            data={units}
            title="Lista de Unidades"
          />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhuma unidade cadastrada.</p>
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
    </DashboardLayout>
  );
}
