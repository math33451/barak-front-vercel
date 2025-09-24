import { Proposal } from "@/types";
import { httpClient } from "@/infra/httpClient";

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
  isFinanciado: {
    id: "S" | "N";
    descricao: "SIM" | "NÃO";
    logical: boolean;
  };
  idBanco: number;
  retornoSelecionado: number;
  multiplicadorRetornoBanco: number;
  valorRetorno: number;
  valorPlus?: number;
  status: {
    id: "F" | "P" | "C";
    descricao: "Finalizada" | "Pendente" | "Cancelada";
  };
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
    isFinanciado: {
      id: proposal.isFinanced === "SIM" ? "S" : "N",
      descricao: proposal.isFinanced === "SIM" ? "SIM" : "NÃO",
      logical: proposal.isFinanced === "SIM",
    },
    idBanco: parseInt(bankId),
    retornoSelecionado: Number(proposal.selectedReturn) || 1,
    multiplicadorRetornoBanco: Number(proposal.bankReturnMultiplier) || 1,
    valorRetorno: Number(proposal.returnValue) || 0,
    status: {
      id:
        proposal.status === "FINALIZADA"
          ? "F"
          : proposal.status === "PENDENTE"
          ? "P"
          : "C",
      descricao:
        proposal.status === "FINALIZADA"
          ? "Finalizada"
          : proposal.status === "PENDENTE"
          ? "Pendente"
          : "Cancelada",
    },
  };
};

// Função para mapear do backend para o frontend
const mapFromBackend = (backendProposta: BackendProposta): Proposal => ({
  id: backendProposta.id?.toString() || "",
  value: backendProposta.valorPropostaReal,
  ilaValue: backendProposta.valorPropostaArrecadadoILA,
  returnValue: backendProposta.valorRetorno,
  bankReturnMultiplier: backendProposta.multiplicadorRetornoBanco,
  selectedReturn: backendProposta.retornoSelecionado,
  isFinanced: backendProposta.isFinanciado.id === "S" ? "SIM" : "NAO",
  status:
    backendProposta.status.id === "F"
      ? "FINALIZADA"
      : backendProposta.status.id === "P"
      ? "PENDENTE"
      : "CANCELADA",
  updatedAt:
    backendProposta.dataAtualizacao ||
    backendProposta.dataVenda ||
    new Date().toISOString(),
  sellerId: backendProposta.idVendedor.toString(),
  bankId: backendProposta.idBanco?.toString(),
  client: {
    id: backendProposta.idCliente.toString(),
    name: "Cliente",
    email: "",
    phone: "",
  },
  vehicle: { id: "1", name: "Veículo", price: 0, type: "car", status: "sold" },
});

const fetchProposals = async (): Promise<Proposal[]> => {
  try {
    const response = await httpClient.get<BackendProposta[]>(
      "/rest/proposta/listar"
    );
    if (response && response.length > 0) {
      return response.map(mapFromBackend);
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar propostas:", error);
    return [];
  }
};

const saveProposal = async (
  proposal: Omit<Proposal, "id">
): Promise<Proposal> => {
  try {
    const backendData = mapToBackend(proposal);
    const response = await httpClient.post<BackendProposta>(
      "/rest/proposta",
      backendData
    );
    return mapFromBackend(response);
  } catch (error) {
    console.error("Erro ao salvar proposta:", error);
    throw error;
  }
};

const approveProposal = async (proposalId: string): Promise<void> => {
  await httpClient.get<void>(`/rest/proposta/aprovar/${proposalId}`);
};

const cancelProposal = async (proposalId: string): Promise<void> => {
  await httpClient.get<void>(`/rest/proposta/cancelar/${proposalId}`);
};

export const ProposalService = {
  fetchProposals,
  saveProposal,
  approveProposal,
  cancelProposal,
};
