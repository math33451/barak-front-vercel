import { Expense } from "@/types";
import { httpClient } from "@/infra/httpClient";

const fetchExpenses = async (): Promise<Expense[]> => {
  const response = await httpClient.get<Expense[]>("/despesa/listar");
  return response || [];
};

const saveExpense = async (expense: Omit<Expense, "id">): Promise<Expense> => {
  const response = await httpClient.post<Expense>("/despesa/salvar", expense);
  return response;
};

const deleteExpense = async (expenseId: string): Promise<void> => {
  await httpClient.delete<void>(`/despesa/delete/${expenseId}`);
};

export const ExpenseService = {
  fetchExpenses,
  saveExpense,
  deleteExpense,
};
