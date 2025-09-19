import React from "react";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge";

interface Vehicle {
  [key: string]: unknown;
  name: string;
  details: string;
  year: string;
  price: string;
  status: string;
  statusType: StatusType;
}

export default function RecentVehiclesTable() {
  const columns: Column<Vehicle>[] = [
    {
      key: "vehicle",
      title: "Veículo",
      render: (_: unknown, item: Vehicle) => (
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-[color:var(--heading)]">
              {item.name}
            </div>
            <div className="text-sm text-[color:var(--muted)]">
              {item.details}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "year",
      title: "Ano/Modelo",
    },
    {
      key: "price",
      title: "Preço",
      render: (value: unknown) => (
        <span className="text-sm font-medium text-[color:var(--heading)]">
          {value as string}
        </span>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: unknown, item: Vehicle) => (
        <StatusBadge status={item.statusType} label={value as string} />
      ),
    },
  ];

  const data: Vehicle[] = [
    {
      name: "Toyota Corolla XEi",
      details: "Sedan • Automático • Prata",
      year: "2023/2024",
      price: "R$ 142.900",
      status: "Disponível",
      statusType: "disponivel",
    },
    {
      name: "Honda CB 500X",
      details: "Moto • Trail • Vermelha",
      year: "2022/2022",
      price: "R$ 39.900",
      status: "Disponível",
      statusType: "disponivel",
    },
    {
      name: "Jeep Compass Limited",
      details: "SUV • Automático • Preto",
      year: "2023/2023",
      price: "R$ 189.900",
      status: "Reservado",
      statusType: "reservado",
    },
    {
      name: "Volkswagen Golf GTI",
      details: "Hatch • Automático • Branco",
      year: "2022/2023",
      price: "R$ 249.900",
      status: "Em promoção",
      statusType: "promocao",
    },
    {
      name: "Yamaha MT-07",
      details: "Moto • Naked • Azul",
      year: "2023/2024",
      price: "R$ 48.900",
      status: "Disponível",
      statusType: "disponivel",
    },
  ];

  return (
    <DataTable<Vehicle>
      title="Veículos Adicionados Recentemente"
      columns={columns}
      data={data}
      viewAllLink="/veiculos"
    />
  );
}