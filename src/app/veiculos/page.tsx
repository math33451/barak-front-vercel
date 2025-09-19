"use client";

import { useState } from "react";
import { Car, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock de veículos cadastrados
const mockVeiculos = [
  {
    id: 1,
    marca: "Toyota",
    modelo: "Corolla",
    ano: 2022,
    placa: "ABC1D23",
    cor: "Prata",
    preco: 95000,
  },
  {
    id: 2,
    marca: "Honda",
    modelo: "Civic",
    ano: 2021,
    placa: "DEF4G56",
    cor: "Preto",
    preco: 105000,
  },
];

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState(mockVeiculos);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    marca: "",
    modelo: "",
    ano: "",
    placa: "",
    cor: "",
    preco: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simular envio
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setVeiculos([
      ...veiculos,
      {
        id: veiculos.length + 1,
        ...form,
        ano: Number(form.ano),
        preco: Number(form.preco),
      },
    ]);
    setForm({ marca: "", modelo: "", ano: "", placa: "", cor: "", preco: "" });
    setShowForm(false);
  };

  return (
    <DashboardLayout title="Veículos" activePath="/veiculos">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <Car className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Veículos cadastrados
          </h2>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" /> Novo Veículo
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Marca
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Modelo
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Ano
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Placa
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cor
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Preço
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {veiculos.map((v) => (
                <tr key={v.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{v.marca}</td>
                  <td className="px-4 py-2">{v.modelo}</td>
                  <td className="px-4 py-2">{v.ano}</td>
                  <td className="px-4 py-2">{v.placa}</td>
                  <td className="px-4 py-2">{v.cor}</td>
                  <td className="px-4 py-2">
                    R$ {Number(v.preco).toLocaleString("pt-BR")}
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
                Cadastrar novo veículo
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="marca"
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Marca
                    </label>
                    <input
                      id="marca"
                      name="marca"
                      type="text"
                      required
                      value={form.marca}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: Toyota"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="modelo"
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Modelo
                    </label>
                    <input
                      id="modelo"
                      name="modelo"
                      type="text"
                      required
                      value={form.modelo}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: Corolla"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="ano"
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Ano
                    </label>
                    <input
                      id="ano"
                      name="ano"
                      type="number"
                      required
                      value={form.ano}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: 2022"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="placa"
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Placa
                    </label>
                    <input
                      id="placa"
                      name="placa"
                      type="text"
                      required
                      value={form.placa}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: ABC1D23"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cor"
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Cor
                    </label>
                    <input
                      id="cor"
                      name="cor"
                      type="text"
                      required
                      value={form.cor}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: Prata"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="preco"
                      className="block text-sm font-medium mb-1"
                      style={{
                        color: "var(--foreground)",
                      }}
                    >
                      Preço
                    </label>
                    <input
                      id="preco"
                      name="preco"
                      type="number"
                      required
                      value={form.preco}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: 95000"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? "Salvando..." : "Cadastrar Veículo"}
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
