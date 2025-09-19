import React from "react";
import DataTable, { Column } from "../ui/DataTable";
import StatusBadge, { StatusType } from "../ui/StatusBadge";

interface Appointment {
  [key: string]: unknown;
  name: string;
  phone: string;
  vehicle: string;
  date: string;
  type: string;
  typeCode: StatusType;
}

export default function AppointmentsTable() {
  const columns: Column<Appointment>[] = [
    {
      key: "client",
      title: "Cliente",
      render: (_: unknown, item: Appointment) => (
        <div>
          <div className="text-sm font-medium text-[color:var(--heading)]">
            {item.name}
          </div>
          <div className="text-sm text-[color:var(--muted)]">{item.phone}</div>
        </div>
      ),
    },
    {
      key: "vehicle",
      title: "Veículo",
    },
    {
      key: "date",
      title: "Data",
    },
    {
      key: "type",
      title: "Tipo",
      render: (value: unknown, item: Appointment) => (
        <StatusBadge status={item.typeCode} label={value as string} />
      ),
    },
  ];

  const data: Appointment[] = [
    {
      name: "Maria Silva",
      phone: "(11) 98765-4321",
      vehicle: "Honda Civic EXL",
      date: "Hoje, 14:00",
      type: "Test Drive",
      typeCode: "testdrive",
    },
    {
      name: "João Santos",
      phone: "(11) 97654-3210",
      vehicle: "Kawasaki Z900",
      date: "Amanhã, 10:30",
      type: "Visita",
      typeCode: "visita",
    },
    {
      name: "Carlos Oliveira",
      phone: "(11) 91234-5678",
      vehicle: "Toyota Hilux SRX",
      date: "Amanhã, 16:00",
      type: "Negociação",
      typeCode: "negociacao",
    },
  ];

  return (
    <DataTable<Appointment>
      title="Próximos Agendamentos"
      columns={columns}
      data={data}
      viewAllLink="/agendamentos"
    />
  );
}
