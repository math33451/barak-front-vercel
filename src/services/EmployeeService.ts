import { Employee } from '@/types';
import { httpClient } from '@/infra/httpClient';

const fetchEmployees = async (): Promise<Employee[]> => {
  const response = await httpClient.get<Employee[]>('/rest/funcionarios/listar');
  return response;
};

const saveEmployee = async (employee: Omit<Employee, 'id'>): Promise<Employee> => {
  const response = await httpClient.post<Employee>('/rest/funcionarios', employee);
  return response;
};

const deleteEmployee = async (employeeId: string): Promise<void> => {
  await httpClient.delete<void>(`/rest/funcionarios/${employeeId}`);
};

export const EmployeeService = {
  fetchEmployees,
  saveEmployee,
  deleteEmployee,
};
