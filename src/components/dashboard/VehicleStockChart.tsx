import React from "react";
import { Bar } from "react-chartjs-2";
import ChartContainer from "@/components/ui/ChartContainer";
import { BrandDistribution } from "@/types";

interface VehicleStockChartProps {
  stockData: BrandDistribution[];
}

export default function VehicleStockChart({ stockData }: VehicleStockChartProps) {
  const chartData = {
    labels: stockData.map(item => item.brand),
    datasets: [
      {
        label: "Quantidade em Estoque",
        data: stockData.map(item => item.count),
        backgroundColor: [
          "rgba(2, 132, 199, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(56, 189, 248, 0.8)",
          "rgba(12, 74, 110, 0.8)",
          "rgba(125, 211, 252, 0.8)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const vehicleOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Estoque por Marca",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "bold" as const, // Fixed here
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
  };

  return (
    <ChartContainer>
      <Bar data={chartData} options={vehicleOptions} />
    </ChartContainer>
  );
}
