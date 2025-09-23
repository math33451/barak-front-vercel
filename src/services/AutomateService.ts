import { httpClient } from '@/infra/httpClient';

const triggerIlaUpdate = async (): Promise<void> => {
  await httpClient.get('/rest/automate/ila');
};

export const AutomateService = {
  triggerIlaUpdate,
};
