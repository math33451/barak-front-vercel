"use client";

import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  icon,
  onClick,
  className = "",
}) => {
  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <div
      className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md ${
        onClick ? "cursor-pointer hover:border-blue-200" : ""
      } ${className}`}
      onClick={handleClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>

          {change && (
            <div className="flex items-center mt-2">
              {change.isPositive ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ml-1 ${
                  change.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {change.value}
              </span>
            </div>
          )}
        </div>

        {icon && (
          <div className="flex-shrink-0 ml-4">
            <div className="p-2 bg-blue-50 rounded-lg">{icon}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricCard;
