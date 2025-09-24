"use client";

import React from "react";

interface ProgressBarProps {
  label: string;
  value: number;
  max: number;
  color?: string;
  showPercentage?: boolean;
  showValues?: boolean;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
  className?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  label,
  value,
  max,
  color = "blue",
  showPercentage = true,
  showValues = false,
  size = "md",
  animate = true,
  className = "",
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClass = (color: string) => {
    const colors = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      yellow: "bg-yellow-500",
      red: "bg-red-500",
      purple: "bg-purple-500",
      orange: "bg-orange-500",
      indigo: "bg-indigo-500",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getBackgroundColorClass = (color: string) => {
    const colors = {
      blue: "bg-blue-100",
      green: "bg-green-100",
      yellow: "bg-yellow-100",
      red: "bg-red-100",
      purple: "bg-purple-100",
      orange: "bg-orange-100",
      indigo: "bg-indigo-100",
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getSizeClass = (size: string) => {
    const sizes = {
      sm: "h-1.5",
      md: "h-2",
      lg: "h-3",
    };
    return sizes[size as keyof typeof sizes] || sizes.md;
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          {showValues && (
            <span>
              {value.toLocaleString()}/{max.toLocaleString()}
            </span>
          )}
          {showPercentage && (
            <span className="font-medium">{percentage.toFixed(0)}%</span>
          )}
        </div>
      </div>
      <div className={`w-full ${getBackgroundColorClass(color)} rounded-full ${getSizeClass(size)}`}>
        <div
          className={`${getSizeClass(size)} rounded-full ${
            animate ? "transition-all duration-500 ease-out" : ""
          } ${getColorClass(color)}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {/* Milestone indicators */}
      {percentage >= 100 && (
        <div className="flex items-center mt-1">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
          <span className="text-xs text-green-600 font-medium">Meta alcançada!</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;