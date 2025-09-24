import { Sale } from "@/types";
import { httpClient } from "@/infra/httpClient";

// Definindo interface baseada no DTO real do backend
interface BackendProposta {
  id: number;
  idVendedor: number;
  idUnidadeEmpresa?: number;
  dataVenda?: string;
  dataAtualizacao?: string | null;
  idCliente: number;
  valorPropostaReal: number;
  valorPropostaArrecadadoILA: number;
  isFinanciado: string; // SIM / NAO
  idBanco?: number;
  retornoSelecionado?: number;
  multiplicadorRetornoBanco?: number;
  valorRetorno?: number;
  valorPlus?: number | null;
  status: string; // FINALIZADA / PENDENTE / CANCELADA
}

const fetchSales = async (): Promise<Sale[]> => {
  try {
    // Como não há endpoint específico para vendas, vamos usar as propostas finalizadas
    const propostas = await httpClient.get<BackendProposta[]>(
      "/rest/proposta/finalizadas"
    );

    if (propostas && propostas.length > 0) {
      // Converte propostas finalizadas em vendas usando os nomes corretos do backend
      return propostas.map((proposta) => ({
        date: proposta.dataVenda
          ? proposta.dataVenda.split("T")[0]
          : proposta.dataAtualizacao
          ? proposta.dataAtualizacao.split("T")[0]
          : new Date().toISOString().split("T")[0],
        amount: proposta.valorPropostaReal || 0,
      }));
    }

    return [];
  } catch (error) {
    console.error("Erro ao buscar vendas:", error);
    return [];
  }
};

export const SalePageService = {
  fetchSales,
};
