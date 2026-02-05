"use client";

import { useState, useEffect } from "react";
import { Bank } from "@/types";

interface BankFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingBank: Partial<Bank> | null;
  onClose: () => void;
  onSave: (bank: Omit<Bank, "id">) => void;
}

export default function BankForm({
  isOpen,
  isSubmitting,
  editingBank,
  onClose,
  onSave,
}: BankFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [return1, setReturn1] = useState(0);
  const [return2, setReturn2] = useState(0);
  const [return3, setReturn3] = useState(0);
  const [return4, setReturn4] = useState(0);
  const [return5, setReturn5] = useState(0);

  useEffect(() => {
    if (editingBank) {
      setName(editingBank.name || "");
      setCode(editingBank.code || "");
      setReturn1(editingBank.return1 || 0);
      setReturn2(editingBank.return2 || 0);
      setReturn3(editingBank.return3 || 0);
      setReturn4(editingBank.return4 || 0);
      setReturn5(editingBank.return5 || 0);
    } else {
      setName("");
      setCode("");
      setReturn1(0);
      setReturn2(0);
      setReturn3(0);
      setReturn4(0);
      setReturn5(0);
    }
  }, [editingBank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      code,
      return1,
      return2,
      return3,
      return4,
      return5,
    });
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", overflowY: "auto" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl my-8">
        <h2 className="text-2xl font-bold mb-4">
          {editingBank ? "Editar Banco" : "Novo Banco"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Nome do Banco
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input w-full mt-1"
                placeholder="Ex: Banco do Brasil"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700"
              >
                Código
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="input w-full mt-1"
                placeholder="Ex: 001"
                required
              />
            </div>
          </div>

          <h3 className="text-lg font-semibold mb-3 mt-4 text-gray-700">
            Tabela de Retornos (Valores Decimais)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: "Retorno 1", val: return1, set: setReturn1 },
              { label: "Retorno 2", val: return2, set: setReturn2 },
              { label: "Retorno 3", val: return3, set: setReturn3 },
              { label: "Retorno 4", val: return4, set: setReturn4 },
              { label: "Retorno 5", val: return5, set: setReturn5 },
            ].map((item, index) => (
              <div key={index} className="mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {item.label}
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={item.val}
                  onChange={(e) => item.set(parseFloat(e.target.value))}
                  className="input w-full mt-1"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
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
