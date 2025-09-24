"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  TrendingUp,
  Target,
  BarChart3,
  Users,
  Car,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import React, { useState } from "react";
import { useReportViewModel } from "@/viewmodels/useReportViewModel";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

// Componente para cards de projeção
interface ProjectionCardProps {
  title: string;
  current: number;
  projected: number;
  period: string;
  unit?: string;
  icon: React.ReactNode;
  color: string;
  trend: "up" | "down" | "stable";
}

const ProjectionCard: React.FC<ProjectionCardProps> = ({
  title,
  current,
  projected,
  period,
  unit = "",
  icon,
  color,
  trend,
}) => {
  const difference = projected - current;
  const percentageChange = current > 0 ? (difference / current) * 100 : 0;

  const getTrendIcon = () => {
    if (trend === "up")
      return <ArrowUpRight className="w-4 h-4 text-green-600" />;
    if (trend === "down")
      return <ArrowDownRight className="w-4 h-4 text-red-600" />;
    return <div className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-600";
    if (trend === "down") return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
        {getTrendIcon()}
      </div>

      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Atual</span>
          <span className="font-semibold">
            {current.toLocaleString()}
            {unit}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Projetado ({period})</span>
          <span className="font-bold text-lg">
            {projected.toLocaleString()}
            {unit}
          </span>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">Variação</span>
          <span className={`text-sm font-medium ${getTrendColor()}`}>
            {percentageChange > 0 ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

// Componente para alertas de negócio
interface BusinessAlertProps {
  type: "warning" | "success" | "info" | "danger";
  title: string;
  message: string;
  action?: string;
}

const BusinessAlert: React.FC<BusinessAlertProps> = ({
  type,
  title,
  message,
  action,
}) => {
  const getConfig = () => {
    switch (type) {
      case "warning":
        return {
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          icon: AlertTriangle,
          color: "text-yellow-600",
        };
      case "success":
        return {
          bg: "bg-green-50",
          border: "border-green-200",
          icon: CheckCircle,
          color: "text-green-600",
        };
      case "danger":
        return {
          bg: "bg-red-50",
          border: "border-red-200",
          icon: AlertTriangle,
          color: "text-red-600",
        };
      default:
        return {
          bg: "bg-blue-50",
          border: "border-blue-200",
          icon: CheckCircle,
          color: "text-blue-600",
        };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bg} ${config.border} border rounded-lg p-4`}>
      <div className="flex items-start space-x-3">
        <Icon className={`w-5 h-5 ${config.color} mt-0.5`} />
        <div className="flex-1">
          <h4 className={`font-semibold ${config.color} mb-1`}>{title}</h4>
          <p className="text-sm text-gray-600 mb-2">{message}</p>
          {action && (
            <button
              className={`text-sm font-medium ${config.color} hover:underline`}
            >
              {action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function Relatorios() {
  const {
    isLoading,
    error,
    summary,
    salesByMonth,
    clientes,
    taxaConversao,
    ticketMedio,
    percentualFinanciamento,
    setClientes,
    setTaxaConversao,
    setTicketMedio,
    setPercentualFinanciamento,
    vendasSimuladas,
  } = useReportViewModel();

  const [projectionPeriod, setProjectionPeriod] = useState<
    "1M" | "3M" | "6M" | "1Y"
  >("3M");

  // Estados para controles avançados
  const [cenarioType, setCenarioType] = useState<
    "pessimista" | "realista" | "otimista"
  >("realista");
  const [margemLucro, setMargemLucro] = useState(0.15); // 15%
  const [investimentoMarketing, setInvestimentoMarketing] = useState(0.03); // 3% do faturamento
  const [sazonalidadeMultiplier, setSazonalidadeMultiplier] = useState(1.0);
  const [concorrenciaIntensidade, setConcorrenciaIntensidade] = useState(0.5); // Média
  const [tamanhoEquipe, setTamanhoEquipe] = useState(5);
  const [prazoMedioFinanciamento, setPrazoMedioFinanciamento] = useState(48); // meses
  const [jurosMedioFinanciamento, setJurosMedioFinanciamento] = useState(0.012); // 1.2% ao mês
  const [percentualEntrada, setPercentualEntrada] = useState(0.3); // 30%
  const [custoOperacional, setCustoOperacional] = useState(0.08); // 8% do faturamento

  if (isLoading) {
    return (
      <DashboardLayout title="Relatórios e Projeções" activePath="/relatorios">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando análises preditivas...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Relatórios e Projeções" activePath="/relatorios">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800">
            Erro ao carregar dados: {error.message}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Calcular projeções baseadas nos dados atuais e simulação
  const currentSales = summary?.vehiclesSold || 0;
  const currentRevenue = summary?.totalSales || 0;
  const currentClients = summary?.newClients || 0;

  // Projeções baseadas no período selecionado
  const getMultiplier = () => {
    switch (projectionPeriod) {
      case "1M":
        return 1.0;
      case "3M":
        return 2.8;
      case "6M":
        return 5.2;
      case "1Y":
        return 10.5;
      default:
        return 2.8;
    }
  };

  // Fatores de cenário
  const getCenarioMultiplier = () => {
    switch (cenarioType) {
      case "pessimista":
        return 0.75;
      case "realista":
        return 1.0;
      case "otimista":
        return 1.35;
      default:
        return 1.0;
    }
  };

  const multiplier = getMultiplier();
  const cenarioMultiplier = getCenarioMultiplier();
  const growthFactor = 1 + taxaConversao * 0.5; // Fator de crescimento baseado na conversão
  const teamEfficiency = Math.min(1 + (tamanhoEquipe - 3) * 0.1, 2.0); // Eficiência da equipe
  const marketingImpact = 1 + investimentoMarketing * 5; // Impacto do marketing
  const competitionFactor = 1 - concorrenciaIntensidade * 0.3; // Impacto da concorrência

  const baseProjection =
    vendasSimuladas *
    multiplier *
    growthFactor *
    teamEfficiency *
    marketingImpact *
    competitionFactor *
    sazonalidadeMultiplier;

  const projectedSales = Math.round(baseProjection * cenarioMultiplier);
  const projectedClients = Math.round(clientes * multiplier * marketingImpact);

  // Cálculos financeiros avançados
  const faturamentoBruto = projectedSales * ticketMedio;
  const custoTotal = faturamentoBruto * custoOperacional;
  const investimentoMarketingTotal = faturamentoBruto * investimentoMarketing;
  const lucroLiquido =
    faturamentoBruto - custoTotal - investimentoMarketingTotal;
  const margemRealizada = lucroLiquido / faturamentoBruto;

  // Análise de financiamento
  const vendasFinanciadas = projectedSales * percentualFinanciamento;
  const vendasAVista = projectedSales * (1 - percentualFinanciamento);
  const receitaFinanciamento =
    vendasFinanciadas *
    ticketMedio *
    (1 - percentualEntrada) *
    jurosMedioFinanciamento *
    prazoMedioFinanciamento;

  // Dados dos gráficos de projeção
  const projectionChartData = {
    labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"],
    datasets: [
      {
        label: "Vendas Reais",
        data: salesByMonth?.slice(0, 6).map((s) => s.sales) || [
          15, 18, 12, 25, 20, 22,
        ],
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.3,
      },
      {
        label: "Projeção Otimista",
        data: [25, 28, 32, 35, 38, 42],
        borderColor: "rgb(34, 197, 94)",
        backgroundColor: "rgba(34, 197, 94, 0.1)",
        borderDash: [5, 5],
        tension: 0.3,
      },
      {
        label: "Projeção Conservadora",
        data: [20, 22, 24, 26, 28, 30],
        borderColor: "rgb(249, 115, 22)",
        backgroundColor: "rgba(249, 115, 22, 0.1)",
        borderDash: [10, 5],
        tension: 0.3,
      },
    ],
  };

  // Análise de sazonalidade
  const seasonalityData = {
    labels: ["Jan-Mar", "Abr-Jun", "Jul-Set", "Out-Dez"],
    datasets: [
      {
        label: "Vendas por Trimestre",
        data: [65, 85, 70, 90],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
      },
    ],
  };

  // Market Share Projection
  const marketShareData = {
    labels: ["Sua Concessionária", "Concorrente A", "Concorrente B", "Outros"],
    datasets: [
      {
        data: [35, 25, 20, 20],
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(156, 163, 175, 0.6)",
          "rgba(156, 163, 175, 0.4)",
          "rgba(156, 163, 175, 0.2)",
        ],
      },
    ],
  };

  return (
    <DashboardLayout title="Relatórios e Projeções" activePath="/relatorios">
      <div className="max-w-7xl mx-auto space-y-8 px-4">
        {/* Header com controles de período */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Análises Preditivas e Projeções
              </h1>
              <p className="text-gray-600">
                Insights baseados em dados para tomada de decisões estratégicas
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Período:</span>
              {["1M", "3M", "6M", "1Y"].map((period) => (
                <button
                  key={period}
                  onClick={() =>
                    setProjectionPeriod(period as "1M" | "3M" | "6M" | "1Y")
                  }
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    projectionPeriod === period
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Seletor de Cenário */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Tipo de Cenário
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(["pessimista", "realista", "otimista"] as const).map((key) => {
              const cenarios = {
                pessimista: {
                  label: "Pessimista",
                  color: "red",
                  desc: "Crescimento conservador (-25%)",
                },
                realista: {
                  label: "Realista",
                  color: "blue",
                  desc: "Crescimento baseado em dados atuais",
                },
                otimista: {
                  label: "Otimista",
                  color: "green",
                  desc: "Crescimento acelerado (+35%)",
                },
              };
              const cenario = { key, ...cenarios[key] };

              return (
                <button
                  key={cenario.key}
                  onClick={() => setCenarioType(cenario.key)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    cenarioType === cenario.key
                      ? `border-${cenario.color}-500 bg-${cenario.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`font-medium ${
                      cenarioType === cenario.key
                        ? `text-${cenario.color}-700`
                        : "text-gray-700"
                    }`}
                  >
                    {cenario.label}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {cenario.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controles de Vendas e Marketing */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parâmetros de Vendas e Marketing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Leads Mensais: {clientes}
              </label>
              <input
                type="range"
                min={50}
                max={800}
                value={clientes}
                onChange={(e) => setClientes(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Taxa de Conversão: {(taxaConversao * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={0.8}
                step={0.01}
                value={taxaConversao}
                onChange={(e) => setTaxaConversao(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Investimento Marketing:{" "}
                {(investimentoMarketing * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min={0.01}
                max={0.1}
                step={0.001}
                value={investimentoMarketing}
                onChange={(e) =>
                  setInvestimentoMarketing(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Tamanho da Equipe: {tamanhoEquipe} pessoas
              </label>
              <input
                type="range"
                min={2}
                max={15}
                value={tamanhoEquipe}
                onChange={(e) => setTamanhoEquipe(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Controles Financeiros */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parâmetros Financeiros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Ticket Médio: R$ {ticketMedio.toLocaleString()}
              </label>
              <input
                type="range"
                min={30000}
                max={200000}
                step={1000}
                value={ticketMedio}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Margem de Lucro: {(margemLucro * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min={0.05}
                max={0.3}
                step={0.005}
                value={margemLucro}
                onChange={(e) => setMargemLucro(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Custo Operacional: {(custoOperacional * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min={0.03}
                max={0.15}
                step={0.005}
                value={custoOperacional}
                onChange={(e) => setCustoOperacional(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                % Financiado: {(percentualFinanciamento * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min={0.2}
                max={0.9}
                step={0.01}
                value={percentualFinanciamento}
                onChange={(e) =>
                  setPercentualFinanciamento(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Controles de Financiamento Detalhados */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Configurações de Financiamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Prazo Médio: {prazoMedioFinanciamento} meses
              </label>
              <input
                type="range"
                min={12}
                max={84}
                value={prazoMedioFinanciamento}
                onChange={(e) =>
                  setPrazoMedioFinanciamento(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Juros Mensais: {(jurosMedioFinanciamento * 100).toFixed(2)}%
              </label>
              <input
                type="range"
                min={0.005}
                max={0.025}
                step={0.001}
                value={jurosMedioFinanciamento}
                onChange={(e) =>
                  setJurosMedioFinanciamento(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                % Entrada: {(percentualEntrada * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min={0.1}
                max={0.6}
                step={0.05}
                value={percentualEntrada}
                onChange={(e) => setPercentualEntrada(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Receita Financeira: R${" "}
                {Math.round(receitaFinanciamento).toLocaleString()}
              </label>
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-green-600 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      (receitaFinanciamento / (faturamentoBruto * 0.1)) * 100,
                      100
                    )}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Mercado */}
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Fatores de Mercado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Intensidade da Concorrência:{" "}
                {concorrenciaIntensidade === 0.2
                  ? "Baixa"
                  : concorrenciaIntensidade === 0.5
                  ? "Média"
                  : concorrenciaIntensidade === 0.8
                  ? "Alta"
                  : "Personalizada"}
              </label>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.1}
                value={concorrenciaIntensidade}
                onChange={(e) =>
                  setConcorrenciaIntensidade(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Fator Sazonal:{" "}
                {sazonalidadeMultiplier === 0.8
                  ? "Baixa Temporada"
                  : sazonalidadeMultiplier === 1.0
                  ? "Normal"
                  : sazonalidadeMultiplier === 1.3
                  ? "Alta Temporada"
                  : "Personalizado"}
              </label>
              <input
                type="range"
                min={0.6}
                max={1.5}
                step={0.1}
                value={sazonalidadeMultiplier}
                onChange={(e) =>
                  setSazonalidadeMultiplier(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
            </div>
          </div>
        </div>

        {/* Cards de Projeções Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <ProjectionCard
            title="Vendas"
            current={currentSales}
            projected={projectedSales}
            period={projectionPeriod}
            unit=" unidades"
            icon={<Car className="w-6 h-6 text-white" />}
            color="bg-blue-600"
            trend="up"
          />

          <ProjectionCard
            title="Faturamento Bruto"
            current={currentRevenue}
            projected={Math.round(faturamentoBruto)}
            period={projectionPeriod}
            unit=""
            icon={<DollarSign className="w-6 h-6 text-white" />}
            color="bg-green-600"
            trend="up"
          />

          <ProjectionCard
            title="Lucro Líquido"
            current={Math.round(currentRevenue * 0.15)}
            projected={Math.round(lucroLiquido)}
            period={projectionPeriod}
            unit=""
            icon={<TrendingUp className="w-6 h-6 text-white" />}
            color="bg-emerald-600"
            trend="up"
          />

          <ProjectionCard
            title="Novos Clientes"
            current={currentClients}
            projected={projectedClients}
            period={projectionPeriod}
            unit=""
            icon={<Users className="w-6 h-6 text-white" />}
            color="bg-purple-600"
            trend="up"
          />

          <ProjectionCard
            title="Margem Realizada"
            current={15}
            projected={Math.round(margemRealizada * 100)}
            period={projectionPeriod}
            unit="%"
            icon={<Target className="w-6 h-6 text-white" />}
            color="bg-orange-600"
            trend={margemRealizada > 0.15 ? "up" : "stable"}
          />
        </div>

        {/* Alertas e Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Alertas Estratégicos
            </h3>

            <BusinessAlert
              type={taxaConversao < 0.3 ? "warning" : "success"}
              title={
                taxaConversao < 0.3
                  ? "Taxa de Conversão Baixa"
                  : "Taxa de Conversão Saudável"
              }
              message={
                taxaConversao < 0.3
                  ? "Sua taxa está abaixo da média do setor (30-40%). Considere melhorar o processo de vendas."
                  : "Sua taxa de conversão está dentro do esperado para o setor automotivo."
              }
              action="Ver Estratégias"
            />

            <BusinessAlert
              type={projectedSales > currentSales * 2 ? "warning" : "info"}
              title="Projeção de Crescimento"
              message={
                projectedSales > currentSales * 2
                  ? "Crescimento projetado muito agressivo. Verifique capacidade de estoque e equipe."
                  : "Projeção de crescimento conservadora e sustentável."
              }
              action="Ajustar Metas"
            />

            <BusinessAlert
              type="info"
              title="Oportunidade de Market Share"
              message="Com os parâmetros atuais, há potencial para aumentar 15% do market share local."
              action="Ver Análise Completa"
            />
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Market Share Projetado
            </h3>
            <div className="h-64">
              <Doughnut
                data={marketShareData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Gráficos de Análise */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Projeções de Vendas - Próximos 6 Meses
            </h3>
            <div className="h-80">
              <Line
                data={projectionChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Vendas (unidades)",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Análise de Sazonalidade
            </h3>
            <div className="h-80">
              <Bar
                data={seasonalityData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      title: {
                        display: true,
                        text: "Vendas (unidades)",
                      },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* Métricas Avançadas Expandidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                ROI Marketing
              </h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Investimento</span>
                <span className="font-medium">
                  R$ {Math.round(investimentoMarketingTotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Retorno</span>
                <span className="font-medium text-green-600">
                  R$ {Math.round(lucroLiquido).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">ROI</span>
                <span className="font-bold text-green-600">
                  {investimentoMarketingTotal > 0
                    ? Math.round(
                        (lucroLiquido / investimentoMarketingTotal) * 100
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Análise de Financiamento
              </h3>
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Vendas Financiadas
                </span>
                <span className="font-medium">
                  {Math.round(vendasFinanciadas)} unidades
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vendas à Vista</span>
                <span className="font-medium">
                  {Math.round(vendasAVista)} unidades
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Receita Extra</span>
                <span className="font-bold text-green-600">
                  R$ {Math.round(receitaFinanciamento).toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Eficiência da Equipe
              </h3>
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Vendas por Pessoa</span>
                <span className="font-medium">
                  {Math.round(projectedSales / tamanhoEquipe)} / mês
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Receita por Pessoa
                </span>
                <span className="font-medium">
                  R$ {Math.round(faturamentoBruto / tamanhoEquipe / 1000)}k
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Eficiência</span>
                <span
                  className={`font-bold ${
                    teamEfficiency > 1.2
                      ? "text-green-600"
                      : teamEfficiency > 1.0
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.round(teamEfficiency * 100)}%
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Custos e Margens
              </h3>
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Custo Total</span>
                <span className="font-medium text-red-600">
                  R$ {Math.round(custoTotal).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Margem Bruta</span>
                <span className="font-medium">
                  {Math.round((1 - custoOperacional) * 100)}%
                </span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-semibold">Margem Líquida</span>
                <span
                  className={`font-bold ${
                    margemRealizada > 0.15
                      ? "text-green-600"
                      : margemRealizada > 0.1
                      ? "text-yellow-600"
                      : "text-red-600"
                  }`}
                >
                  {Math.round(margemRealizada * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            📊 Resumo Executivo - Cenário{" "}
            {cenarioType.charAt(0).toUpperCase() + cenarioType.slice(1)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Projeção de Vendas
              </h4>
              <p className="text-2xl font-bold text-blue-600">
                {projectedSales} unidades
              </p>
              <p className="text-sm text-gray-600">
                Com equipe de {tamanhoEquipe} pessoas e {clientes} leads/mês
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Faturamento Projetado
              </h4>
              <p className="text-2xl font-bold text-green-600">
                R$ {Math.round(faturamentoBruto / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm text-gray-600">
                Com ticket médio de R$ {(ticketMedio / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Lucro Líquido
              </h4>
              <p className="text-2xl font-bold text-purple-600">
                R$ {Math.round(lucroLiquido / 1000).toFixed(0)}k
              </p>
              <p className="text-sm text-gray-600">
                Margem de {Math.round(margemRealizada * 100)}% após custos
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
