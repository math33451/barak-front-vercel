import { useState, useEffect } from 'react';
import { ExpenseService } from '@/services/ExpenseService';
import { Expense } from '@/types';

interface ExpenseViewModel {
  isLoading: boolean;
  error: Error | null;
  expenses: Expense[];
}

export const useExpenseViewModel = (): ExpenseViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        setIsLoading(true);
        const fetchedExpenses = await ExpenseService.fetchExpenses();
        setExpenses(fetchedExpenses);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadExpenses();
  }, []);

  return {
    isLoading,
    error,
    expenses,
  };
};