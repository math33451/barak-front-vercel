"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  BarChart3,
  Car,
  ShoppingBag,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import React, { useState } from "react";

// Dados mockados para o relatório
const resumo = {
  faturamento: 1856400,
  vendas: 187,
  clientes: 94,
  estoque: 212,
  financiamentos: 38,
  ticketMedio: 99380,
  crescimento: 12.5,
};

const vendasPorMes = [
  { mes: "Jan", valor: 120000 },
  { mes: "Fev", valor: 135000 },
  { mes: "Mar", valor: 142000 },
  { mes: "Abr", valor: 155000 },
  { mes: "Mai", valor: 168000 },
  { mes: "Jun", valor: 172000 },
  { mes: "Jul", valor: 180000 },
  { mes: "Ago", valor: 190000 },
  { mes: "Set", valor: 200000 },
  { mes: "Out", valor: 210000 },
  { mes: "Nov", valor: 220000 },
  { mes: "Dez", valor: 230000 },
];

const topVendedores = [
  { nome: "Ana Silva", vendas: 38 },
  { nome: "Carlos Mendes", vendas: 32 },
  { nome: "Júlia Santos", vendas: 28 },
  { nome: "Rafael Oliveira", vendas: 24 },
  { nome: "Bianca Costa", vendas: 18 },
];

const distribuicaoMarcas = [
  { marca: "Toyota", qtd: 28 },
  { marca: "Honda", qtd: 24 },
  { marca: "Volkswagen", qtd: 16 },
  { marca: "Jeep", qtd: 14 },
  { marca: "Yamaha", qtd: 12 },
  { marca: "Kawasaki", qtd: 10 },
  { marca: "BMW", qtd: 8 },
  { marca: "Outros", qtd: 18 },
];

const financiamentos = [
  { banco: "Banco do Brasil", qtd: 12 },
  { banco: "Itaú", qtd: 10 },
  { banco: "Santander", qtd: 8 },
  { banco: "Bradesco", qtd: 5 },
  { banco: "Outros", qtd: 3 },
];

// Função para obter o nome do mês atual em português
function getMesAtual() {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  return meses[now.getMonth()];
}

// Função para obter os meses até o mês atual do ano
function getMesesAteAtual() {
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
  const now = new Date();
  return meses.slice(0, now.getMonth() + 1);
}

export default function Relatorios() {
  // Sliders independentes para simulação
  const [clientes, setClientes] = useState(120);
  const [taxaConversao, setTaxaConversao] = useState(0.6); // 60%
  const [ticketMedio, setTicketMedio] = useState(resumo.ticketMedio);
  const [percentualFinanciamento, setPercentualFinanciamento] = useState(0.22); // 22%
  const [tooltip, setTooltip] = useState<{ x: number; y: number; value: number; mes: string } | null>(null);

  // Cálculos dinâmicos
  const vendas = Math.round(clientes * taxaConversao);
  const faturamento = vendas * ticketMedio;
  const faturamentoFinanciado = Math.round(faturamento * percentualFinanciamento);
  const faturamentoAVista = faturamento - faturamentoFinanciado;
  const financiamentosPrevistos = Math.round(vendas * percentualFinanciamento);
  const estoque = Math.max(resumo.estoque - (vendas - resumo.vendas), 0);
  const crescimento = ((vendas - resumo.vendas) / (resumo.vendas || 1)) * 100 + resumo.crescimento;

  // Novos indicadores para preencher os cards
  const ticketMedioReal = vendas > 0 ? Math.round(faturamento / vendas) : 0;
  const conversaoReal = clientes > 0 ? (vendas / clientes) * 100 : 0;

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
            label="Faturamento"
            value={`R$ ${faturamento.toLocaleString('pt-BR')}`}
            destaque
          />
          <ResumoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Fat. Financiado"
            value={`R$ ${faturamentoFinanciado.toLocaleString('pt-BR')}`}
          />
          <ResumoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Fat. à Vista"
            value={`R$ ${faturamentoAVista.toLocaleString('pt-BR')}`}
          />
          <ResumoCard
            icon={<ShoppingBag className="h-5 w-5" />}
            label="Vendas"
            value={vendas}
          />
          <ResumoCard
            icon={<Users className="h-5 w-5" />}
            label="Clientes"
            value={clientes}
          />
          <ResumoCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Crescimento"
            value={`${crescimento.toFixed(1)}%`}
          />
          <ResumoCard
            icon={<Car className="h-5 w-5" />}
            label="Estoque"
            value={estoque}
          />
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Ticket Médio"
            value={`R$ ${ticketMedioReal.toLocaleString('pt-BR')}`}
          />
          <ResumoCard
            icon={<CreditCard className="h-5 w-5" />}
            label="Financiamentos"
            value={financiamentosPrevistos}
          />
          <ResumoCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Conversão Real"
            value={`${conversaoReal.toFixed(1)}%`}
          />
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Meta de Vendas"
            value={200}
          />
          <ResumoCard
            icon={<BarChart3 className="h-5 w-5" />}
            label="Meta de Faturamento"
            value={`R$ ${(200 * ticketMedio).toLocaleString('pt-BR')}`}
          />
        </section>

        {/* Gráfico de vendas por mês - layout aprimorado com tooltip customizado */}
        <section className="bg-white rounded-lg shadow p-6 border border-gray-100">
          <h3 className="text-base font-bold mb-4 text-[color:var(--heading)]">
            Vendas por Mês
          </h3>
          <div className="w-full h-56 flex flex-col items-center relative">
            <svg width="100%" height="180" viewBox="0 0 600 180">
              {/* Eixos e labels de valor */}
              <text x="10" y="30" fontSize="13" fill="#334155" fontWeight="bold">R$ 230k</text>
              <text x="10" y="170" fontSize="13" fill="#334155" fontWeight="bold">0</text>
              {/* Barras */}
              {(() => {
                const mesesValidos = getMesesAteAtual();
                const mesesFiltrados = vendasPorMes.filter(v => mesesValidos.includes(v.mes));
                const mesAtual = getMesAtual();
                return mesesFiltrados.map((v, i) => (
                  <g key={v.mes}>
                    <rect
                      x={i * 44 + 50}
                      y={170 - v.valor / 1800}
                      width={28}
                      height={v.valor / 1800}
                      fill={v.mes === mesAtual ? "#0284c7" : "#38bdf8"}
                      rx={6}
                      style={{ cursor: 'pointer', filter: v.mes === mesAtual ? 'drop-shadow(0 2px 6px #0284c7aa)' : undefined }}
                      onMouseMove={e => {
                        const svgRect = (e.target as SVGRectElement).ownerSVGElement?.getBoundingClientRect();
                        setTooltip({
                          x: (svgRect ? e.clientX - svgRect.left : 0),
                          y: (svgRect ? e.clientY - svgRect.top : 0),
                          value: v.valor,
                          mes: v.mes
                        });
                      }}
                      onMouseLeave={() => setTooltip(null)}
                    />
                    <text
                      x={i * 44 + 64}
                      y={165}
                      fontSize="14"
                      fill={v.mes === mesAtual ? "#0284c7" : "#334155"}
                      fontWeight={v.mes === mesAtual ? "bold" : "normal"}
                      textAnchor="middle"
                    >
                      {v.mes}
                    </text>
                  </g>
                ));
              })()}
            </svg>
            {tooltip && (
              <div
                style={{
                  position: 'absolute',
                  left: tooltip.x,
                  top: tooltip.y - 38,
                  background: '#fff',
                  color: '#0f172a',
                  padding: '6px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  boxShadow: '0 2px 8px 0 rgba(30,41,59,0.10)',
                  border: '1px solid #e2e8f0',
                  pointerEvents: 'none',
                  whiteSpace: 'nowrap',
                  zIndex: 10
                }}
              >
                <div className="font-semibold text-sky-700 text-sm mb-0.5">{tooltip.mes}</div>
                <div className="font-bold text-base">R$ {tooltip.value.toLocaleString('pt-BR')}</div>
              </div>
            )}
            <span className="text-xs text-gray-500 mt-2">
              Passe o mouse sobre as barras para ver o valor do mês. O mês atual está destacado.
            </span>
          </div>
        </section>

        {/* Top vendedores e Distribuição de marcas */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-base font-bold mb-3 text-[color:var(--heading)]">
              Top 5 Vendedores
            </h3>
            <ol className="space-y-1">
              {topVendedores.map((v, i) => (
                <li key={v.nome} className="flex items-center gap-2">
                  <span className="w-5 h-5 flex items-center justify-center rounded-full bg-sky-100 text-sky-700 font-bold text-xs">
                    {i + 1}
                  </span>
                  <span className="font-medium text-[color:var(--heading)] text-sm">
                    {v.nome}
                  </span>
                  <span className="ml-auto text-[color:var(--muted)] text-xs">
                    {v.vendas} vendas
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-base font-bold mb-3 text-[color:var(--heading)]">
              Distribuição de Marcas
            </h3>
            <div className="flex flex-wrap gap-2">
              {distribuicaoMarcas.map((m) => (
                <div key={m.marca} className="flex flex-col items-center w-16">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-base mb-1">
                    {m.marca[0]}
                  </div>
                  <span className="font-medium text-[color:var(--heading)] text-xs">
                    {m.marca}
                  </span>
                  <span className="text-[10px] text-[color:var(--muted)]">
                    {m.qtd} vendas
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Financiamentos, Ticket médio e crescimento */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
            <h3 className="text-base font-bold mb-3 text-[color:var(--heading)]">
              Financiamentos por Banco
            </h3>
            <div className="flex flex-wrap gap-2">
              {financiamentos.map((f) => (
                <div key={f.banco} className="flex flex-col items-center w-20">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-base mb-1">
                    {f.banco[0]}
                  </div>
                  <span className="font-medium text-[color:var(--heading)] text-xs">
                    {f.banco}
                  </span>
                  <span className="text-[10px] text-[color:var(--muted)]">
                    {Math.round(financiamentosPrevistos * (f.qtd / resumo.financiamentos))} contratos
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col items-center justify-center">
            <h3 className="text-base font-bold mb-1 text-[color:var(--heading)]">
              Ticket Médio
            </h3>
            <span className="text-xl font-bold text-[color:var(--primary]">
              R$ {resumo.ticketMedio.toLocaleString("pt-BR")}
            </span>
            <span className="text-xs text-[color:var(--muted)] mt-1">
              por venda
            </span>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100 flex flex-col items-center justify-center">
            <h3 className="text-base font-bold mb-1 text-[color:var(--heading)]">
              Crescimento no Ano
            </h3>
            <span className="text-xl font-bold text-green-600">
              +{resumo.crescimento}%
            </span>
            <span className="text-xs text-[color:var(--muted)] mt-1">
              em relação ao ano anterior
            </span>
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
