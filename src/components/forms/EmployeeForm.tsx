'use client';

import { useState, useEffect } from 'react';
import { Employee, UnidadeEmpresaDTO } from '@/types';

interface EmployeeFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingEmployee: Partial<Employee> | null;
  units: UnidadeEmpresaDTO[];
  onClose: () => void;
  onSave: (employee: Omit<Employee, 'id'>) => void;
}

export default function EmployeeForm({ isOpen, isSubmitting, editingEmployee, units, onClose, onSave }: EmployeeFormProps) {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isManager, setIsManager] = useState(false);
  const [unit, setUnit] = useState<UnidadeEmpresaDTO | null>(null);

  useEffect(() => {
    if (editingEmployee) {
      setName(editingEmployee.name || '');
      setCpf(editingEmployee.cpf || '');
      setEmail(editingEmployee.email || '');
      setPhone(editingEmployee.phone || '');
      setIsActive(editingEmployee.isActive === undefined ? true : editingEmployee.isActive);
      setIsManager(editingEmployee.isManager || false);
      setUnit(editingEmployee.unit || null);
    } else {
      setName('');
      setCpf('');
      setEmail('');
      setPhone('');
      setIsActive(true);
      setIsManager(false);
      setUnit(null);
    }
  }, [editingEmployee]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!unit) return;
    onSave({ name, cpf, email, phone, isActive, isManager, unit });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">{editingEmployee ? 'Editar Funcionário' : 'Novo Funcionário'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome</label>
              <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} className="input w-full mt-1" required />
            </div>
            <div className="mb-4">
              <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">CPF</label>
              <input id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} className="input w-full mt-1" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full mt-1" required />
            </div>
            <div className="mb-4">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
              <input id="phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="input w-full mt-1" />
            </div>
            <div className="mb-4">
              <label htmlFor="unit" className="block text-sm font-medium text-gray-700">Unidade</label>
              <select id="unit" value={unit?.id || ''} onChange={(e) => setUnit(units.find(u => u.id === Number(e.target.value)) || null)} className="input w-full mt-1" required>
                <option value="" disabled>Selecione uma unidade</option>
                {units.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-4 mb-4 col-span-2">
                <div className="flex items-center">
                    <input id="isActive" type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Ativo</label>
                </div>
                <div className="flex items-center">
                    <input id="isManager" type="checkbox" checked={isManager} onChange={(e) => setIsManager(e.target.checked)} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded" />
                    <label htmlFor="isManager" className="ml-2 block text-sm text-gray-900">Gerente</label>
                </div>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">{isSubmitting ? 'Salvando...' : 'Salvar'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
