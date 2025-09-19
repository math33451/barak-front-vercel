import React from "react";

export type StatusType =
  | "disponivel"
  | "reservado"
  | "promocao"
  | "testdrive"
  | "visita"
  | "negociacao"
  | "vendido"
  | "agendado"
  | "concluido"
  | "cancelado";

const statusStyles: Record<StatusType, { bg: string; text: string }> = {
  disponivel: { bg: "bg-green-100", text: "text-green-800" },
  reservado: { bg: "bg-yellow-100", text: "text-yellow-800" },
  promocao: { bg: "bg-blue-100", text: "text-blue-800" },
  testdrive: { bg: "bg-blue-100", text: "text-blue-800" },
  visita: { bg: "bg-purple-100", text: "text-purple-800" },
  negociacao: { bg: "bg-green-100", text: "text-green-800" },
  vendido: { bg: "bg-red-100", text: "text-red-800" }, // New
  agendado: { bg: "bg-indigo-100", text: "text-indigo-800" }, // New
  concluido: { bg: "bg-green-100", text: "text-green-800" }, // New
  cancelado: { bg: "bg-red-100", text: "text-red-800" }, // New
};

type StatusBadgeProps = {
  status: StatusType;
  label: string;
};

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <span
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${style.bg} ${style.text}`}
    >
      {label}
    </span>
  );
}