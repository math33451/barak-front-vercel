import React from "react";

type StatCardProps = {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
    icon?: React.ReactNode;
  };
  footer?: string;
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  footer,
}: StatCardProps) {
  return (
    <div className="card p-5">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted">{title}</p>
          <h3 className="text-2xl font-bold text-heading mt-1">{value}</h3>
          {trend && (
            <p
              className={`text-sm mt-1 flex items-center ${
                trend.isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {trend.icon}
              {trend.value}
            </p>
          )}
          {footer && <p className="text-sm text-muted mt-1">{footer}</p>}
        </div>
        <div className="bg-primary bg-opacity-10 p-3 rounded-md">{icon}</div>
      </div>
    </div>
  );
}
