"use client";

import React from "react";

interface DonutChartProps {
  data: Array<{ label: string; value: number; color: string }>;
  title: string;
  total?: number;
  centerLabel?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  data,
  title,
  total,
  centerLabel,
}) => {
  // Calculate angles for each segment
  const totalValue = total || data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  const segments = data.map((item) => {
    const angle = (item.value / totalValue) * 360;
    const segment = {
      ...item,
      startAngle: cumulativeAngle,
      angle: angle,
    };
    cumulativeAngle += angle;
    return segment;
  });

  // SVG circle properties
  const radius = 80;
  const strokeWidth = 20;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      <div className="flex items-center justify-between">
        {/* Donut Chart */}
        <div className="relative">
          <svg
            height={radius * 2}
            width={radius * 2}
            className="transform -rotate-90"
          >
            {/* Background circle */}
            <circle
              cx={radius}
              cy={radius}
              r={normalizedRadius}
              stroke="#f3f4f6"
              fill="transparent"
              strokeWidth={strokeWidth}
            />

            {/* Data segments */}
            {segments.map((segment, index) => {
              const strokeDasharray = `${
                (segment.angle / 360) * circumference
              } ${circumference}`;
              const strokeDashoffset =
                circumference - (segment.startAngle / 360) * circumference;

              return (
                <circle
                  key={index}
                  cx={radius}
                  cy={radius}
                  r={normalizedRadius}
                  stroke={segment.color}
                  fill="transparent"
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={-strokeDashoffset}
                  className="transition-all duration-300 hover:opacity-80"
                />
              );
            })}
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-gray-900">{totalValue}</div>
            {centerLabel && (
              <div className="text-sm text-gray-500">{centerLabel}</div>
            )}
          </div>
        </div>

        {/* Legend */}
        <div className="ml-6 space-y-2">
          {data.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-gray-600">{item.label}</span>
              <span className="text-sm font-medium text-gray-900">
                {item.value}
              </span>
              <span className="text-xs text-gray-400">
                ({Math.round((item.value / totalValue) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonutChart;
