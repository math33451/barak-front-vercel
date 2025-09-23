'use client';

import { useState, useEffect } from 'react';
import { Agreement, Bank, UnidadeEmpresaDTO } from '@/types';
import { BankService } from '@/services/BankService';
import { UnitService } from '@/services/UnitService';

interface AgreementFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingAgreement: Partial<Agreement> | null;
  onClose: () => void;
  onSave: (agreement: Omit<Agreement, 'id'>) => void;
}

export default function AgreementForm({ isOpen, isSubmitting, editingAgreement, onClose, onSave }: AgreementFormProps) {
  const [unitId, setUnitId] = useState('');
  const [bankId, setBankId] = useState('');
  const [return1, setReturn1] = useState(0);
  const [return2, setReturn2] = useState(0);
  const [return3, setReturn3] = useState(0);
  const [return4, setReturn4] = useState(0);
  const [return5, setReturn5] = useState(0);

  const [units, setUnits] = useState<UnidadeEmpresaDTO[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);

  useEffect(() => {
    UnitService.fetchUnits().then(setUnits);
    BankService.fetchBanks().then(setBanks);
  }, []);

  useEffect(() => {
    if (editingAgreement) {
      setUnitId(editingAgreement.unitId || '');
      setBankId(editingAgreement.bankId || '');
      setReturn1(editingAgreement.return1 || 0);
      setReturn2(editingAgreement.return2 || 0);
      setReturn3(editingAgreement.return3 || 0);
      setReturn4(editingAgreement.return4 || 0);
      setReturn5(editingAgreement.return5 || 0);
    } else {
      setUnitId('');
      setBankId('');
      setReturn1(0);
      setReturn2(0);
      setReturn3(0);
      setReturn4(0);
      setReturn5(0);
    }
  }, [editingAgreement]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bankName = banks.find(b => b.id === bankId)?.name || '';
    onSave({ unitId, bankId, bankName, return1, return2, return3, return4, return5 });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{editingAgreement ? 'Editar Acordo' : 'Novo Acordo'}</h2>
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                    <label htmlFor="unitId" className="block text-sm font-medium text-gray-700">Unidade</label>
                    <select id="unitId" value={unitId} onChange={(e) => setUnitId(e.target.value)} className="input w-full mt-1" required>
                        <option value="" disabled>Selecione uma unidade</option>
                        {units.map(u => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-4">
                    <label htmlFor="bankId" className="block text-sm font-medium text-gray-700">Banco</label>
                    <select id="bankId" value={bankId} onChange={(e) => setBankId(e.target.value)} className="input w-full mt-1" required>
                        <option value="" disabled>Selecione um banco</option>
                        {banks.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>
                {/* Returns */}
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
