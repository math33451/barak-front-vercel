import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientService } from "@/services/ClientService";
import { BankService } from "@/services/BankService";
import { EmployeeService } from "@/services/EmployeeService";

// Query keys
export const clientKeys = {
  all: ["clients"] as const,
  list: () => [...clientKeys.all, "list"] as const,
};

export const bankKeys = {
  all: ["banks"] as const,
  list: () => [...bankKeys.all, "list"] as const,
};

export const employeeKeys = {
  all: ["employees"] as const,
  list: () => [...employeeKeys.all, "list"] as const,
};

// Hooks para clientes
export const useClients = () => {
  return useQuery({
    queryKey: clientKeys.list(),
    queryFn: ClientService.fetchClients,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  });
};

export const useCreateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ClientService.saveClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      // Pode afetar relatórios se cliente usado em vendas
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Hooks para bancos
export const useBanks = () => {
  return useQuery({
    queryKey: bankKeys.list(),
    queryFn: BankService.fetchBanks,
    staleTime: 10 * 60 * 1000, // 10 minutos - dados menos voláteis
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useCreateBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BankService.saveBank,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
    },
  });
};

// Hooks para funcionários
export const useEmployees = () => {
  return useQuery({
    queryKey: employeeKeys.list(),
    queryFn: EmployeeService.fetchEmployees,
    staleTime: 8 * 60 * 1000, // 8 minutos
    gcTime: 20 * 60 * 1000, // 20 minutos
  });
};

export const useCreateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EmployeeService.saveEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      // Pode afetar relatórios de vendedores
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};
