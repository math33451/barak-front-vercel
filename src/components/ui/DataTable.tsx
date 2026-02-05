import React from "react";
import Link from "next/link";
import { logger } from "@/utils/logger";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

type DataTableProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  viewAllLink?: string;
  viewAllText?: string;
};

type ItemWithId = { id?: string | number } & Record<string, unknown>;

export default function DataTable<T extends ItemWithId>({
  title,
  columns,
  data,
  viewAllLink,
  viewAllText = "Ver todos",
}: DataTableProps<T>) {
  return (
    <div className="card p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[color:var(--heading)]">
          {title}
        </h2>
        {viewAllLink && (
          <Link
            href={viewAllLink}
            className="text-sm text-[color:var(--primary)] hover:underline"
          >
            {viewAllText}
          </Link>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key as string}
                  className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted)] uppercase tracking-wider"
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data && Array.isArray(data) && data.length > 0 ? (
              data
                .map((item, index) => {
                  if (!item || typeof item !== "object") {
                    logger.warn(
                      `Item inválido no índice ${index}`,
                      { item },
                      "DataTable",
                    );
                    return null;
                  }

                  return (
                    <tr key={item.id || `item-${index}`}>
                      {columns.map((column) => {
                        try {
                          return (
                            <td
                              key={`${item.id || index}-${String(column.key)}`}
                              className="px-6 py-4 whitespace-nowrap"
                            >
                              {column.render
                                ? column.render(
                                    item[column.key as keyof T],
                                    item,
                                  )
                                : item[column.key as keyof T] != null
                                  ? String(item[column.key as keyof T])
                                  : "-"}
                            </td>
                          );
                        } catch (error) {
                          logger.error(
                            `Erro ao renderizar coluna ${String(column.key)}`,
                            error,
                            "DataTable",
                          );
                          return (
                            <td
                              key={`${item.id || index}-${String(column.key)}`}
                              className="px-6 py-4 whitespace-nowrap text-red-500"
                            >
                              Erro
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })
                .filter(Boolean)
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-4 text-center text-gray-500"
                >
                  Nenhum dado disponível
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
