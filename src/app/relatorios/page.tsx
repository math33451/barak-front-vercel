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
import React, { useState, useEffect } from "react";
import { useReportViewModel } from "@/viewmodels/useReportViewModel";
import { Line, Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js";

ChartJS.register(...registerables);

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

// Componente para métricas destacadas principais
interface HighlightMetricProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  bgGradient: string;
}

const HighlightMetric: React.FC<HighlightMetricProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  bgGradient,
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-xl shadow-md p-6 ${bgGradient}`}
    >
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
            {icon}
          </div>
          {trend && (
            <div
              className={`flex items-center space-x-1 px-2 py-1 rounded-full bg-white/20 backdrop-blur-sm ${
                trend.isPositive ? "text-white" : "text-white"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              <span className="text-xs font-semibold">
                {Math.abs(trend.value).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        <h3 className="text-white/80 text-xs font-medium mb-1 uppercase tracking-wide">
          {title}
        </h3>

        <p className="text-white text-2xl md:text-3xl font-bold mb-1">
          {value}
        </p>

        <p className="text-white/70 text-xs">{subtitle}</p>
      </div>

      {/* Efeito de background decorativo */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
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
    metricasReais,
    tamanhoEquipeReal,
  } = useReportViewModel();

  const [projectionPeriod, setProjectionPeriod] = useState<
    "1M" | "3M" | "6M" | "1Y"
  >("1M");

  // Função para calcular dias úteis (excluindo sábados e domingos)
  const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
    let businessDays = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      // 0 = Domingo, 6 = Sábado
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return businessDays;
  };

  // Calcular dias úteis baseado no período de projeção
  const getBusinessDaysForPeriod = () => {
    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1); // Primeiro dia do mês atual

    let endDate = new Date(startDate);

    switch (projectionPeriod) {
      case "1M":
        // Final do mês atual
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case "3M":
        // Final do mês atual + 2 meses
        endDate = new Date(today.getFullYear(), today.getMonth() + 3, 0);
        break;
      case "6M":
        // Final do mês atual + 5 meses
        endDate = new Date(today.getFullYear(), today.getMonth() + 6, 0);
        break;
      case "1Y":
        // Final do mês atual + 11 meses
        endDate = new Date(today.getFullYear(), today.getMonth() + 12, 0);
        break;
      default:
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    }

    return calculateBusinessDays(startDate, endDate);
  };

  // Estado editável para dias úteis - inicializa com o cálculo automático
  const [diasUteis, setDiasUteis] = useState<number>(23);

  // Atualiza dias úteis quando o período muda
  React.useEffect(() => {
    const calculatedDays = getBusinessDaysForPeriod();
    setDiasUteis(calculatedDays);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectionPeriod]);

  // Estados para controles avançados
  const [cenarioType, setCenarioType] = useState<
    "pessimista" | "realista" | "otimista"
  >("realista");

  // Grupo de Índice de Passagem (visitas físicas à concessionária)
  const [numeroPassagens, setNumeroPassagens] = useState(150); // 150 passagens/mês é realista
  const [taxaConversaoPassagem, setTaxaConversaoPassagem] = useState(0.18); // 18% - Taxa de conversão de passagens

  // Grupo de Prospecção (contatos diretos dos vendedores)
  const [contatosPorVendedor, setContatosPorVendedor] = useState(50); // 50 contatos/vendedor/mês
  const [taxaConversaoProspeccao, setTaxaConversaoProspeccao] = useState(0.02); // 2% - Taxa de conversão de prospecção

  const [margemLucro, setMargemLucro] = useState(0.08); // 8% - Margem realista para concessionárias
  const [investimentoMarketing, setInvestimentoMarketing] = useState(0.02); // 2% - Mais realista
  const [sazonalidadeMultiplier, setSazonalidadeMultiplier] = useState(1.0);
  const [concorrenciaIntensidade, setConcorrenciaIntensidade] = useState(0.5); // Média
  const [tamanhoEquipe, setTamanhoEquipe] = useState(
    () => tamanhoEquipeReal || 4,
  ); // Usar valor real do backend ou fallback para 4
  const [prazoMedioFinanciamento, setPrazoMedioFinanciamento] = useState(60); // 60 meses é mais comum no Brasil
  const [jurosMedioFinanciamento, setJurosMedioFinanciamento] =
    useState(0.0189); // 1.89% ao mês (taxa típica CDC)
  const [percentualEntrada, setPercentualEntrada] = useState(0.25); // 25% - Mais realista
  const [custoOperacional, setCustoOperacional] = useState(0.05); // 5% - Mais realista

  // Atualizar tamanho da equipe quando dados reais carregarem
  useEffect(() => {
    if (tamanhoEquipeReal !== null && tamanhoEquipeReal > 0) {
      setTamanhoEquipe(tamanhoEquipeReal);
    }
  }, [tamanhoEquipeReal]);

  // Novas métricas críticas para concessionárias
  const [estoqueAtual, setEstoqueAtual] = useState(30); // 30 veículos em estoque
  const [comissaoVendedor, setComissaoVendedor] = useState(0.025); // 2.5% do valor da venda
  const [taxaTestDrive, setTaxaTestDrive] = useState(0.5); // 50% das passagens fazem test drive
  const [taxaAprovacaoCredito, setTaxaAprovacaoCredito] = useState(0.7); // 70% aprovação de crédito
  const [receitaPosVenda, setReceitaPosVenda] = useState(0.25); // 25% de receita adicional de pós-venda
  const [tempoMedioVenda, setTempoMedioVenda] = useState(45); // 45 dias para fechar venda

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

  const cenarioMultiplier = getCenarioMultiplier();
  const growthFactor = 1 + taxaConversao * 0.5; // Fator de crescimento baseado na conversão (leads)
  const teamEfficiency = Math.min(1 + (tamanhoEquipe - 3) * 0.1, 2.0); // Eficiência da equipe
  const marketingImpact = 1 + investimentoMarketing * 5; // Impacto do marketing
  const competitionFactor = 1 - concorrenciaIntensidade * 0.3; // Impacto da concorrência

  // Calcular leads proporcionalmente aos dias úteis (vendas online/digitais)
  const leadsPorDiaUtil = clientes / 22;
  const projectedLeads = Math.round(
    leadsPorDiaUtil * diasUteis * marketingImpact,
  );

  // Calcular passagens proporcionalmente aos dias úteis (visitas físicas)
  const passagensPorDiaUtil = numeroPassagens / 22;
  const projectedPassagens = Math.round(
    passagensPorDiaUtil * diasUteis * marketingImpact,
  );

  // Calcular prospecção (contatos diretos dos vendedores)
  // Total de contatos = número de vendedores × contatos por vendedor × dias úteis / 22
  const contatosTotaisMes = tamanhoEquipe * contatosPorVendedor;
  const contatosPorDiaUtil = contatosTotaisMes / 22;
  const projectedProspeccao = Math.round(contatosPorDiaUtil * diasUteis);

  // NOVA LÓGICA: Três grupos independentes
  // 1. Vendas via Leads (online/digital)
  const vendasLeads = projectedLeads * taxaConversao;

  // 2. Vendas via Passagens (visitas físicas à loja)
  // Com refinamento: Passagens → Test Drives → Vendas
  const testDrivesRealizados = projectedPassagens * taxaTestDrive;
  const vendasPassagens = projectedPassagens * taxaConversaoPassagem;

  // 3. Vendas via Prospecção (contatos diretos dos vendedores)
  const vendasProspeccao = projectedProspeccao * taxaConversaoProspeccao;

  // Total de vendas = soma dos três canais
  const vendasTotais = vendasLeads + vendasPassagens + vendasProspeccao;

  const baseProjection =
    vendasTotais *
    growthFactor *
    teamEfficiency *
    competitionFactor *
    sazonalidadeMultiplier;

  const projectedSales = Math.round(baseProjection * cenarioMultiplier);

  // NOVAS MÉTRICAS OPERACIONAIS DA CONCESSIONÁRIA

  // 1. Giro de Estoque (vendas / estoque) - ideal: 0.5 a 1.0 por mês
  const giroEstoqueMensal = projectedSales / estoqueAtual;
  const giroEstoqueAnual = giroEstoqueMensal * 12;

  // 2. Ajuste de vendas finais considerando aprovação de crédito
  const propostasFinanciamento = projectedSales * percentualFinanciamento;
  const vendasFinanciadasAprovadas =
    propostasFinanciamento * taxaAprovacaoCredito;
  const vendasFinanciadasPerdidas =
    propostasFinanciamento * (1 - taxaAprovacaoCredito);
  const vendasAVista = projectedSales * (1 - percentualFinanciamento);
  const vendasFinaisAjustadas = vendasFinanciadasAprovadas + vendasAVista;

  // Cálculos financeiros avançados
  const faturamentoBruto = vendasFinaisAjustadas * ticketMedio;

  // 3. Receita total incluindo pós-venda (serviços, peças, garantias)
  const receitaPosVendaTotal = faturamentoBruto * receitaPosVenda;
  const receitaTotal = faturamentoBruto + receitaPosVendaTotal;

  // 4. Custo de comissões dos vendedores
  const custoComissoes = faturamentoBruto * comissaoVendedor;

  const custoTotal = faturamentoBruto * custoOperacional;
  const investimentoMarketingTotal = faturamentoBruto * investimentoMarketing;

  // 5. CAC (Custo de Aquisição de Cliente) por canal
  const cacLeads =
    vendasLeads > 0 ? (investimentoMarketingTotal * 0.6) / vendasLeads : 0;
  const cacPassagens =
    vendasPassagens > 0
      ? (investimentoMarketingTotal * 0.3) / vendasPassagens
      : 0;
  const cacProspeccao =
    vendasProspeccao > 0
      ? (investimentoMarketingTotal * 0.1) / vendasProspeccao
      : 0;
  const cacMedio =
    vendasFinaisAjustadas > 0
      ? investimentoMarketingTotal / vendasFinaisAjustadas
      : 0;

  // Lucro líquido agora inclui comissões e receita pós-venda
  const lucroLiquido =
    receitaTotal - custoTotal - investimentoMarketingTotal - custoComissoes;
  const margemRealizada = lucroLiquido / receitaTotal;

  // Análise de financiamento (mantém cálculo de receita financeira)
  const vendasFinanciadas = vendasFinanciadasAprovadas;
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
      <div className="max-w-7xl mx-auto space-y-5 px-4">
        {/* Header compacto */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Análises Preditivas e Projeções
            </h1>
            <p className="text-xs text-gray-600">
              Insights baseados em dados para decisões estratégicas
            </p>
          </div>
        </div>

        {/* Métricas Principais em Destaque */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <HighlightMetric
            title="Vendas Projetadas"
            value={`${projectedSales} unidades`}
            subtitle={`Previsão para ${projectionPeriod} • Atual: ${currentSales} unidades`}
            icon={<Car className="w-6 h-6 text-white" />}
            trend={{
              value:
                currentSales > 0
                  ? ((projectedSales - currentSales) / currentSales) * 100
                  : 0,
              isPositive: projectedSales > currentSales,
            }}
            bgGradient="bg-gradient-to-br from-blue-600 via-blue-500 to-blue-700"
          />

          <HighlightMetric
            title="Faturamento Projetado"
            value={`R$ ${faturamentoBruto.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle={`Previsão para ${projectionPeriod} • Atual: R$ ${currentRevenue.toLocaleString(
              "pt-BR",
              { minimumFractionDigits: 2, maximumFractionDigits: 2 },
            )}`}
            icon={<DollarSign className="w-6 h-6 text-white" />}
            trend={{
              value:
                currentRevenue > 0
                  ? ((faturamentoBruto - currentRevenue) / currentRevenue) * 100
                  : 0,
              isPositive: faturamentoBruto > currentRevenue,
            }}
            bgGradient="bg-gradient-to-br from-green-600 via-green-500 to-emerald-700"
          />
        </div>

        {/* Métricas Secundárias - 5 Cards em Linha Única */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <HighlightMetric
            title="Lucro Líquido"
            value={`R$ ${lucroLiquido.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle={`Margem de ${Math.round(
              margemRealizada * 100,
            )}% após custos`}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            trend={{
              value: margemRealizada > 0.15 ? 15 : -5,
              isPositive: margemRealizada > 0.15,
            }}
            bgGradient="bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-700"
          />

          <HighlightMetric
            title="Leads (Online/Digital)"
            value={`${projectedLeads}`}
            subtitle={`Projeção de leads digitais para ${projectionPeriod}`}
            icon={<Users className="w-5 h-5 text-white" />}
            trend={{
              value:
                currentClients > 0
                  ? ((projectedLeads - currentClients) / currentClients) * 100
                  : 0,
              isPositive: projectedLeads > currentClients,
            }}
            bgGradient="bg-gradient-to-br from-purple-600 via-purple-500 to-violet-700"
          />

          <HighlightMetric
            title="Taxa Conversão (Leads)"
            value={`${(taxaConversao * 100).toFixed(2)}%`}
            subtitle={`Conversão de leads digitais em vendas`}
            icon={<Target className="w-5 h-5 text-white" />}
            trend={{
              value: taxaConversao > 0.06 ? 15 : taxaConversao >= 0.04 ? 8 : -5,
              isPositive: taxaConversao >= 0.04,
            }}
            bgGradient="bg-gradient-to-br from-orange-600 via-orange-500 to-red-600"
          />

          <HighlightMetric
            title="Índice de Passagem"
            value={`${(taxaConversaoPassagem * 100).toFixed(1)}%`}
            subtitle={`${projectedPassagens} visitas físicas (conversão ${(
              taxaConversaoPassagem * 100
            ).toFixed(1)}%)`}
            icon={<Car className="w-5 h-5 text-white" />}
            trend={{
              value:
                taxaConversaoPassagem > 0.25
                  ? 18
                  : taxaConversaoPassagem >= 0.15
                    ? 10
                    : -6,
              isPositive: taxaConversaoPassagem >= 0.15,
            }}
            bgGradient="bg-gradient-to-br from-indigo-600 via-indigo-500 to-blue-600"
          />

          <HighlightMetric
            title="Prospecção Ativa"
            value={`${projectedProspeccao}`}
            subtitle={`${tamanhoEquipe} vendedores × ${contatosPorVendedor} contatos (${(
              taxaConversaoProspeccao * 100
            ).toFixed(1)}% conversão)`}
            icon={<Users className="w-5 h-5 text-white" />}
            trend={{
              value:
                taxaConversaoProspeccao > 0.04
                  ? 12
                  : taxaConversaoProspeccao >= 0.02
                    ? 6
                    : -4,
              isPositive: taxaConversaoProspeccao >= 0.02,
            }}
            bgGradient="bg-gradient-to-br from-green-600 via-green-500 to-emerald-700"
          />
        </div>

        {/* Seletor de Período e Dias Úteis */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg shadow-sm p-4 border border-blue-100">
          <div className="flex flex-col gap-4">
            {/* Período de Projeção */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-gray-700">
                  Período de Projeção:
                </span>
              </div>

              <div className="flex items-center space-x-2 bg-white p-1 rounded-lg shadow-sm">
                {[
                  { key: "1M", label: "1 mês" },
                  { key: "3M", label: "3 meses" },
                  { key: "6M", label: "6 meses" },
                  { key: "1Y", label: "1 ano" },
                ].map((period) => (
                  <button
                    key={period.key}
                    onClick={() =>
                      setProjectionPeriod(
                        period.key as "1M" | "3M" | "6M" | "1Y",
                      )
                    }
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                      projectionPeriod === period.key
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {period.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dias Úteis */}
            <div className="bg-white rounded-lg p-3 border border-blue-200 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Dias Úteis no Período:
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={diasUteis}
                    onChange={(e) => setDiasUteis(Number(e.target.value))}
                    min="1"
                    max="365"
                    className="w-20 px-3 py-2 text-center text-xl font-bold text-blue-600 border-2 border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <span className="text-xs text-gray-500">dias úteis</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seletor de Cenário */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Tipo de Cenário
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
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
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    cenarioType === cenario.key
                      ? `border-${cenario.color}-500 bg-${cenario.color}-50`
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`font-medium text-sm ${
                      cenarioType === cenario.key
                        ? `text-${cenario.color}-700`
                        : "text-gray-700"
                    }`}
                  >
                    {cenario.label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {cenario.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Controles de Vendas Online/Digital (Leads) */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            📱 Parâmetros de Vendas Online/Digital (Leads)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Leads Mensais
                </label>
                <input
                  type="number"
                  min={0}
                  value={clientes}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setClientes(val);
                  }}
                  className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range"
                min={1}
                max={300}
                step={1}
                value={Math.min(clientes, 300)}
                onChange={(e) => setClientes(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                1-300 leads/mês (site, redes sociais, anúncios)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Taxa de Conversão (Leads)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={(taxaConversao * 100).toFixed(2)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setTaxaConversao(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.01}
                max={0.15}
                step={0.001}
                value={Math.min(taxaConversao, 0.15)}
                onChange={(e) => setTaxaConversao(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                1-15% (leads → vendas online)
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Vendas Físicas (Índice de Passagem) */}
        <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-blue-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            🏪 Índice de Passagem (Visitas Físicas à Loja)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Número de Passagens
                </label>
                <input
                  type="number"
                  min={0}
                  value={numeroPassagens}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setNumeroPassagens(val);
                  }}
                  className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range"
                min={1}
                max={500}
                step={1}
                value={Math.min(numeroPassagens, 500)}
                onChange={(e) => setNumeroPassagens(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                1-500 passagens/mês (visitas físicas à concessionária)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Taxa de Conversão (Passagem)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={(taxaConversaoPassagem * 100).toFixed(1)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0)
                        setTaxaConversaoPassagem(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={Math.min(taxaConversaoPassagem, 1)}
                onChange={(e) =>
                  setTaxaConversaoPassagem(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                0-100% (visitas → vendas, típico: 15-25%)
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Prospecção (Contatos Diretos) */}
        <div className="bg-white rounded-lg shadow-sm p-5 border-2 border-blue-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            👥 Prospecção Ativa (Contatos Diretos dos Vendedores)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Contatos por Vendedor
                </label>
                <input
                  type="number"
                  min={0}
                  value={contatosPorVendedor}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setContatosPorVendedor(val);
                  }}
                  className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range"
                min={1}
                max={200}
                step={1}
                value={Math.min(contatosPorVendedor, 200)}
                onChange={(e) => setContatosPorVendedor(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                1-200 contatos/vendedor/mês ({tamanhoEquipe} vendedores ={" "}
                {contatosTotaisMes} contatos totais)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Taxa de Conversão (Prospecção)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={(taxaConversaoProspeccao * 100).toFixed(1)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0)
                        setTaxaConversaoProspeccao(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0}
                max={0.1}
                step={0.001}
                value={Math.min(taxaConversaoProspeccao, 0.1)}
                onChange={(e) =>
                  setTaxaConversaoProspeccao(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                0-10% (contatos → vendas, típico: 2-5%)
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Marketing */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Parâmetros de Marketing e Mercado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Investimento Marketing
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={(investimentoMarketing * 100).toFixed(2)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0)
                        setInvestimentoMarketing(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.005}
                max={0.05}
                step={0.0001}
                value={Math.min(investimentoMarketing, 0.05)}
                onChange={(e) =>
                  setInvestimentoMarketing(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                0.5-5% do faturamento (típico: 1.5-2.5%)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Tamanho da Equipe
                </label>
                <input
                  type="number"
                  min={0}
                  value={tamanhoEquipe}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setTamanhoEquipe(val);
                  }}
                  className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <input
                type="range"
                min={1}
                max={20}
                step={1}
                value={Math.min(tamanhoEquipe, 20)}
                onChange={(e) => setTamanhoEquipe(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                1-20 vendedores (pequena: 2-5, média: 6-10)
              </p>
            </div>
          </div>
        </div>

        {/* Métricas Operacionais da Concessionária */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Métricas Operacionais da Concessionária
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Estoque Atual */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Estoque Atual
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    value={estoqueAtual}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val) && val >= 0) setEstoqueAtual(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">un</span>
                </div>
              </div>
              <input
                type="range"
                min={5}
                max={100}
                step={1}
                value={Math.min(estoqueAtual, 100)}
                onChange={(e) => setEstoqueAtual(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                5-100 veículos (pequena: 20-40, média: 50-80)
              </p>
            </div>

            {/* Comissão Vendedor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Comissão Vendedor
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={(comissaoVendedor * 100).toFixed(1)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setComissaoVendedor(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.01}
                max={0.05}
                step={0.001}
                value={Math.min(comissaoVendedor, 0.05)}
                onChange={(e) => setComissaoVendedor(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                1-5% da venda (típico: 2-3%, R$ 1.700-2.550)
              </p>
            </div>

            {/* Taxa Test Drive */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Taxa de Test Drive
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={(taxaTestDrive * 100).toFixed(0)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setTaxaTestDrive(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.2}
                max={0.8}
                step={0.01}
                value={Math.min(taxaTestDrive, 0.8)}
                onChange={(e) => setTaxaTestDrive(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                20-80% das passagens (típico: 40-60%)
              </p>
            </div>

            {/* Taxa Aprovação Crédito */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Taxa Aprovação Crédito
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={(taxaAprovacaoCredito * 100).toFixed(0)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setTaxaAprovacaoCredito(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.5}
                max={0.9}
                step={0.01}
                value={Math.min(taxaAprovacaoCredito, 0.9)}
                onChange={(e) =>
                  setTaxaAprovacaoCredito(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                50-90% das propostas (típico Brasil: 65-75%)
              </p>
            </div>

            {/* Receita Pós-Venda */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Receita Pós-Venda
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={1}
                    value={(receitaPosVenda * 100).toFixed(0)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setReceitaPosVenda(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.4}
                step={0.01}
                value={Math.min(receitaPosVenda, 0.4)}
                onChange={(e) => setReceitaPosVenda(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                10-40% adicional (serviços, peças, garantias)
              </p>
            </div>

            {/* Tempo Médio de Venda */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Tempo Médio de Venda
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    value={tempoMedioVenda}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val) && val >= 0) setTempoMedioVenda(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">dias</span>
                </div>
              </div>
              <input
                type="range"
                min={15}
                max={120}
                step={5}
                value={Math.min(tempoMedioVenda, 120)}
                onChange={(e) => setTempoMedioVenda(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                15-120 dias (rápido: 30, médio: 45-60, longo: 90+)
              </p>
            </div>
          </div>
        </div>

        {/* Controles Financeiros */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Parâmetros Financeiros
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Ticket Médio
                </label>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500">R$</span>
                  <input
                    type="text"
                    value={ticketMedio.toLocaleString("pt-BR")}
                    onChange={(e) => {
                      // Remove tudo exceto números
                      const val = e.target.value.replace(/\D/g, "");
                      const numVal = Number(val);
                      if (!isNaN(numVal) && val !== "") {
                        setTicketMedio(numVal);
                      } else if (val === "") {
                        setTicketMedio(0);
                      }
                    }}
                    placeholder="112.500"
                    className="w-28 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <input
                type="range"
                min={40000}
                max={250000}
                step={500}
                value={Math.min(ticketMedio, 250000)}
                onChange={(e) => setTicketMedio(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                R$ 40k-250k (popular: 50-90k, premium: 120k+)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Margem de Lucro
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={(margemLucro * 100).toFixed(2)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setMargemLucro(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.03}
                max={0.15}
                step={0.0001}
                value={Math.min(margemLucro, 0.15)}
                onChange={(e) => setMargemLucro(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                3-15% (típico: 5-10%, premium: 10-15%)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Custo Operacional
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={(custoOperacional * 100).toFixed(2)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setCustoOperacional(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.02}
                max={0.08}
                step={0.0001}
                value={Math.min(custoOperacional, 0.08)}
                onChange={(e) => setCustoOperacional(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                2-8% do faturamento (típico: 4-6%)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  % Financiado
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={(percentualFinanciamento * 100).toFixed(1)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0)
                        setPercentualFinanciamento(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.5}
                max={0.95}
                step={0.001}
                value={Math.min(percentualFinanciamento, 0.95)}
                onChange={(e) =>
                  setPercentualFinanciamento(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                50-95% (Brasil: 70-85% das vendas são financiadas)
              </p>
            </div>
          </div>
        </div>

        {/* Controles de Financiamento Detalhados */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Configurações de Financiamento
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Prazo Médio
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    value={prazoMedioFinanciamento}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val) && val >= 0)
                        setPrazoMedioFinanciamento(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-500">meses</span>
                </div>
              </div>
              <input
                type="range"
                min={24}
                max={84}
                step={1}
                value={Math.min(prazoMedioFinanciamento, 84)}
                onChange={(e) =>
                  setPrazoMedioFinanciamento(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                24-84 meses (comum: 48-60 meses)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Juros Mensais
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.01}
                    value={(jurosMedioFinanciamento * 100).toFixed(2)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0)
                        setJurosMedioFinanciamento(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.0099}
                max={0.0299}
                step={0.0001}
                value={Math.min(jurosMedioFinanciamento, 0.0299)}
                onChange={(e) =>
                  setJurosMedioFinanciamento(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                0.99-2.99% a.m. (CDC típico: 1.5-2.2%)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  % Entrada
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={(percentualEntrada * 100).toFixed(1)}
                    onChange={(e) => {
                      const val = Number(e.target.value) / 100;
                      if (!isNaN(val) && val >= 0) setPercentualEntrada(val);
                    }}
                    className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.5}
                step={0.01}
                value={Math.min(percentualEntrada, 0.5)}
                onChange={(e) => setPercentualEntrada(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">10-50% (comum: 20-30%)</p>
            </div>
          </div>

          {/* Card de Receita Financeira Calculada */}
          <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-600 mb-1">
                  💰 Receita com Juros de Financiamento
                </div>
                <div className="text-2xl font-bold text-green-700">
                  R${" "}
                  {receitaFinanciamento.toLocaleString("pt-BR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  {Math.round(vendasFinanciadas)} vendas financiadas ×{" "}
                  {prazoMedioFinanciamento} meses ×{" "}
                  {(jurosMedioFinanciamento * 100).toFixed(2)}% a.m.
                </div>
              </div>
              <div className="ml-4 text-right">
                <div className="text-xs text-gray-500">Entrada Média</div>
                <div className="text-lg font-bold text-blue-600">
                  {(percentualEntrada * 100).toFixed(0)}%
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  R${" "}
                  {(ticketMedio * percentualEntrada).toLocaleString("pt-BR", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Mercado */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h2 className="text-base font-semibold text-gray-900 mb-3">
            Fatores de Mercado
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Intensidade da Concorrência
                </label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={(concorrenciaIntensidade * 100).toFixed(0)}
                  onChange={(e) => {
                    const val = Number(e.target.value) / 100;
                    if (!isNaN(val) && val >= 0)
                      setConcorrenciaIntensidade(val);
                  }}
                  className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500 ml-1">%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.01}
                value={Math.min(concorrenciaIntensidade, 0.9)}
                onChange={(e) =>
                  setConcorrenciaIntensidade(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                {concorrenciaIntensidade < 0.35
                  ? "Baixa"
                  : concorrenciaIntensidade < 0.65
                    ? "Média"
                    : "Alta"}
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Fator Sazonal
                </label>
                <input
                  type="number"
                  min={0}
                  step={0.01}
                  value={sazonalidadeMultiplier.toFixed(2)}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val) && val >= 0) setSazonalidadeMultiplier(val);
                  }}
                  className="w-20 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500 ml-1">x</span>
              </div>
              <input
                type="range"
                min={0.6}
                max={1.5}
                step={0.01}
                value={Math.min(sazonalidadeMultiplier, 1.5)}
                onChange={(e) =>
                  setSazonalidadeMultiplier(Number(e.target.value))
                }
                className="w-full accent-blue-600"
              />
              <p className="text-xs text-gray-500">
                {sazonalidadeMultiplier < 0.85
                  ? "Baixa Temporada"
                  : sazonalidadeMultiplier <= 1.15
                    ? "Normal"
                    : "Alta Temporada"}
              </p>
            </div>
          </div>
        </div>

        {/* Métricas Operacionais da Concessionária - Cards de Destaque */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <HighlightMetric
            title="Giro de Estoque"
            value={`${giroEstoqueMensal.toFixed(2)}x/mês`}
            subtitle={`${giroEstoqueAnual.toFixed(
              1,
            )}x/ano • Estoque: ${estoqueAtual} un • ${
              giroEstoqueMensal >= 0.5 ? "✅ Excelente" : "⚠️ Baixo"
            }`}
            icon={<Car className="w-5 h-5 text-white" />}
            trend={{
              value:
                giroEstoqueMensal >= 0.5
                  ? 20
                  : giroEstoqueMensal >= 0.3
                    ? 5
                    : -10,
              isPositive: giroEstoqueMensal >= 0.5,
            }}
            bgGradient="bg-gradient-to-br from-cyan-600 via-cyan-500 to-blue-600"
          />

          <HighlightMetric
            title="CAC Médio"
            value={`R$ ${cacMedio.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle={`Custo aquisição por cliente • Investimento: R$ ${investimentoMarketingTotal.toLocaleString(
              "pt-BR",
              { minimumFractionDigits: 0, maximumFractionDigits: 0 },
            )}`}
            icon={<DollarSign className="w-5 h-5 text-white" />}
            trend={{
              value: cacMedio < ticketMedio * 0.03 ? 15 : -8,
              isPositive: cacMedio < ticketMedio * 0.03,
            }}
            bgGradient="bg-gradient-to-br from-amber-600 via-amber-500 to-orange-600"
          />

          <HighlightMetric
            title="Comissões Totais"
            value={`R$ ${custoComissoes.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle={`${(comissaoVendedor * 100).toFixed(
              1,
            )}% sobre vendas • R$ ${(
              custoComissoes / vendasFinaisAjustadas || 0
            ).toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })} por venda`}
            icon={<Users className="w-5 h-5 text-white" />}
            trend={{
              value: comissaoVendedor <= 0.03 ? 8 : -5,
              isPositive: comissaoVendedor <= 0.03,
            }}
            bgGradient="bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600"
          />

          <HighlightMetric
            title="Receita Total"
            value={`R$ ${receitaTotal.toLocaleString("pt-BR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}`}
            subtitle={`Vendas + Pós-Venda (${(receitaPosVenda * 100).toFixed(
              0,
            )}%) • Adicional: R$ ${receitaPosVendaTotal.toLocaleString(
              "pt-BR",
              { minimumFractionDigits: 0, maximumFractionDigits: 0 },
            )}`}
            icon={<TrendingUp className="w-5 h-5 text-white" />}
            trend={{
              value: receitaPosVenda >= 0.25 ? 18 : 8,
              isPositive: receitaPosVenda >= 0.2,
            }}
            bgGradient="bg-gradient-to-br from-teal-600 via-teal-500 to-green-600"
          />
        </div>

        {/* Funil de Conversão Detalhado */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            Funil de Conversão Detalhado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {projectedPassagens}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Passagens na Loja
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-400">→</div>
                <div className="text-xs text-blue-600 font-medium">
                  {(taxaTestDrive * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(testDrivesRealizados)}
              </div>
              <div className="text-xs text-gray-600 mt-1">Test Drives</div>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-400">→</div>
                <div className="text-xs text-green-600 font-medium">
                  {(taxaConversaoPassagem * 100).toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(vendasPassagens)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Vendas Realizadas
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-700">
                {Math.round(propostasFinanciamento)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Propostas de Financiamento
              </div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-700">
                {Math.round(vendasFinanciadasAprovadas)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Crédito Aprovado ({(taxaAprovacaoCredito * 100).toFixed(0)}%)
              </div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg">
              <div className="text-lg font-bold text-red-700">
                {Math.round(vendasFinanciadasPerdidas)}
              </div>
              <div className="text-xs text-gray-600 mt-1">
                Vendas Perdidas (Crédito Negado)
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Análise:</span> De{" "}
              <span className="font-bold text-blue-600">
                {projectedPassagens} passagens
              </span>
              , temos{" "}
              <span className="font-bold text-purple-600">
                {Math.round(testDrivesRealizados)} test drives
              </span>{" "}
              ({(taxaTestDrive * 100).toFixed(0)}%), resultando em{" "}
              <span className="font-bold text-green-600">
                {Math.round(vendasPassagens)} vendas
              </span>
              . No financiamento,{" "}
              <span className="font-bold text-red-600">
                {Math.round(vendasFinanciadasPerdidas)} vendas são perdidas
              </span>{" "}
              por negativa de crédito.
            </div>
          </div>
        </div>

        {/* CAC por Canal de Vendas */}
        <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            CAC (Custo de Aquisição) por Canal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="text-xs text-gray-600 mb-1">Leads (Online)</div>
              <div className="text-2xl font-bold text-blue-600">
                R${" "}
                {cacLeads.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round(vendasLeads)} vendas • 60% do budget
              </div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="text-xs text-gray-600 mb-1">
                Passagens (Físico)
              </div>
              <div className="text-2xl font-bold text-purple-600">
                R${" "}
                {cacPassagens.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round(vendasPassagens)} vendas • 30% do budget
              </div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg border-2 border-green-200">
              <div className="text-xs text-gray-600 mb-1">
                Prospecção (Ativo)
              </div>
              <div className="text-2xl font-bold text-green-600">
                R${" "}
                {cacProspeccao.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round(vendasProspeccao)} vendas • 10% do budget
              </div>
            </div>

            <div className="text-center p-4 bg-amber-50 rounded-lg border-2 border-amber-300">
              <div className="text-xs text-gray-600 mb-1">Média Geral</div>
              <div className="text-2xl font-bold text-amber-700">
                R${" "}
                {cacMedio.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
              <div className="text-xs text-gray-500 mt-2">
                {Math.round(vendasFinaisAjustadas)} vendas totais
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">Análise de Eficiência:</span> O
              canal <span className="font-bold text-green-600">Prospecção</span>{" "}
              tem o menor CAC (R$ {cacProspeccao.toFixed(2)}), seguido por{" "}
              <span className="font-bold text-purple-600">Passagens</span> (R${" "}
              {cacPassagens.toFixed(2)}) e{" "}
              <span className="font-bold text-blue-600">Leads</span> (R${" "}
              {cacLeads.toFixed(2)}). O ideal é manter CAC abaixo de 3-5% do
              ticket médio (R$ {(ticketMedio * 0.03).toLocaleString("pt-BR")}).
            </div>
          </div>
        </div>

        {/* Alertas e Recomendações */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Alertas Estratégicos
            </h3>

            <BusinessAlert
              type={
                taxaConversao < 0.03
                  ? "warning"
                  : taxaConversao > 0.08
                    ? "success"
                    : "info"
              }
              title={
                taxaConversao < 0.03
                  ? "Taxa de Conversão Baixa"
                  : taxaConversao > 0.08
                    ? "Taxa de Conversão Excelente"
                    : "Taxa de Conversão Normal"
              }
              message={
                taxaConversao < 0.03
                  ? "Sua taxa está abaixo da média do setor (3-8% para concessionárias). Considere melhorar o processo de vendas e qualificação de leads."
                  : taxaConversao > 0.08
                    ? "Sua taxa de conversão está acima da média do setor automotivo. Continue com as estratégias atuais!"
                    : "Sua taxa de conversão está dentro do padrão esperado para concessionárias (3-8%)."
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                ROI Marketing
              </h3>
              <TrendingUp className="w-5 h-5 text-green-600" />
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
                        (lucroLiquido / investimentoMarketingTotal) * 100,
                      )
                    : 0}
                  %
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Análise de Financiamento
              </h3>
              <Clock className="w-5 h-5 text-blue-600" />
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

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Eficiência da Equipe
              </h3>
              <BarChart3 className="w-5 h-5 text-purple-600" />
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

          <div className="bg-white rounded-lg shadow-sm p-5 border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-semibold text-gray-900">
                Custos e Margens
              </h3>
              <DollarSign className="w-5 h-5 text-red-600" />
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

        {/* Card Destacado - Índice de Passagem */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg shadow-md p-6 border-2 border-indigo-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-600 p-3 rounded-lg">
                <Car className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Resumo de Vendas por Canal
                </h3>
                <p className="text-sm text-gray-600">
                  Online/Digital (Leads) + Visitas Físicas (Passagens)
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-indigo-600">
                {projectedSales}
              </p>
              <p className="text-sm text-gray-600 mt-1">vendas totais</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
            <div className="bg-white rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-gray-600 mb-1">Leads (Online)</p>
              <p className="text-2xl font-bold text-blue-600">
                {projectedLeads}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Conv: {(taxaConversao * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-indigo-100">
              <p className="text-xs text-gray-600 mb-1">Passagens (Físicas)</p>
              <p className="text-2xl font-bold text-indigo-600">
                {projectedPassagens}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Conv: {(taxaConversaoPassagem * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-green-100">
              <p className="text-xs text-gray-600 mb-1">Vendas via Leads</p>
              <p className="text-2xl font-bold text-green-600">
                {Math.round(vendasLeads)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {projectedSales > 0
                  ? ((vendasLeads / projectedSales) * 100).toFixed(0)
                  : 0}
                % do total
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-purple-100">
              <p className="text-xs text-gray-600 mb-1">Vendas via Passagens</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round(vendasPassagens)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {projectedSales > 0
                  ? ((vendasPassagens / projectedSales) * 100).toFixed(0)
                  : 0}
                % do total
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-emerald-100">
              <p className="text-xs text-gray-600 mb-1">
                Prospecção (Contatos)
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {projectedProspeccao}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Conv: {(taxaConversaoProspeccao * 100).toFixed(1)}%
              </p>
            </div>
            <div className="bg-white rounded-lg p-4 border border-teal-100">
              <p className="text-xs text-gray-600 mb-1">
                Vendas via Prospecção
              </p>
              <p className="text-2xl font-bold text-teal-600">
                {Math.round(vendasProspeccao)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {projectedSales > 0
                  ? ((vendasProspeccao / projectedSales) * 100).toFixed(0)
                  : 0}
                % do total
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-indigo-100 rounded-lg">
            <p className="text-sm text-indigo-900">
              <strong>💡 Como funciona:</strong>{" "}
              <strong>Leads (Online):</strong> {projectedLeads} leads ×{" "}
              {(taxaConversao * 100).toFixed(1)}% = {Math.round(vendasLeads)}{" "}
              vendas.
              <strong> Passagens (Físicas):</strong> {projectedPassagens}{" "}
              passagens × {(taxaConversaoPassagem * 100).toFixed(1)}% ={" "}
              {Math.round(vendasPassagens)} vendas.
              <strong> Prospecção:</strong> {tamanhoEquipe} vendedores ×{" "}
              {contatosPorVendedor} contatos = {projectedProspeccao} contatos ×{" "}
              {(taxaConversaoProspeccao * 100).toFixed(1)}% ={" "}
              {Math.round(vendasProspeccao)} vendas.
              <strong> Total:</strong> {Math.round(vendasLeads)} +{" "}
              {Math.round(vendasPassagens)} + {Math.round(vendasProspeccao)} ×
              fatores = {projectedSales} vendas finais.
            </p>
          </div>
        </div>

        {/* Resumo Executivo */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-sm p-5 border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-3">
            📊 Resumo Executivo - Cenário{" "}
            {cenarioType.charAt(0).toUpperCase() + cenarioType.slice(1)}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                R${" "}
                {faturamentoBruto.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              <p className="text-sm text-gray-600">
                Com ticket médio de R${" "}
                {ticketMedio.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-700 mb-2">
                Lucro Líquido
              </h4>
              <p className="text-2xl font-bold text-purple-600">
                R${" "}
                {lucroLiquido.toLocaleString("pt-BR", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
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
