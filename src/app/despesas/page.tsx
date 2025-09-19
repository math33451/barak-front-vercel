"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Card from "@/components/ui/Card";
import { Plus, FileMinus2 } from "lucide-react";

const mockAreas = [
  "Administrativo",
  "Vendas",
  "Oficina",
  "Marketing",
  "Financeiro",
];

const mockDespesas = [
  { id: 1, area: "Administrativo", descricao: "Contador", valor: 1200, data: "2024-06-01" },
  { id: 2, area: "Vendas", descricao: "Comissão vendedores", valor: 3500, data: "2024-06-05" },
  { id: 3, area: "Oficina", descricao: "Peças de reposição", valor: 2200, data: "2024-06-10" },
  { id: 4, area: "Marketing", descricao: "Anúncios online", valor: 800, data: "2024-06-12" },
  { id: 5, area: "Financeiro", descricao: "Taxas bancárias", valor: 300, data: "2024-06-15" },
];

export default function DespesasPage() {
  const [despesas, setDespesas] = useState(mockDespesas);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    area: mockAreas[0],
    descricao: "",
    valor: "",
    data: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setDespesas([
      ...despesas,
      {
        id: despesas.length + 1,
        ...form,
        valor: Number(form.valor),
      },
    ]);
    setForm({ area: mockAreas[0], descricao: "", valor: "", data: "" });
    setShowForm(false);
    setIsLoading(false);
  };

  // Agrupamento por área
  const despesasPorArea = mockAreas.map((area) => ({
    area,
    despesas: despesas.filter((d) => d.area === area),
    total: despesas.filter((d) => d.area === area).reduce((acc, d) => acc + Number(d.valor), 0),
  }));

  return (
    <DashboardLayout title="Despesas" activePath="/despesas">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <FileMinus2 className="h-6 w-6 text-[color:var(--primary)]" />
            Despesas por Área
          </h2>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" /> Nova Despesa
          </button>
        </div>
        <div className="space-y-6">
          {despesasPorArea.map(({ area, despesas, total }) => (
            <Card key={area}>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[color:var(--primary)]">{area}</span>
                <span className="font-bold text-[color:var(--heading)]">Total: R$ {total.toLocaleString("pt-BR")}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Descrição</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Valor</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {despesas.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-2 text-center text-gray-400">Nenhuma despesa cadastrada.</td>
                      </tr>
                    ) : (
                      despesas.map((d) => (
                        <tr key={d.id} className="hover:bg-gray-50">
                          <td className="px-4 py-2">{d.descricao}</td>
                          <td className="px-4 py-2">R$ {Number(d.valor).toLocaleString("pt-BR")}</td>
                          <td className="px-4 py-2">{d.data ? new Date(d.data).toLocaleDateString("pt-BR") : ""}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
        {/* Modal do formulário */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowForm(false)}
                aria-label="Fechar"
              >
                ×
              </button>
              <h3 className="text-xl font-bold mb-4 text-[color:var(--primary)]">
                Cadastrar nova despesa
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="area" className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                    Área
                  </label>
                  <select
                    id="area"
                    name="area"
                    value={form.area}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                  >
                    {mockAreas.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="descricao" className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                    Descrição
                  </label>
                  <input
                    id="descricao"
                    name="descricao"
                    value={form.descricao}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="valor" className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                    Valor (R$)
                  </label>
                  <input
                    id="valor"
                    name="valor"
                    type="number"
                    value={form.valor}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="data" className="block text-sm font-medium mb-1" style={{ color: "var(--foreground)" }}>
                    Data
                  </label>
                  <input
                    id="data"
                    name="data"
                    type="date"
                    value={form.data}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? "Salvando..." : "Salvar despesa"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
