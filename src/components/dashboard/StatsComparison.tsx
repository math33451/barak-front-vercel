"use client";

import React from "react";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

interface ComparisonStats {
  title: string;
  current: number;
  previous: number;
  period: string;
  unit?: string;
  icon?: React.ReactNode;
}

interface StatsComparisonProps {
  stats: ComparisonStats[];
  className?: string;
}

const StatsComparison: React.FC<StatsComparisonProps> = ({
  stats,
  className = "",
}) => {
  const getPercentageChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return null;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}
    >
      {stats.map((stat, index) => {
        const percentageChange = getPercentageChange(
          stat.current,
          stat.previous
        );

        return (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {stat.icon && (
                  <div className="p-2 bg-blue-50 rounded-lg">{stat.icon}</div>
                )}
                <h3 className="text-sm font-medium text-gray-600">
                  {stat.title}
                </h3>
              </div>
              {getChangeIcon(percentageChange)}
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-bold text-gray-900">
                {stat.current.toLocaleString()}
                {stat.unit && (
                  <span className="text-lg text-gray-500 ml-1">
                    {stat.unit}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <Calendar className="w-3 h-3 inline mr-1" />
                  {stat.period}
                </div>
                <div
                  className={`text-sm font-medium ${getChangeColor(
                    percentageChange
                  )}`}
                >
                  {percentageChange > 0 ? "+" : ""}
                  {percentageChange.toFixed(1)}%
                </div>
              </div>

              <div className="text-xs text-gray-400">
                vs {stat.previous.toLocaleString()}
                {stat.unit} anterior
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsComparison;
