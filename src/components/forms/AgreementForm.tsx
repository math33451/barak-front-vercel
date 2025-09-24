"use client";

import { useState, useEffect } from "react";
import { Agreement, Bank, UnidadeEmpresaDTO } from "@/types";
import { BankService } from "@/services/BankService";
import { UnitService } from "@/services/UnitService";

interface AgreementFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingAgreement: Partial<Agreement> | null;
  onClose: () => void;
  onSave: (agreement: Omit<Agreement, "id">) => void;
}

export default function AgreementForm({
  isOpen,
  isSubmitting,
  editingAgreement,
  onClose,
  onSave,
}: AgreementFormProps) {
  const [unitId, setUnitId] = useState("");
  const [bankId, setBankId] = useState("");

  const [units, setUnits] = useState<UnidadeEmpresaDTO[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    UnitService.fetchUnits().then(setUnits);
    BankService.fetchBanks().then(setBanks);
  }, []);

  useEffect(() => {
    if (editingAgreement) {
      setUnitId(editingAgreement.unitId || "");
      setBankId(editingAgreement.bankId || "");
    } else {
      setUnitId("");
      setBankId("");
    }
  }, [editingAgreement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bankName = banks.find((b) => b.id === bankId)?.name || "";

    // Os valores de retorno serão buscados automaticamente do backend
    onSave({
      unitId,
      bankId,
      bankName,
      return1: 0, // Serão preenchidos pelo service
      return2: 0,
      return3: 0,
      return4: 0,
      return5: 0,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">
          {editingAgreement ? "Editar Acordo" : "Novo Acordo"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="unitId"
                className="block text-sm font-medium text-gray-700"
              >
                Unidade
              </label>
              <select
                id="unitId"
                value={unitId}
                onChange={(e) => setUnitId(e.target.value)}
                className="input w-full mt-1"
                required
              >
                <option value="" disabled>
                  Selecione uma unidade
                </option>
                {units.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                htmlFor="bankId"
                className="block text-sm font-medium text-gray-700"
              >
                Banco
              </label>
              <select
                id="bankId"
                value={bankId}
                onChange={(e) => setBankId(e.target.value)}
                className="input w-full mt-1"
                required
              >
                <option value="" disabled>
                  Selecione um banco
                </option>
                {banks.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mb-4 text-sm text-gray-600">
            <p>
              Os valores de retorno serão definidos automaticamente baseados no
              banco selecionado.
            </p>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
