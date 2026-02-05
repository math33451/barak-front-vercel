"use client";

import React, { useMemo } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import Link from "next/link";
import { logger } from "@/utils/logger";

export type Column<T> = {
  key: keyof T | string;
  title: string;
  width?: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
};

type VirtualizedDataTableProps<T> = {
  title: string;
  columns: Column<T>[];
  data: T[];
  viewAllLink?: string;
  viewAllText?: string;
  rowHeight?: number;
  overscan?: number;
};

type ItemWithId = { id?: string | number } & Record<string, unknown>;

/**
 * VirtualizedDataTable - Tabela com virtualização para listas grandes
 *
 * Benefícios:
 * - Renderiza apenas linhas visíveis (performance)
 * - Suporta 10k+ items sem lag
 * - Scroll suave e responsivo
 * - Reduz uso de memória em 90%+
 *
 * Use quando:
 * - Tabela com mais de 50+ items
 * - Performance crítica
 * - Lista muito grande
 */
export default function VirtualizedDataTable<T extends ItemWithId>({
  title,
  columns,
  data,
  viewAllLink,
  viewAllText = "Ver todos",
  rowHeight = 60,
  overscan = 5,
}: VirtualizedDataTableProps<T>) {
  // Container ref para virtualização
  const parentRef = React.useRef<HTMLDivElement>(null);

  // Configurar virtualizer
  const virtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan,
  });

  // Calcular items visíveis
  const items = virtualizer.getVirtualItems();

  // Memoizar dados válidos
  const validData = useMemo(() => {
    return data.filter((item) => item && typeof item === "object");
  }, [data]);

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

      {validData.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum dado disponível
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 rounded-lg">
          <div className="min-w-full">
            {/* Header fixo */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="flex">
                {columns.map((column) => (
                  <div
                    key={column.key as string}
                    className="px-6 py-3 text-left text-xs font-medium text-[color:var(--muted)] uppercase tracking-wider flex-shrink-0"
                    style={{ width: column.width || "auto", minWidth: "120px" }}
                  >
                    {column.title}
                  </div>
                ))}
              </div>
            </div>

            {/* Corpo virtualizado */}
            <div
              ref={parentRef}
              className="bg-white overflow-auto"
              style={{
                height: `${Math.min(500, validData.length * rowHeight)}px`,
              }}
            >
              <div
                style={{
                  height: `${virtualizer.getTotalSize()}px`,
                  width: "100%",
                  position: "relative",
                }}
              >
                {items.map((virtualRow) => {
                  const item = validData[virtualRow.index];
                  if (!item) return null;

                  return (
                    <div
                      key={item.id || virtualRow.index}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex h-full items-center">
                        {columns.map((column) => {
                          try {
                            return (
                              <div
                                key={`${item.id || virtualRow.index}-${String(column.key)}`}
                                className="px-6 py-4 flex-shrink-0 overflow-hidden text-ellipsis"
                                style={{
                                  width: column.width || "auto",
                                  minWidth: "120px",
                                }}
                              >
                                {column.render
                                  ? column.render(
                                      item[column.key as keyof T],
                                      item,
                                    )
                                  : item[column.key as keyof T] != null
                                    ? String(item[column.key as keyof T])
                                    : "-"}
                              </div>
                            );
                          } catch (error) {
                            logger.error(
                              `Erro ao renderizar coluna ${String(column.key)}`,
                              error,
                              "VirtualizedDataTable",
                            );
                            return (
                              <div
                                key={`${item.id || virtualRow.index}-${String(column.key)}`}
                                className="px-6 py-4 flex-shrink-0 text-red-500"
                                style={{
                                  width: column.width || "auto",
                                  minWidth: "120px",
                                }}
                              >
                                Erro
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Footer com info */}
            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-sm text-gray-600">
              Mostrando {items.length} de {validData.length} items
              {validData.length > 100 && (
                <span className="ml-2 text-xs text-gray-500">
                  (Virtualizado para performance)
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Hook para detectar se deve usar virtualização
 */
export function useTableVirtualization(dataLength: number, threshold = 50) {
  return {
    shouldVirtualize: dataLength > threshold,
    estimatedRows: Math.min(dataLength, 10),
  };
}
