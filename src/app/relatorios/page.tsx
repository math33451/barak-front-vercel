"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart3,
  ShoppingBag,
  Users,
  CreditCard,
  Car, // Added Car for estoqueSimulado
  TrendingUp, // Added TrendingUp for crescimentoSimulado
} from "lucide-react";
import React from "react";
import { useReportViewModel } from "@/viewmodels/useReportViewModel";
// Removed Card import
import { Line, Bar } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from 'chart.js';

ChartJS.register(...registerables);

export default function Relatorios() {
  const {
    isLoading,
    error,
    summary,
    salesByMonth,
    vehicleSalesByBrand,
    topSellers, // New
    financingByBank, // New
    // Simulation states
    clientes,
    taxaConversao,
    ticketMedio,
    percentualFinanciamento,
    // Simulation handlers
    setClientes,
    setTaxaConversao,
    setTicketMedio,
    setPercentualFinanciamento,
    // Calculated simulation values
    vendasSimuladas,
    faturamentoSimulado,
    faturamentoFinanciadoSimulado,
    faturamentoAVistaSimulado,
    financiamentosPrevistosSimulado,
    estoqueSimulado,
    crescimentoSimulado,
    ticketMedioRealSimulado,
    conversaoRealSimulado,
  } = useReportViewModel();

  if (isLoading) {
    return (
      <DashboardLayout title="Relatórios" activePath="/relatorios">
        <div>Loading reports...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Relatórios" activePath="/relatorios">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  if (!summary) {
    return (
      <DashboardLayout title="Relatórios" activePath="/relatorios">
        <div>No report summary available.</div>
      </DashboardLayout>
    );
  }

  // Sales by Month Chart Data
  const salesByMonthChartData = {
    labels: salesByMonth.map(item => item.month),
    datasets: [
      {
        label: "Vendas",
        data: salesByMonth.map(item => item.sales),
        borderColor: "rgb(2, 132, 199)",
        backgroundColor: "rgba(2, 132, 199, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const salesByMonthChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vendas por Mês",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#334155",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#334155",
        },
      },
    },
  };

  // Vehicle Sales by Brand Chart Data
  const vehicleSalesByBrandChartData = {
    labels: vehicleSalesByBrand.map(item => item.brand),
    datasets: [
      {
        label: "Vendas",
        data: vehicleSalesByBrand.map(item => item.sales),
        backgroundColor: [
          "rgba(2, 132, 199, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(56, 189, 248, 0.8)",
          "rgba(12, 74, 110, 0.8)",
          "rgba(125, 211, 252, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const vehicleSalesByBrandChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vendas de Veículos por Marca",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#334155",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#334155",
        },
      },
    },
  };

  return (
    <DashboardLayout title="Relatórios" activePath="/relatorios">
      <div className="max-w-5xl mx-auto space-y-8 px-2 md:px-0">
        {/* Controles de simulação - agrupados em um card único e responsivo */}
        <section className="bg-white rounded-xl shadow p-6 border border-gray-100 flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-4">
          <div className="flex-1 flex flex-col gap-2 min-w-[160px]">
            <label className="text-xs text-gray-700 font-medium">Clientes no mês</label>
            <input type="range" min={50} max={300} step={1} value={clientes} onChange={e => setClientes(Number(e.target.value))} className="accent-sky-600" />
            <span className="text-xs text-gray-500">{clientes} clientes</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 min-w-[160px]">
            <label className="text-xs text-gray-700 font-medium">Taxa de conversão (%)</label>
            <input type="range" min={0.2} max={0.9} step={0.01} value={taxaConversao} onChange={e => setTaxaConversao(Number(e.target.value))} className="accent-sky-600" />
            <span className="text-xs text-gray-500">{(taxaConversao * 100).toFixed(0)}%</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 min-w-[160px]">
            <label className="text-xs text-gray-700 font-medium">Ticket médio (R$)</label>
            <input type="range" min={50000} max={200000} step={1000} value={ticketMedio} onChange={e => setTicketMedio(Number(e.target.value))} className="accent-sky-600" />
            <span className="text-xs text-gray-500">R$ {ticketMedio.toLocaleString('pt-BR')}</span>
          </div>
          <div className="flex-1 flex flex-col gap-2 min-w-[160px]">
            <label className="text-xs text-gray-700 font-medium">% de vendas financiadas</label>
            <input type="range" min={0.05} max={0.7} step={0.01} value={percentualFinanciamento} onChange={e => setPercentualFinanciamento(Number(e.target.value))} className="accent-sky-600" />
            <span className="text-xs text-gray-500">{(percentualFinanciamento * 100).toFixed(0)}%</span>
          </div>
        </section>

        {/* Resumo geral - cards organizados em grid única, com espaçamento e agrupamento visual */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-2">
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Faturamento Total"
            value={`R$ ${faturamentoSimulado.toLocaleString("pt-BR")}`}
            destaque
          />
          <ResumoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Fat. Financiado"
            value={`R$ ${faturamentoFinanciadoSimulado.toLocaleString("pt-BR")}`}
          />
          <ResumoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Fat. à Vista"
            value={`R$ ${faturamentoAVistaSimulado.toLocaleString("pt-BR")}`}
          />
          <ResumoCard
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Vendas"
            value={vendasSimuladas}
          />
          <ResumoCard
            icon={<Users className="h-5 w-5" />}
            label="Clientes"
            value={clientes}
          />
          <ResumoCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Crescimento"
            value={`${crescimentoSimulado.toFixed(1)}%`}
          />
          <ResumoCard
            icon={<Car className="h-5 w-5" />}
            label="Estoque"
            value={estoqueSimulado}
          />
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Ticket Médio"
            value={`R$ ${ticketMedioRealSimulado.toLocaleString("pt-BR")}`}
          />
          <ResumoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Financiamentos"
            value={financiamentosPrevistosSimulado}
          />
          <ResumoCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Conversão Real"
            value={`${conversaoRealSimulado.toFixed(1)}%`}
          />
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Meta de Vendas"
            value={200}
          />
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Meta de Faturamento"
            value={`R$ ${(200 * ticketMedio).toLocaleString("pt-BR")}`}
          />
        </section>

        {/* Top vendedores e Distribuição de marcas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-base font-bold mb-3 text-[color:var(--heading)]">
              Top 5 Vendedores
            </h3>
            <ol className="space-y-1">
              {topSellers.map((v, i) => (
                <li key={v.name} className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-xs">
                    {i + 1}
                  </span>
                  <span className="font-medium text-[color:var(--heading)] text-sm">
                    {v.name}
                  </span>
                  <span className="ml-auto text-[color:var(--muted)] text-xs">
                    {v.sales} vendas
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-base font-bold mb-3 text-[color:var(--heading)]">
              Financiamentos por Banco
            </h3>
            <div className="flex flex-wrap gap-2">
              {financingByBank.map((f) => (
                <div key={f.bank} className="flex flex-col items-center w-20">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-base mb-1">
                    {f.bank[0]}
                  </div>
                  <span className="font-medium text-[color:var(--heading)] text-xs">
                    {f.bank}
                  </span>
                  <span className="text-[10px] text-[color:var(--muted)]">
                    {f.count} contratos
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gráficos */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <Line data={salesByMonthChartData} options={salesByMonthChartOptions} />
          </div>
          <div className="bg-white rounded-lg shadow p-6 border border-gray-100">
            <Bar data={vehicleSalesByBrandChartData} options={vehicleSalesByBrandChartOptions} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function ResumoCard({
  icon,
  label,
  value,
  destaque = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  destaque?: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-lg p-6 border shadow-sm gap-2 ${
        destaque
          ? "bg-sky-600 text-white border-sky-600"
          : "bg-white border-gray-100"
      }`}
    >
      <div className={`mb-2 ${destaque ? "text-white" : "text-sky-600"}`}>{icon}</div>
      <span className="text-xs font-medium mb-1">{label}</span>
      <span className="text-lg font-bold mt-1">{value}</span>
    </div>
  );
}
