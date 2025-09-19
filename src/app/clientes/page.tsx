"use client";

import { useState } from "react";
import { Users, Plus } from "lucide-react";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Mock de clientes cadastrados
const mockClientes = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria.silva@email.com",
    telefone: "(11) 98765-4321",
    cidade: "São Paulo",
    criadoEm: "2024-05-01",
  },
  {
    id: 2,
    nome: "João Santos",
    email: "joao.santos@email.com",
    telefone: "(11) 97654-3210",
    cidade: "Campinas",
    criadoEm: "2024-05-03",
  },
  {
    id: 3,
    nome: "Bianca Costa",
    email: "bianca.costa@email.com",
    telefone: "(11) 91234-5678",
    cidade: "Santos",
    criadoEm: "2024-05-10",
  },
  {
    id: 4,
    nome: "Rafael Oliveira",
    email: "rafael.oliveira@email.com",
    telefone: "(11) 99876-5432",
    cidade: "Guarulhos",
    criadoEm: "2024-05-15",
  },
];

export default function Clientes() {
  const [clientes, setClientes] = useState(mockClientes);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cidade: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setIsLoading(false);
    setClientes([
      ...clientes,
      {
        id: clientes.length + 1,
        ...form,
        criadoEm: new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm({ nome: "", email: "", telefone: "", cidade: "" });
    setShowForm(false);
  };

  return (
    <DashboardLayout title="Clientes" activePath="/clientes">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <Users className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Clientes cadastrados
          </h2>
          <button
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setShowForm(true)}
          >
            <Plus className="h-5 w-5" /> Novo Cliente
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Nome
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  E-mail
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Telefone
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cidade
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  Cadastrado em
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {clientes.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 font-medium">{c.nome}</td>
                  <td className="px-4 py-2">{c.email}</td>
                  <td className="px-4 py-2">{c.telefone}</td>
                  <td className="px-4 py-2">{c.cidade}</td>
                  <td className="px-4 py-2">
                    {new Date(c.criadoEm).toLocaleDateString("pt-BR")}
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
                Cadastrar novo cliente
              </h3>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="nome"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Nome
                    </label>
                    <input
                      id="nome"
                      name="nome"
                      type="text"
                      required
                      value={form.nome}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: João da Silva"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      E-mail
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: joao@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="telefone"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Telefone
                    </label>
                    <input
                      id="telefone"
                      name="telefone"
                      type="text"
                      required
                      value={form.telefone}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: (11) 99999-9999"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="cidade"
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Cidade
                    </label>
                    <input
                      id="cidade"
                      name="cidade"
                      type="text"
                      required
                      value={form.cidade}
                      onChange={handleChange}
                      className="input w-full text-sm"
                      placeholder="Ex: São Paulo"
                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn btn-primary w-full"
                  >
                    {isLoading ? "Salvando..." : "Cadastrar Cliente"}
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
