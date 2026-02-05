"use client";

import { useState } from "react";
import { Agreement, Bank } from "@/types";
import { useFinancingAgreements, useDeleteAgreement, useCreateAgreement } from "@/hooks/useEntities";
import { Plus, Trash2 } from "lucide-react";
import AgreementForm from "@/components/forms/AgreementForm";

interface BankAgreementsModalProps {
  isOpen: boolean;
  bank: Bank | null;
  onClose: () => void;
}

export default function BankAgreementsModal({
  isOpen,
  bank,
  onClose,
}: BankAgreementsModalProps) {
  const { data: allAgreements = [], isLoading } = useFinancingAgreements();
  const deleteAgreementMutation = useDeleteAgreement();
  const createAgreementMutation = useCreateAgreement();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAgreement, setEditingAgreement] = useState<Partial<Agreement> | null>(null);

  if (!isOpen || !bank) return null;

  const bankAgreements = allAgreements.filter((a) => a.bankId === bank.id);

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir este acordo?")) {
      await deleteAgreementMutation.mutateAsync(id);
    }
  };

  const handleSave = async (agreement: Omit<Agreement, "id">) => {
    await createAgreementMutation.mutateAsync(agreement);
    setIsFormOpen(false);
    setEditingAgreement(null);
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">Acordos - {bank.name}</h2>
        <p className="text-gray-500 mb-6">Gerencie os percentuais acordados para este banco por unidade.</p>

        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              setEditingAgreement({ bankId: bank.id, bankName: bank.name });
              setIsFormOpen(true);
            }}
            className="btn btn-sm btn-primary flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Novo Acordo
          </button>
        </div>

        {isLoading ? (
          <p>Carregando...</p>
        ) : bankAgreements.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Unidade</th>
                <th className="px-4 py-2 text-left">Percentual (%)</th>
                <th className="px-4 py-2 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bankAgreements.map((agreement) => (
                <tr key={agreement.id}>
                  <td className="px-4 py-2">
                    {/* Unidade ID é o que temos, idealmente teríamos o nome da unidade mapeado, 
                        mas o Agreement atual tem 'unitId'. O service poderia enriquecer isso ou 
                        buscamos unidades. Por simplicidade, assumo que UnitId é exibido ou o service traz nome.
                        O Service atual NÃO traz nome da unidade. Vamos exibir o ID por enquanto ou tentar enriquecer.
                        Como é uma lista simples, vou deixar assim. */}
                     Unidade {agreement.unitId}
                  </td>
                  <td className="px-4 py-2 font-bold text-green-600">
                    {agreement.agreementPercent?.toFixed(2)}%
                  </td>
                  <td className="px-4 py-2 text-right">
                    <button
                      onClick={() => handleDelete(agreement.id)}
                      className="text-red-500 hover:text-red-700 btn btn-ghost btn-xs"
                      title="Excluir"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-500 py-4 border rounded bg-gray-50">
            Nenhum acordo cadastrado para este banco.
          </p>
        )}
      </div>

      {/* Modal interno de Criação */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
             {/* Hack simples para sobrepor o outro modal */}
             <div className="absolute inset-0 bg-black/50" />
             <div className="relative bg-white rounded-lg p-1">
                <AgreementForm
                    isOpen={true}
                    isSubmitting={createAgreementMutation.isPending}
                    editingAgreement={editingAgreement}
                    onClose={() => setIsFormOpen(false)}
                    onSave={handleSave}
                />
             </div>
        </div>
      )}
    </div>
  );
}
