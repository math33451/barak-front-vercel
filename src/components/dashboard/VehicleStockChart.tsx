import React from "react";
import { Bar } from "react-chartjs-2";
import ChartContainer from "@/components/ui/ChartContainer";

export default function VehicleStockChart() {
  // Dados para o gráfico de categorias de veículos
  const vehicleData = {
    labels: [
      "SUVs",
      "Sedans",
      "Hatches",
      "Picapes",
      "Esportivos",
      "Motos Street",
      "Motos Trail",
      "Motos Sport",
    ],
    datasets: [
      {
        label: "Quantidade em Estoque",
        data: [42, 38, 25, 30, 12, 28, 22, 15],
        backgroundColor: [
          "rgba(2, 132, 199, 0.8)",
          "rgba(14, 165, 233, 0.8)",
          "rgba(56, 189, 248, 0.8)",
          "rgba(12, 74, 110, 0.8)",
          "rgba(125, 211, 252, 0.8)",
          "rgba(2, 132, 199, 0.6)",
          "rgba(14, 165, 233, 0.6)",
          "rgba(56, 189, 248, 0.6)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configurações do gráfico de categorias
  const vehicleOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Estoque por Categoria",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "bold",
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
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  };

  return (
    <ChartContainer>
      <Bar data={vehicleData} options={vehicleOptions} />
    </ChartContainer>
  );
}
