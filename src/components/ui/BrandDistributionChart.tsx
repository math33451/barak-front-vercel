import React from "react";
import { Doughnut } from "react-chartjs-2";
import { TooltipItem } from "chart.js";
import ChartContainer from "@/components/ui/ChartContainer";
import { BrandDistribution } from "@/types";

interface BrandDistributionChartProps {
  brandData: BrandDistribution[];
}

export default function BrandDistributionChart({ brandData }: BrandDistributionChartProps) {
  const chartData = {
    labels: brandData.map(item => item.brand),
    datasets: [
      {
        data: brandData.map(item => item.count),
        backgroundColor: [
          "rgba(2, 132, 199, 0.9)",
          "rgba(14, 165, 233, 0.9)",
          "rgba(56, 189, 248, 0.9)",
          "rgba(186, 230, 253, 0.9)",
          "rgba(3, 105, 161, 0.9)",
          "rgba(125, 211, 252, 0.9)",
          "rgba(12, 74, 110, 0.9)",
          "rgba(224, 242, 254, 0.9)",
        ],
        borderColor: Array(brandData.length).fill("rgba(255, 255, 255, 0.8)"),
        borderWidth: 2,
        hoverOffset: 6,
      },
    ],
  };

  const brandOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
        labels: {
          font: {
            size: 10,
          },
          padding: 8,
          usePointStyle: true,
          pointStyle: "circle",
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: TooltipItem<"doughnut">) {
            const label = context.label || "";
            const value = context.formattedValue || "";
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = Math.round(((context.raw as number) / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          },
        },
      },
    },
    cutout: "60%",
    animation: {
      animateScale: true,
    },
  };

  return (
    <ChartContainer title="Marcas mais Populares">
      <div className="h-48 md:h-56 lg:h-64 mx-auto relative">
        <Doughnut data={chartData} options={brandOptions} />
      </div>
    </ChartContainer>
  );
}