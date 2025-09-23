import { Proposal } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchProposals = async (): Promise<Proposal[]> => {
  const response = await httpClient.get<Proposal[]>('/rest/proposta/listar');
  return response;
};

const saveProposal = async (proposal: Omit<Proposal, 'id'>): Promise<Proposal> => {
  const response = await httpClient.post<Proposal>('/rest/proposta', proposal);
  return response;
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
