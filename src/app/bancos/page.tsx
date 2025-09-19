
"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { CreditCard, Plus } from "lucide-react";

export default function Bancos() {
  return (
    <DashboardLayout title="Bancos" activePath="/bancos">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <CreditCard
              className="h-6 w-6"
              style={{ color: "var(--primary)" }}
            />
            Bancos cadastrados
          </h2>
          <button
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus className="h-5 w-5" /> Novo Banco
          </button>
        </div>
        <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
          <p className="p-4">Nenhum banco cadastrado.</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
