"use client";

import { useState, useEffect } from "react";
import { ClosureService } from "@/services/ClosureService";
import { UnitService } from "@/services/UnitService";
import { UnidadeEmpresaDTO } from "@/types";
import { Calendar, Check, AlertCircle } from "lucide-react";

interface ClosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ClosureModal({ isOpen, onClose }: ClosureModalProps) {
  const [units, setUnits] = useState<UnidadeEmpresaDTO[]>([]);
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      UnitService.fetchUnits().then(setUnits).catch(console.error);
      // Default to current month
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      // Set to first day of month as typical reference
      setDate(`${year}-${month}-01`);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUnit || !date) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await ClosureService.performMonthlyClosure({
        idUnidadeEmpresa: Number(selectedUnit),
        mesEAnoReferencia: date,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setSelectedUnit("");
      }, 2000);
    } catch (err: unknown) {
      console.error("Erro no fechamento:", err);
      setError("Falha ao realizar fechamento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-[100]"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <div className="flex items-center gap-2 mb-4 text-gray-800">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold">Fechamento Mensal</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Selecione a unidade e o mês de referência para consolidar os resultados.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Unidade
            </label>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="input w-full"
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data de Referência
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input w-full"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Geralmente o primeiro ou último dia do mês a fechar.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm flex items-center gap-2">
              <Check className="w-4 h-4" />
              Fechamento realizado com sucesso!
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || success}
            >
              {loading ? "Processando..." : "Realizar Fechamento"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
