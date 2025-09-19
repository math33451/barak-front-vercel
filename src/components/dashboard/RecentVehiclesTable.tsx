import React from "react";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge"; // Import StatusType
import { Vehicle } from "@/types";
import Image from "next/image";

interface RecentVehiclesTableProps {
  vehicles: Vehicle[];
}

export default function RecentVehiclesTable({ vehicles }: RecentVehiclesTableProps) {
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
        const statusMap: Record<typeof status, { label: string; type: StatusType }> = { // Explicitly type statusMap
          sold: { label: "Vendido", type: "vendido" },
          in_stock: { label: "Em Estoque", type: "disponivel" },
        };
        return (
          <StatusBadge
            status={statusMap[status].type}
            label={statusMap[status].label}
          />
        );
      },
    },
  ];

  return (
    <DataTable<Vehicle>
      title="Veículos Adicionados Recentemente"
      columns={columns}
      data={vehicles}
      viewAllLink="/veiculos"
    />
  );
}
