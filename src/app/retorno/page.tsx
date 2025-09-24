"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import AgreementForm from "@/components/forms/AgreementForm";
import Card from "@/components/ui/Card";
import { Repeat, PlusCircle } from "lucide-react";
import { useRetornoViewModel } from "@/viewmodels/useRetornoViewModel";
import { Agreement } from "@/types";
import DataTable from "@/components/ui/DataTable";

export default function RetornoPage() {
  const { agreements, isLoading, error } = useRetornoViewModel();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] =
    useState<Partial<Agreement> | null>(null);

  const handleSave = (agreement: Omit<Agreement, "id">) => {
    console.log("Saving agreement:", agreement);
    // Here you would call a method from the view model to save the agreement
    setIsFormOpen(false);
  };

  const columns = [
    { key: "bankName", title: "Banco" },
    { key: "return1", title: "Retorno 1 (%)" },
    { key: "return2", title: "Retorno 2 (%)" },
    { key: "return3", title: "Retorno 3 (%)" },
    { key: "return4", title: "Retorno 4 (%)" },
    { key: "return5", title: "Retorno 5 (%)" },
    {
      key: "actions",
      title: "Ações",
      render: (_: unknown, agreement: Agreement) => (
        <button
          onClick={() => {
            setEditingAgreement(agreement);
            setIsFormOpen(true);
          }}
          className="text-blue-600 hover:underline"
        >
          Editar
        </button>
      ),
    },
  ];

  return (
    <DashboardLayout title="Retornos e Acordos" activePath="/retorno">
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Repeat className="h-8 w-8 text-blue-600" />
            Gestão de Retornos e Acordos
          </h1>
          <button
            onClick={() => {
              setEditingAgreement(null);
              setIsFormOpen(true);
            }}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusCircle size={20} />
            Novo Acordo
          </button>
        </div>

        {isLoading && <p className="text-center">Carregando acordos...</p>}
        {error && (
          <p className="text-center text-red-500">
            Erro ao carregar dados: {error.message}
          </p>
        )}

        {!isLoading && !error && (
          <Card>
            <DataTable
              title="Acordos com Bancos"
              columns={columns}
              data={agreements}
            />
          </Card>
        )}

        <AgreementForm
          isOpen={isFormOpen}
          isSubmitting={false} // Replace with actual state from view model if available
          editingAgreement={editingAgreement}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      </div>
    </DashboardLayout>
  );
}
