"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { Car, Plus } from "lucide-react";
import { useVehiclePageViewModel } from "@/viewmodels/useVehiclePageViewModel";
import DataTable, { Column } from "@/components/ui/DataTable";
import { Vehicle } from "@/types";
import Image from "next/image";

export default function Veiculos() {
  const { isLoading, error, vehicles } = useVehiclePageViewModel();

  const columns: Column<Vehicle>[] = [
    {
      key: "name",
      title: "Veículo",
      render: (_: unknown, item: Vehicle) => (
        <div className="flex items-center">
          {item.imageUrl && (
            <Image
              src={item.imageUrl}
              alt={item.name}
              width={40}
              height={40}
              className="rounded-md object-cover"
            />
          )}
          <div className="ml-4">
            <div className="text-sm font-medium text-[color:var(--heading)]">
              {item.name}
            </div>
            <div className="text-sm text-[color:var(--muted)]">
              {item.type === "car" ? "Carro" : "Moto"}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "price",
      title: "Preço",
      render: (value: unknown) => (
        <span className="text-sm font-medium text-[color:var(--heading)]">
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value as number)}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: unknown) => {
        const status = value as "sold" | "in_stock";
        const statusMap = {
          sold: { label: "Vendido", type: "vendido" },
          in_stock: { label: "Em Estoque", type: "disponivel" },
        };
        return (
          // Assuming StatusBadge is a component that accepts 'status' and 'label'
          // and 'status' is of type StatusType
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
              statusMap[status].type === "vendido" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
            }`}
          >
            {statusMap[status].label}
          </span>
        );
      },
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout title="Veículos" activePath="/veiculos">
        <div>Loading vehicles...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Veículos" activePath="/veiculos">
        <div>Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Veículos" activePath="/veiculos">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[color:var(--heading)] flex items-center gap-2">
            <Car className="h-6 w-6" style={{ color: "var(--primary)" }} />
            Veículos cadastrados
          </h2>
          <button className="btn btn-primary flex items-center gap-2">
            <Plus className="h-5 w-5" /> Novo Veículo
          </button>
        </div>
        {vehicles.length > 0 ? (
          <DataTable<Vehicle> columns={columns} data={vehicles} title="Lista de Veículos" />
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-100 bg-white shadow-sm">
            <p className="p-4">Nenhum veículo cadastrado.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}