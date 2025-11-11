import type {
  VendaFinalizada,
  PropostaCompleta,
  MetricasVendasReais,
} from "@/types";

/**
 * Serviço agregador que calcula métricas a partir dos dados reais do backend
 * Substitui valores mockados por cálculos baseados em vendas finalizadas
 */

// Calcula métricas agregadas a partir de vendas finalizadas
export const calcularMetricasVendas = (
  vendas: VendaFinalizada[]
): MetricasVendasReais => {
  if (!vendas || vendas.length === 0) {
    return {
      ticketMedio: 0,
      faturamentoTotal: 0,
      quantidadeVendas: 0,
      percentualFinanciamento: 0,
      quantidadeFinanciadas: 0,
      quantidadeAVista: 0,
    };
  }

  const quantidadeVendas = vendas.length;
  const faturamentoTotal = vendas.reduce(
    (sum, venda) => sum + venda.valorPropostaReal,
    0
  );
  const ticketMedio = faturamentoTotal / quantidadeVendas;

  return {
    ticketMedio,
    faturamentoTotal,
    quantidadeVendas,
    percentualFinanciamento: 0, // Precisa de PropostaCompleta para calcular
    quantidadeFinanciadas: 0,
    quantidadeAVista: 0,
  };
};

// Calcula métricas completas incluindo financiamento
export const calcularMetricasCompletas = (
  propostas: PropostaCompleta[]
): MetricasVendasReais => {
  if (!propostas || propostas.length === 0) {
    return {
      ticketMedio: 0,
      faturamentoTotal: 0,
      quantidadeVendas: 0,
      percentualFinanciamento: 0,
      quantidadeFinanciadas: 0,
      quantidadeAVista: 0,
    };
  }

  const propostasFinalizadas = propostas.filter(
    (p) => p.status === "FINALIZADA"
  );
  const quantidadeVendas = propostasFinalizadas.length;

  const faturamentoTotal = propostasFinalizadas.reduce(
    (sum, proposta) => sum + proposta.valorPropostaReal,
    0
  );

  const ticketMedio = faturamentoTotal / quantidadeVendas;

  const quantidadeFinanciadas = propostasFinalizadas.filter(
    (p) => p.isFinanciado === "SIM"
  ).length;

  const quantidadeAVista = quantidadeVendas - quantidadeFinanciadas;

  const percentualFinanciamento =
    quantidadeVendas > 0 ? quantidadeFinanciadas / quantidadeVendas : 0;

  return {
    ticketMedio,
    faturamentoTotal,
    quantidadeVendas,
    percentualFinanciamento,
    quantidadeFinanciadas,
    quantidadeAVista,
  };
};

// Calcula faturamento por banco
export const calcularFaturamentoPorBanco = (
  propostas: PropostaCompleta[]
): Record<number, { total: number; quantidade: number }> => {
  const resultado: Record<number, { total: number; quantidade: number }> = {};

  propostas
    .filter((p) => p.status === "FINALIZADA" && p.isFinanciado === "SIM")
    .forEach((proposta) => {
      const bancoId = proposta.idBanco;

      if (!resultado[bancoId]) {
        resultado[bancoId] = { total: 0, quantidade: 0 };
      }

      resultado[bancoId].total += proposta.valorPropostaReal;
      resultado[bancoId].quantidade += 1;
    });

  return resultado;
};

// Calcula vendas por vendedor
export const calcularVendasPorVendedor = (
  propostas: PropostaCompleta[]
): Record<number, { total: number; quantidade: number; faturamento: number }> => {
  const resultado: Record<
    number,
    { total: number; quantidade: number; faturamento: number }
  > = {};

  propostas
    .filter((p) => p.status === "FINALIZADA")
    .forEach((proposta) => {
      const vendedorId = proposta.idVendedor;

      if (!resultado[vendedorId]) {
        resultado[vendedorId] = { total: 0, quantidade: 0, faturamento: 0 };
      }

      resultado[vendedorId].quantidade += 1;
      resultado[vendedorId].faturamento += proposta.valorPropostaReal;
      resultado[vendedorId].total = resultado[vendedorId].faturamento;
    });

  return resultado;
};

// Calcula taxa de conversão (se houver dados de leads)
export const calcularTaxaConversao = (
  vendas: number,
  leads: number
): number => {
  if (leads === 0) return 0;
  return vendas / leads;
};

export const ReportAggregatorService = {
  calcularMetricasVendas,
  calcularMetricasCompletas,
  calcularFaturamentoPorBanco,
  calcularVendasPorVendedor,
  calcularTaxaConversao,
};
