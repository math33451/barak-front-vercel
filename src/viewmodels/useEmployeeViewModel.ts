import { useState } from "react";
import { Employee } from "@/types";
import {
  useEmployees,
  useCreateEmployee,
  useDeleteEmployee,
} from "@/hooks/useEntities";

interface EmployeeViewModel {
  isLoading: boolean;
  error: Error | null;
  employees: Employee[];
  isModalOpen: boolean;
  isSubmitting: boolean;
  editingEmployee: Partial<Employee> | null;
  openModal: (employee?: Partial<Employee>) => void;
  closeModal: () => void;
  handleSaveEmployee: (employee: Omit<Employee, "id">) => Promise<void>;
  handleDeleteEmployee: (employeeId: string) => Promise<void>;
}

export const useEmployeeViewModel = (): EmployeeViewModel => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] =
    useState<Partial<Employee> | null>(null);

  // React Query hooks
  const { data: employees = [], isLoading, error } = useEmployees();

  const createEmployeeMutation = useCreateEmployee();
  const deleteEmployeeMutation = useDeleteEmployee();

  const openModal = (employee: Partial<Employee> | null = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(false);
  };

  const handleSaveEmployee = async (employee: Omit<Employee, "id">) => {
    try {
      await createEmployeeMutation.mutateAsync(employee);
      closeModal();
    } catch (err) {
      console.error("Erro ao salvar funcionário:", err);
      throw err;
    }
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    try {
      await deleteEmployeeMutation.mutateAsync(employeeId);
    } catch (err) {
      console.error("Erro ao deletar funcionário:", err);
      throw err;
    }
  };

  return {
    isLoading,
    error: error as Error | null,
    employees,
    isModalOpen,
    isSubmitting:
      createEmployeeMutation.isPending || deleteEmployeeMutation.isPending,
    editingEmployee,
    openModal,
    closeModal,
    handleSaveEmployee,
    handleDeleteEmployee,
  };
};
