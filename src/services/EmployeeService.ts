import { Employee } from "@/types";
import { httpClient } from "@/infra/httpClient";

// Interface baseada no DTO real do backend
interface BackendFuncionario {
  idFuncionario?: number;
  nomeFuncionario: string;
  cpfFuncionario: string;
  idUnidadeEmpresa: number;
  vendas?: unknown[];
  isGerente: {
    id: "S" | "N";
    descricao: "SIM" | "NÃO";
    logical: boolean;
  } | null;
}

// Função para mapear do frontend para o backend
const mapToBackend = (
  employee: Omit<Employee, "id">
): Omit<BackendFuncionario, "idFuncionario"> => {
  const unit = employee.unit as { id: number } | undefined;

  return {
    nomeFuncionario: employee.name as string,
    cpfFuncionario: employee.cpf as string,
    idUnidadeEmpresa: unit?.id || 1,
    isGerente: {
      id: employee.isManager ? "S" : "N",
      descricao: employee.isManager ? "SIM" : "NÃO",
      logical: !!employee.isManager,
    },
  };
};

// Função para mapear do backend para o frontend
const mapFromBackend = (backendFuncionario: BackendFuncionario): Employee => ({
  id: backendFuncionario.idFuncionario?.toString() || "",
  name: backendFuncionario.nomeFuncionario,
  cpf: backendFuncionario.cpfFuncionario,
  email: "", // Não disponível no backend
  phone: "", // Não disponível no backend
  isActive: true, // Assumir ativo por padrão
  isManager: backendFuncionario.isGerente?.logical || false,
  unit: { id: backendFuncionario.idUnidadeEmpresa, name: "Unidade" },
});

const fetchEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await httpClient.get<BackendFuncionario[]>(
      "/funcionarios/listar"
    );
    if (response && response.length > 0) {
      return response.map(mapFromBackend);
    }
    return [];
  } catch (error) {
    console.error("Erro ao buscar funcionários:", error);
    return [];
  }
};

const saveEmployee = async (
  employee: Omit<Employee, "id">
): Promise<Employee> => {
  try {
    const backendData = mapToBackend(employee);
    const response = await httpClient.post<BackendFuncionario>(
      "/funcionarios",
      backendData
    );
    return mapFromBackend(response);
  } catch (error) {
    console.error("Erro ao salvar funcionário:", error);
    throw error;
  }
};

const deleteEmployee = async (employeeId: string): Promise<void> => {
  await httpClient.delete<void>(`/funcionarios/${employeeId}`);
};

export const EmployeeService = {
  fetchEmployees,
  saveEmployee,
  deleteEmployee,
};
