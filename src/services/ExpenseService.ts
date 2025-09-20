import { Expense } from '@/types';

const mockExpenses: Expense[] = [
  { id: '1', description: 'Aluguel do Pátio', amount: 5000, date: '2025-09-01', category: 'Operacional' },
  { id: '2', description: 'Salários', amount: 15000, date: '2025-09-05', category: 'Pessoal' },
  { id: '3', description: 'Marketing Digital', amount: 2000, date: '2025-09-10', category: 'Marketing' },
  { id: '4', description: 'Manutenção de Veículos', amount: 1200, date: '2025-09-12', category: 'Manutenção' },
];

const fetchExpenses = async (): Promise<Expense[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockExpenses;
};

export const ExpenseService = {
  fetchExpenses,
};
