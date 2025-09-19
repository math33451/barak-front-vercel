import React from "react";
import { Line } from "react-chartjs-2";
import ChartContainer from "@/components/ui/ChartContainer";
import { Sale } from "@/types";

interface SalesChartProps {
  salesData: Sale[];
}

export default function SalesChart({ salesData }: SalesChartProps) {
  if (!salesData || salesData.length === 0) {
    return (
      <ChartContainer>
        <div className="flex items-center justify-center h-full text-gray-500">
          No sales data available.
        </div>
      </ChartContainer>
    );
  }

  const chartData = {
    labels: salesData.map(sale => new Date(sale.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' })),
    datasets: [
      {
        label: "Vendas",
        data: salesData.map(sale => sale.amount),
        borderColor: "rgb(2, 132, 199)",
        backgroundColor: "rgba(2, 132, 199, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vendas Recentes",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#334155",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#334155",
        },
      },
    },
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    elements: {
      line: {
        borderWidth: 2,
      },
      point: {
        radius: 3,
        hoverRadius: 5,
      },
    },
  };

  return (
    <ChartContainer>
      <Line data={chartData} options={salesOptions} />
    </ChartContainer>
  );
}
