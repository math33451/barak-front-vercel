"use client";

import { useState } from "react";
import { CreditCard, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock de financiamentos cadastrados
const mockFinanciamentos = [
  {
    id: 1,
    cliente: "Maria Silva",
    veiculo: "Toyota Corolla XEi",
    banco: "Banco do Brasil",
    valor: 80000,
    parcelas: 48,
    aprovado: true,
    criadoEm: "2024-05-01",
  },
  {
    id: 2,
    cliente: "João Santos",
    veiculo: "Honda CB 500X",
    banco: "Santander",
    valor: 25000,
    parcelas: 36,
    aprovado: false,
    criadoEm: "2024-05-03",
  },
  {
    id: 3,
    cliente: "Bianca Costa",
    veiculo: "Jeep Compass Limited",
    banco: "Itaú",
    valor: 120000,
    parcelas: 60,
    aprovado: true,
    criadoEm: "2024-05-10",
  },
];

export default function Financiamento() {
  const [financiamentos, setFinanciamentos] = useState(mockFinanciamentos);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    cliente: "",
    veiculo: "",
    banco: "",
    valor: "",
    parcelas: "",
    aprovado: false,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : false;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setFinanciamentos([
      ...financiamentos,
      {
        id: financiamentos.length + 1,
        ...form,
        valor: Number(form.valor),
        parcelas: Number(form.parcelas),
        criadoEm: new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm({
      cliente: "",
      veiculo: "",
      banco: "",
      valor: "",
      parcelas: "",
      aprovado: false,
    });
    setShowForm(false);
  };

  return (
    <DashboardLayout title="Financiamento" activePath="/financiamento">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <CreditCard
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Financiamentos cadastrados
          </h2>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" /> Novo Financiamento
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
                  Banco
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Valor
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Parcelas
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Aprovado
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cadastrado em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {financiamentos.map((f) => (
                <tr key={f.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{f.cliente}</td>
                  <td className="px-4 py-2">{f.veiculo}</td>
                  <td className="px-4 py-2">{f.banco}</td>
                  <td className="px-4 py-2">
                    R$ {Number(f.valor).toLocaleString("pt-BR")}
                  </td>
                  <td className="px-4 py-2">{f.parcelas}</td>
                  <td className="px-4 py-2">{f.aprovado ? "Sim" : "Não"}</td>
                  <td className="px-4 py-2">
                    {new Date(f.criadoEm).toLocaleDateString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                Cadastrar novo financiamento
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="cliente"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Cliente
                    </label>
                    <input
                      id="cliente"
                      name="cliente"
                      type="text"
                      required
                      value={form.cliente}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="veiculo"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Veículo
                    </label>
                    <input
                      id="veiculo"
                      name="veiculo"
                      type="text"
                      required
                      value={form.veiculo}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: Toyota Corolla"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="banco"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Banco
                    </label>
                    <input
                      id="banco"
                      name="banco"
                      type="text"
                      required
                      value={form.banco}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: Itaú"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="valor"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Valor
                    </label>
                    <input
                      id="valor"
                      name="valor"
                      type="number"
                      required
                      value={form.valor}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: 50000"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="parcelas"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Parcelas
                    </label>
                    <input
                      id="parcelas"
                      name="parcelas"
                      type="number"
                      required
                      value={form.parcelas}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: 48"
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <input
                      id="aprovado"
                      name="aprovado"
                      type="checkbox"
                      checked={form.aprovado}
                      onChange={handleChange}
                      className="form-checkbox"
                    />
                    <label
                      htmlFor="aprovado"
                      className="text-sm font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      Aprovado
                    </label>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? "Salvando..." : "Cadastrar Financiamento"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
