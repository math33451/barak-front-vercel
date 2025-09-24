"use client";

interface SalesChartProps {
  data: Array<{ month: string; sales: number }>;
  isLoading?: boolean;
  error?: Error | null;
}

export default function SalesChart({
  data,
  isLoading,
  error,
}: SalesChartProps) {
  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Vendas por Mês</h3>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Vendas por Mês</h3>
        <div className="h-64 flex items-center justify-center text-red-500">
          Erro ao carregar gráfico: {error.message}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold mb-4">Vendas por Mês</h3>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Nenhum dado de vendas disponível
        </div>
      </div>
    );
  }

  // Encontrar o valor máximo para escalonamento
  const maxSales = Math.max(...data.map((item) => item.sales));
  const scale = maxSales > 0 ? 200 / maxSales : 1; // altura máxima de 200px

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Vendas por Mês</h3>
      <div className="h-64">
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, index) => {
            const barHeight = item.sales * scale;
            const monthLabel = item.month.split("-")[1]; // Pegar só o mês (MM)

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="relative flex-1 flex items-end">
                  <div
                    className="w-full bg-blue-500 rounded-t-sm transition-all duration-300 hover:bg-blue-600"
                    style={{ height: `${Math.max(barHeight, 4)}px` }}
                    title={`${item.month}: ${item.sales} vendas`}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-600 text-center">
                  {monthLabel}
                </div>
                <div className="text-xs font-medium text-gray-800">
                  {item.sales}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-4 text-sm text-gray-600 text-center">
        Total: {data.reduce((sum, item) => sum + item.sales, 0)} vendas
      </div>
    </div>
  );
}
