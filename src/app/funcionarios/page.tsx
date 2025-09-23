'use client';

import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import { useEmployeeViewModel } from '@/viewmodels/useEmployeeViewModel';
import DataTable, { Column } from '@/components/ui/DataTable';
import { Employee, UnidadeEmpresaDTO } from '@/types';
import EmployeeForm from '@/components/forms/EmployeeForm';
import { useEffect, useState } from 'react';

import { UnitService } from '@/services/UnitService';

export default function Funcionarios() {
  const {
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
  } = useEmployeeViewModel();

  const [units, setUnits] = useState<UnidadeEmpresaDTO[]>([]);

  useEffect(() => {
    UnitService.fetchUnits().then(setUnits);
  }, []);

  const columns: Column<Employee>[] = [
    { key: 'name', title: 'Nome' },
    { key: 'email', title: 'E-mail' },
    { key: 'phone', title: 'Telefone' },
    { key: 'unit', title: 'Unidade', render: (employee) => employee.unit.name },
    { key: 'isManager', title: 'Gerente', render: (employee) => (employee.isManager ? 'Sim' : 'Não') },
    { key: 'isActive', title: 'Ativo', render: (employee) => (employee.isActive ? 'Sim' : 'Não') },
    {
      key: 'actions',
      title: 'Ações',
      render: (employee) => (
        <div className="flex gap-2">
          <button onClick={() => openModal(employee)} className="btn btn-sm btn-outline">
            <Edit className="h-4 w-4" />
          </button>
          <button onClick={() => handleDeleteEmployee(employee.id)} className="btn btn-sm btn-outline btn-error">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading && !employees.length) {
    return (
      <DashboardLayout title="Funcionários" activePath="/funcionarios">
        <div>Loading employees...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Funcionários" activePath="/funcionarios">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Funcionários" activePath="/funcionarios">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <Users className="h-6 w-6" style={{ color: 'var(--primary)' }} />
            Funcionários Cadastrados
          </h2>
          <button onClick={() => openModal()} className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Novo Funcionário
          </button>
        </div>
        {employees.length > 0 ? (
          <DataTable<Employee> columns={columns} data={employees} title="Lista de Funcionários" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhum funcionário cadastrado.</p>
          </div>
        )}
      </div>
      <EmployeeForm
        isOpen={isModalOpen}
        isSubmitting={isSubmitting}
        editingEmployee={editingEmployee}
        units={units}
        onClose={closeModal}
        onSave={handleSaveEmployee}
      />
    </DashboardLayout>
  );
}
