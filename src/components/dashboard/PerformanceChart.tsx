import React from "react";
import { Bar } from "react-chartjs-2";
import ChartContainer from "@/components/ui/ChartContainer";

export default function PerformanceChart() {
  // Dados para o gráfico de desempenho dos vendedores
  const performanceData = {
    labels: [
      "Ana Silva",
      "Carlos Mendes",
      "Júlia Santos",
      "Rafael Oliveira",
      "Bianca Costa",
    ],
    datasets: [
      {
        label: "Carros Vendidos",
        data: [18, 14, 12, 15, 9],
        backgroundColor: "rgba(2, 132, 199, 0.8)",
        borderColor: "rgba(2, 132, 199, 1)",
        borderWidth: 1,
      },
      {
        label: "Motos Vendidas",
        data: [7, 12, 5, 3, 8],
        backgroundColor: "rgba(56, 189, 248, 0.8)",
        borderColor: "rgba(56, 189, 248, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Configurações do gráfico de desempenho
  const performanceOptions = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Desempenho da Equipe de Vendas (Último Trimestre)",
        color: "#0f172a",
        font: {
          size: 16,
          weight: "bold" as const,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        stacked: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
        },
        ticks: {
          color: "#334155",
        },
      },
      y: {
        stacked: true,
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
    <ChartContainer title="Desempenho da Equipe">
      <Bar data={performanceData} options={performanceOptions} />
    </ChartContainer>
  );
}
