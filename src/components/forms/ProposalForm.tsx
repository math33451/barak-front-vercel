'use client';

import { useState, useEffect } from 'react';
import { Proposal, Client, Vehicle, Bank, Employee } from '@/types';

// Placeholder services
const fetchClients = async (): Promise<Client[]> => [{ id: '1', name: 'John Doe', email: 'john@doe.com', phone: '123' }];
const fetchVehicles = async (): Promise<Vehicle[]> => [{ id: '1', name: 'Car A', price: 10000, type: 'car', status: 'in_stock' }];
const fetchBanks = async (): Promise<Bank[]> => [{ id: '1', name: 'Bank A', code: '001' }];
const fetchEmployees = async (): Promise<Employee[]> => [{ id: '1', name: 'Jane Doe', cpf: '123', email: 'jane@doe.com', phone: '456', isActive: true, isManager: false, unit: {id: 1, name: 'Matriz'} }];

interface ProposalFormProps {
  isOpen: boolean;
  isSubmitting: boolean;
  editingProposal: Partial<Proposal> | null;
  onClose: () => void;
  onSave: (proposal: Omit<Proposal, 'id'>) => void;
}

export default function ProposalForm({ isOpen, isSubmitting, editingProposal, onClose, onSave }: ProposalFormProps) {
  const [value, setValue] = useState(0);
  const [selectedReturn, setSelectedReturn] = useState(1);
  const [isFinanced, setIsFinanced] = useState(false);
  const [sellerId, setSellerId] = useState('');
  const [bankId, setBankId] = useState<string | undefined>(undefined);
  const [clientId, setClientId] = useState('');
  const [vehicleId, setVehicleId] = useState('');

  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [banks, setBanks] = useState<Bank[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    fetchClients().then(setClients);
    fetchVehicles().then(setVehicles);
    fetchBanks().then(setBanks);
    fetchEmployees().then(setEmployees);
  }, []);

  useEffect(() => {
    if (editingProposal) {
      // Populate form for editing
    } else {
      // Reset form for new proposal
    }
  }, [editingProposal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (!clientId || !vehicleId || !sellerId) return;

    const proposalData: Omit<Proposal, 'id'> = {
        value: value,
        ilaValue: 0, // Calculated on backend
        returnValue: 0, // Calculated on backend
        bankReturnMultiplier: 0, // Calculated on backend
        selectedReturn: selectedReturn,
        isFinanced: isFinanced ? 'SIM' : 'NAO',
        status: 'PENDENTE',
        updatedAt: new Date().toISOString(),
        sellerId: sellerId,
        bankId: bankId,
        client: clients.find(c => c.id === clientId)!,
        vehicle: vehicles.find(v => v.id === vehicleId)!,
    };
    onSave(proposalData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">{editingProposal ? 'Editar Proposta' : 'Nova Proposta'}</h2>
        <form onSubmit={handleSubmit}>
            {/* Form fields for proposal, client, vehicle, bank, seller */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Client, Vehicle, Seller, Bank dropdowns */}
                {/* Proposal value, financing options etc. */}
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
