'use client';

import { useState, useEffect } from 'react';
import { UnidadeEmpresaDTO } from '@/types';

interface UnitFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingUnit: Partial<UnidadeEmpresaDTO> | null;
  onClose: () => void;
  onSave: (unit: Omit<UnidadeEmpresaDTO, 'id'>) => void;
}

export default function UnitForm({ isOpen, isSubmitting, editingUnit, onClose, onSave }: UnitFormProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (editingUnit) {
      setName(editingUnit.name || '');
    } else {
      setName('');
    }
  }, [editingUnit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{editingUnit ? 'Editar Unidade' : 'Nova Unidade'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Unidade</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full mt-1"
              required
            />
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
