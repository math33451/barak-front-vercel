import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientService } from "@/services/ClientService";
import { BankService } from "@/services/BankService";
import { EmployeeService } from "@/services/EmployeeService";
import { UnitService } from "@/services/UnitService";
import { VehiclePageService } from "@/services/VehiclePageService";
import { ExpenseService } from "@/services/ExpenseService";
import { FinancingService } from "@/services/FinancingService";

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

export const unitKeys = {
  all: ["units"] as const,
  list: () => [...unitKeys.all, "list"] as const,
};

export const vehicleKeys = {
  all: ["vehicles"] as const,
  list: () => [...vehicleKeys.all, "list"] as const,
};

export const expenseKeys = {
  all: ["expenses"] as const,
  list: () => [...expenseKeys.all, "list"] as const,
};

export const financingKeys = {
  all: ["financing"] as const,
  list: () => [...financingKeys.all, "list"] as const,
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

export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ClientService.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
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

export const useDeleteBank = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: BankService.deleteBank,
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

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: EmployeeService.deleteEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Hooks para unidades
export const useUnits = () => {
  return useQuery({
    queryKey: unitKeys.list(),
    queryFn: UnitService.fetchUnits,
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UnitService.saveUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.all }); // Funcionários têm unidades
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: UnitService.deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: unitKeys.all });
      queryClient.invalidateQueries({ queryKey: employeeKeys.all });
    },
  });
};

// Hooks para veículos
export const useVehicles = () => {
  return useQuery({
    queryKey: vehicleKeys.list(),
    queryFn: VehiclePageService.fetchVehicles,
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 15 * 60 * 1000,
  });
};

export const useCreateVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VehiclePageService.saveVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] }); // Afeta relatórios de vendas
    },
  });
};

export const useDeleteVehicle = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: VehiclePageService.deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Hooks para despesas
export const useExpenses = () => {
  return useQuery({
    queryKey: expenseKeys.list(),
    queryFn: ExpenseService.fetchExpenses,
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 10 * 60 * 1000,
  });
};

export const useCreateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ExpenseService.saveExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] }); // Afeta relatórios financeiros
    },
  });
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ExpenseService.deleteExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
};

// Hooks para financiamento
export const useFinancingAgreements = () => {
  return useQuery({
    queryKey: financingKeys.list(),
    queryFn: FinancingService.fetchAgreements,
    staleTime: 15 * 60 * 1000, // 15 minutos - dados menos voláteis
    gcTime: 45 * 60 * 1000,
  });
};

export const useCreateAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FinancingService.saveAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financingKeys.all });
    },
  });
};

export const useDeleteAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FinancingService.deleteAgreement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: financingKeys.all });
    },
  });
};
