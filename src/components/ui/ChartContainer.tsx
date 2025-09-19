import React from "react";

type ChartContainerProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export default function ChartContainer({
  children,
  title,
  className = "",
}: ChartContainerProps) {
  return (
    <div className={`card p-5 ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-[color:var(--heading)] mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
