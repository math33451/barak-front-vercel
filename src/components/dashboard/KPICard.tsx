"use client";

import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  previousValue?: number;
  target?: number;
  unit?: string;
  className?: string;
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  previousValue,
  target,
  unit = "",
  className = "",
  onClick,
}) => {
  // Calcular variação percentual
  const getPercentageChange = () => {
    if (!previousValue || typeof value !== "number") return null;
    return ((value - previousValue) / previousValue) * 100;
  };

  // Calcular progresso da meta
  const getTargetProgress = () => {
    if (!target || typeof value !== "number") return null;
    return (value / target) * 100;
  };

  const percentageChange = getPercentageChange();
  const targetProgress = getTargetProgress();

  const getTrendIcon = () => {
    if (!percentageChange) return <Minus className="w-4 h-4" />;
    if (percentageChange > 0) return <TrendingUp className="w-4 h-4" />;
    if (percentageChange < 0) return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (!percentageChange) return "text-gray-500";
    if (percentageChange > 0) return "text-green-600";
    if (percentageChange < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md ${
        onClick ? "cursor-pointer hover:border-blue-200" : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {percentageChange !== null && (
          <div className={`flex items-center ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="text-xs font-medium ml-1">
              {Math.abs(percentageChange).toFixed(1)}%
            </span>
          </div>
        )}
      </div>

      <div className="mb-3">
        <div className="text-3xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
          {unit && <span className="text-lg text-gray-500 ml-1">{unit}</span>}
        </div>
      </div>

      {target && (
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Meta</span>
            <span className="text-xs text-gray-700">
              {target.toLocaleString()}
              {unit}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                targetProgress && targetProgress >= 100
                  ? "bg-green-500"
                  : targetProgress && targetProgress >= 75
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
              style={{
                width: `${Math.min(targetProgress || 0, 100)}%`,
              }}
            />
          </div>
          <div className="text-right">
            <span className="text-xs text-gray-400">
              {targetProgress?.toFixed(0)}% da meta
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default KPICard;
