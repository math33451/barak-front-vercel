import { Proposal } from "@/types";
import { httpClient } from "@/infra/httpClient";

// Interface VendaFinalizada importada do types
import type { VendaFinalizada, PropostaCompleta } from "@/types";

// Interface baseada no DTO real do backend
interface BackendProposta {
  id?: number;
  idVendedor: number;
  idUnidadeEmpresa?: number;
  dataVenda?: string;
  dataAtualizacao?: string;
  idCliente: number;
  valorPropostaReal: number;
  valorPropostaArrecadadoILA: number;
  isFinanciado: string; // "SIM" ou "NAO" vindos do backend
  idBanco: number;
  retornoSelecionado: number;
  multiplicadorRetornoBanco: number;
  valorRetorno: number;
  valorPlus?: number | null;
  status: string; // "FINALIZADA" | "PENDENTE" | "CANCELADA"
}

// Função para mapear do frontend para o backend
const mapToBackend = (
  proposal: Omit<Proposal, "id">
): Omit<BackendProposta, "id"> => {
  const sellerId =
    typeof proposal.sellerId === "string" ? proposal.sellerId : "1";
  const client = proposal.client as { id: string } | undefined;
  const clientId = client?.id || "1";
  const bankId = (proposal.bankId as string) || "1";

  return {
    idVendedor: parseInt(sellerId),
    idCliente: parseInt(clientId),
    valorPropostaReal: Number(proposal.value) || 0,
    valorPropostaArrecadadoILA: Number(proposal.ilaValue) || 0,
    isFinanciado: proposal.isFinanced === "SIM" ? "SIM" : "NAO",
    idBanco: parseInt(bankId),
    retornoSelecionado: Number(proposal.selectedReturn) || 1,
    multiplicadorRetornoBanco: Number(proposal.bankReturnMultiplier) || 1,
    valorRetorno: Number(proposal.returnValue) || 0,
    status: proposal.status || "PENDENTE",
  } as unknown as BackendProposta; // cast simples para seguir interface
};

// Função para mapear do backend para o frontend
const mapFromBackend = (backendProposta: BackendProposta): Proposal => {
  // Garantir que todos os campos obrigatórios existam
  if (!backendProposta) {
    throw new Error("Dados da proposta inválidos");
  }

  return {
    id: backendProposta.id?.toString() || Math.random().toString(),
    value: Number(backendProposta.valorPropostaReal) || 0,
    ilaValue: Number(backendProposta.valorPropostaArrecadadoILA) || 0,
    returnValue: Number(backendProposta.valorRetorno) || 0,
    bankReturnMultiplier:
      Number(backendProposta.multiplicadorRetornoBanco) || 1,
    selectedReturn: Number(backendProposta.retornoSelecionado) || 1,
    isFinanced: backendProposta.isFinanciado === "SIM" ? "SIM" : "NAO",
    status: (backendProposta.status as Proposal["status"]) || "PENDENTE",
    updatedAt:
      backendProposta.dataAtualizacao ||
      backendProposta.dataVenda ||
      new Date().toISOString(),
    sellerId: backendProposta.idVendedor?.toString() || "1",
    bankId: backendProposta.idBanco?.toString() || "1",
    client: {
      id: backendProposta.idCliente?.toString() || "1",
      name: `Cliente ${backendProposta.idCliente || "Desconhecido"}`,
      email: "",
      phone: "",
    },
    vehicle: {
      id: "1",
      name: "Veículo",
      price: Number(backendProposta.valorPropostaReal) || 0,
      type: "car",
      status: "sold",
    },
  };
};

const fetchProposals = async (): Promise<Proposal[]> => {
  try {
    const response = await httpClient.get<BackendProposta[]>(
      "/proposta/listar"
    );

    if (!response || !Array.isArray(response)) {
      console.warn("Resposta inválida do backend:", response);
      return [];
    }

    if (response.length === 0) {
      return [];
    }

    // Mapear e filtrar propostas válidas
    const mappedProposals = response
      .filter((item) => item && typeof item === "object")
      .map((item, index) => {
        try {
          return mapFromBackend(item);
        } catch (error) {
          console.error(`Erro ao mapear proposta ${index}:`, error, item);
          return null;
        }
      })
      .filter((proposal): proposal is Proposal => proposal !== null);

    return mappedProposals;
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    throw error; // Re-throw para que o React Query possa capturar
  }
};

const saveProposal = async (
  proposal: Omit<Proposal, "id">
): Promise<Proposal> => {
  try {
    const backendData = mapToBackend(proposal);
    const response = await httpClient.post<BackendProposta>(
      "/proposta",
      backendData
    );
    return mapFromBackend(response);
  } catch (error) {
    console.error("Erro ao salvar proposta:", error);
    throw error;
  }
};

const approveProposal = async (proposalId: string): Promise<void> => {
  await httpClient.get<void>(`/proposta/aprovar/${proposalId}`);
};

const cancelProposal = async (proposalId: string): Promise<void> => {
  await httpClient.get<void>(`/proposta/cancelar/${proposalId}`);
};

// Buscar vendas finalizadas com dados mínimos (para relatórios)
const fetchVendasFinalizadas = async (): Promise<VendaFinalizada[]> => {
  const response = await httpClient.get<VendaFinalizada[]>(
    "/proposta/finalizadas"
  );
  return response || [];
};

// Buscar todas as propostas completas (para análises detalhadas)
const fetchPropostasCompletas = async (): Promise<PropostaCompleta[]> => {
  const response = await httpClient.get<PropostaCompleta[]>("/proposta/listar");
  return response || [];
};

export const ProposalService = {
  fetchProposals,
  saveProposal,
  approveProposal,
  cancelProposal,
  fetchVendasFinalizadas,
  fetchPropostasCompletas,
};
