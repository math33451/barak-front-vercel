"use client";

import { useState } from "react";
import { ShoppingBag, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock de vendas (dados inspirados nos cards do dashboard)
const mockVendas = [
  {
    id: 1,
    cliente: "Maria Silva",
    veiculo: "Toyota Corolla XEi",
    tipo: "Carro",
    data: "2024-05-10",
    valor: 142900,
    vendedor: "Ana Silva",
  },
  {
    id: 2,
    cliente: "João Santos",
    veiculo: "Honda CB 500X",
    tipo: "Moto",
    data: "2024-05-12",
    valor: 39900,
    vendedor: "Carlos Mendes",
  },
  {
    id: 3,
    cliente: "Bianca Costa",
    veiculo: "Jeep Compass Limited",
    tipo: "Carro",
    data: "2024-05-15",
    valor: 189900,
    vendedor: "Júlia Santos",
  },
  {
    id: 4,
    cliente: "Rafael Oliveira",
    veiculo: "Yamaha MT-07",
    tipo: "Moto",
    data: "2024-05-18",
    valor: 48900,
    vendedor: "Rafael Oliveira",
  },
];

export default function Vendas() {
  const [vendas] = useState(mockVendas);

  return (
    <DashboardLayout title="Vendas" activePath="/vendas">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <ShoppingBag
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Vendas realizadas
          </h2>
          {/* Botão para nova venda (futuro) */}
          <button className="btn btn-primary flex items-center gap-2" disabled>
            <Plus className="h-5 w-5" /> Nova Venda
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cliente
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Veículo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Data
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Vendedor
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {vendas.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{v.cliente}</td>
                  <td className="px-4 py-2">{v.veiculo}</td>
                  <td className="px-4 py-2">{v.tipo}</td>
                  <td className="px-4 py-2">
                    {new Date(v.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">
                    R$ {Number(v.valor).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">{v.vendedor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
