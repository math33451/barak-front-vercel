import { useState } from "react";
import { Expense } from "@/types";
import {
  useExpenses,
  useCreateExpense,
  useDeleteExpense,
} from "@/hooks/useEntities";

interface ExpenseViewModel {
  isLoading: boolean;
  error: Error | null;
  expenses: Expense[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingExpense: Partial<Expense> | null;
  openModal: (expense?: Partial<Expense>) => void;
  closeModal: () => void;
  handleSaveExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  handleDeleteExpense: (expenseId: string) => Promise<void>;
}

export const useExpenseViewModel = (): ExpenseViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Partial<Expense> | null>(
    null
  );

  // React Query hooks
  const { data: expenses = [], isLoading, error } = useExpenses();

  const createExpenseMutation = useCreateExpense();
  const deleteExpenseMutation = useDeleteExpense();

  const openModal = (expense: Partial<Expense> | null = null) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingExpense(null);
    setIsModalOpen(false);
  };

  const handleSaveExpense = async (expense: Omit<Expense, "id">) => {
    try {
      await createExpenseMutation.mutateAsync(expense);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar despesa:", err);
      throw err;
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await deleteExpenseMutation.mutateAsync(expenseId);
    } catch (err) {
      console.error("Erro ao deletar despesa:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    expenses,
    isModalOpen,
    isSubmitting:
      createExpenseMutation.isPending || deleteExpenseMutation.isPending,
    editingExpense,
    openModal,
    closeModal,
    handleSaveExpense,
    handleDeleteExpense,
  };
};
