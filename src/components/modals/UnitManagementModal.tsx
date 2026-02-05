"use client";

import { useState } from "react";
import { UnidadeEmpresaDTO } from "@/types";
import { UnitService } from "@/services/UnitService";
import { Target, Package, Users, Check } from "lucide-react";

interface UnitManagementModalProps {
  isOpen: boolean;
  unit: UnidadeEmpresaDTO | null;
  onClose: () => void;
}

export default function UnitManagementModal({
  isOpen,
  unit,
  onClose,
}: UnitManagementModalProps) {
  const [meta, setMeta] = useState<string>("");
  const [stock, setStock] = useState<string>("");
  const [visits, setVisits] = useState<string>("");
  const [loading, setLoading] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen || !unit) return null;

  const handleUpdate = async (type: "meta" | "stock" | "visits") => {
    setLoading(type);
    setSuccess(null);
    try {
      if (type === "meta" && meta) {
        await UnitService.updateMeta(unit.id, Number(meta));
      } else if (type === "stock" && stock) {
        await UnitService.updateStock(unit.id, Number(stock));
      } else if (type === "visits" && visits) {
        await UnitService.updateVisits(unit.id, Number(visits));
      }
      setSuccess(type);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error(`Erro ao atualizar ${type}:`, error);
      alert("Erro ao atualizar. Verifique o console.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1">Gerenciar Unidade</h2>
        <p className="text-gray-500 mb-6 text-sm">
          {unit.name} (ID: {unit.id})
        </p>

        <div className="space-y-6">
          {/* Meta Mensal */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center gap-2 mb-2 text-blue-800 font-semibold">
              <Target className="w-4 h-4" />
              <h3>Meta Mensal</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={meta}
                onChange={(e) => setMeta(e.target.value)}
                placeholder="Valor da Meta (R$)"
                className="input flex-1"
              />
              <button
                onClick={() => handleUpdate("meta")}
                disabled={loading === "meta" || !meta}
                className="btn btn-sm btn-primary"
              >
                {loading === "meta" ? "..." : success === "meta" ? <Check className="w-4 h-4" /> : "Salvar"}
              </button>
            </div>
          </div>

          {/* Estoque */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center gap-2 mb-2 text-green-800 font-semibold">
              <Package className="w-4 h-4" />
              <h3>Estoque Atual</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="Qtd. Veículos"
                className="input flex-1"
              />
              <button
                onClick={() => handleUpdate("stock")}
                disabled={loading === "stock" || !stock}
                className="btn btn-sm btn-primary bg-green-600 border-green-600 hover:bg-green-700 hover:border-green-700"
              >
                {loading === "stock" ? "..." : success === "stock" ? <Check className="w-4 h-4" /> : "Salvar"}
              </button>
            </div>
          </div>

          {/* Visitas */}
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center gap-2 mb-2 text-purple-800 font-semibold">
              <Users className="w-4 h-4" />
              <h3>Visitas Físicas</h3>
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={visits}
                onChange={(e) => setVisits(e.target.value)}
                placeholder="Qtd. Visitantes"
                className="input flex-1"
              />
              <button
                onClick={() => handleUpdate("visits")}
                disabled={loading === "visits" || !visits}
                className="btn btn-sm btn-primary bg-purple-600 border-purple-600 hover:bg-purple-700 hover:border-purple-700"
              >
                {loading === "visits" ? "..." : success === "visits" ? <Check className="w-4 h-4" /> : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
