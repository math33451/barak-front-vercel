'use client';

import { useState, useEffect } from 'react';
import { Bank } from '@/types';

interface BankFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingBank: Partial<Bank> | null;
  onClose: () => void;
  onSave: (bank: Omit<Bank, 'id'>) => void;
}

export default function BankForm({ isOpen, isSubmitting, editingBank, onClose, onSave }: BankFormProps) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (editingBank) {
      setName(editingBank.name || '');
      setCode(editingBank.code || '');
    } else {
      setName('');
      setCode('');
    }
  }, [editingBank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name, code });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">{editingBank ? 'Editar Banco' : 'Novo Banco'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Banco</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input w-full mt-1"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">Código</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
