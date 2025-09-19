import React from "react";
import DataTable, { Column } from "@/components/ui/DataTable";
import StatusBadge, { StatusType } from "@/components/ui/StatusBadge"; // Import StatusType
import { Appointment } from "@/types";
import Image from "next/image";

interface AppointmentsTableProps {
  appointments: Appointment[];
}

export default function AppointmentsTable({ appointments }: AppointmentsTableProps) {
  const columns: Column<Appointment>[] = [
    {
      key: "clientName",
      title: "Cliente",
      render: (value: unknown) => (
        <div className="text-sm font-medium text-[color:var(--heading)]">
          {value as string}
        </div>
      ),
    },
    {
      key: "vehicle",
      title: "Veículo",
      render: (value: unknown) => {
        const vehicle = value as Appointment["vehicle"];
        return (
          <div className="flex items-center">
            {vehicle.imageUrl && (
              <Image
                src={vehicle.imageUrl}
                alt={vehicle.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
            )}
            <div className="ml-4">
              <div className="text-sm font-medium text-[color:var(--heading)]">
                {vehicle.name}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      key: "date",
      title: "Data",
      render: (value: unknown) => (
        <div className="text-sm text-[color:var(--muted)]">
          {new Date(value as string).toLocaleString("pt-BR", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </div>
      ),
    },
    {
      key: "status",
      title: "Status",
      render: (value: unknown) => {
        const status = value as "scheduled" | "completed" | "canceled";
        const statusMap: Record<typeof status, { label: string; type: StatusType }> = { // Explicitly type statusMap
          scheduled: { label: "Agendado", type: "agendado" },
          completed: { label: "Concluído", type: "concluido" },
          canceled: { label: "Cancelado", type: "cancelado" },
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
    <DataTable<Appointment>
      title="Próximos Agendamentos"
      columns={columns}
      data={appointments}
      viewAllLink="/agendamentos"
    />
  );
}