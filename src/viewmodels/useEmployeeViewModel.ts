import { useState, useEffect, useCallback } from 'react';
import { EmployeeService } from '@/services/EmployeeService';
import { Employee } from '@/types';

interface EmployeeViewModel {
  isLoading: boolean;
  error: Error | null;
  employees: Employee[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingEmployee: Partial<Employee> | null;
  openModal: (employee?: Partial<Employee>) => void;
  closeModal: () => void;
  handleSaveEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  handleDeleteEmployee: (employeeId: string) => Promise<void>;
}

export const useEmployeeViewModel = (): EmployeeViewModel => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Partial<Employee> | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedEmployees = await EmployeeService.fetchEmployees();
      setEmployees(fetchedEmployees);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const openModal = (employee: Partial<Employee> | null = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  const handleSaveEmployee = async (employee: Omit<Employee, 'id'>) => {
    setIsSubmitting(true);
    try {
      await EmployeeService.saveEmployee(employee);
      await loadEmployees(); // Recarrega a lista
      closeModal();
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await EmployeeService.deleteEmployee(employeeId);
      await loadEmployees(); // Recarrega a lista
    } catch (err) {
      setError(err as Error);
    }
  };

  return {
    isLoading,
    error,
    employees,
    isModalOpen,
    isSubmitting,
    editingEmployee,
    openModal,
    closeModal,
    handleSaveEmployee,
    handleDeleteEmployee,
  };
};