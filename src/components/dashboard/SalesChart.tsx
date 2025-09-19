import React from "react";
import { Line } from "react-chartjs-2";
import ChartContainer from "@/components/ui/ChartContainer";

export default function SalesChart() {
  // Dados para o gráfico de vendas mensais
  const salesData = {
    labels: [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ],
    datasets: [
      {
        label: "Carros",
        data: [65, 59, 80, 81, 56, 55, 72, 68, 75, 82, 90, 95],
        borderColor: "rgb(2, 132, 199)",
        backgroundColor: "rgba(2, 132, 199, 0.1)",
        tension: 0.3,
        fill: true,
      },
      {
        label: "Motos",
        data: [28, 32, 40, 42, 38, 44, 46, 50, 48, 52, 58, 62],
        borderColor: "rgb(14, 165, 233)",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Configurações do gráfico de vendas
  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Vendas Mensais",
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
      <Line data={salesData} options={salesOptions} />
    </ChartContainer>
  );
}
