"use client";

import React from "react";

interface RecentActivityProps {
  activities: Array<{
    id: string;
    type: "sale" | "client" | "vehicle" | "financing";
    title: string;
    subtitle: string;
    timestamp: string;
    value?: string;
  }>;
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const getActivityIcon = (type: string) => {
    const iconClasses =
      "w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium";

    switch (type) {
      case "sale":
        return <div className={`${iconClasses} bg-green-500`}>V</div>;
      case "client":
        return <div className={`${iconClasses} bg-blue-500`}>C</div>;
      case "vehicle":
        return <div className={`${iconClasses} bg-purple-500`}>🚗</div>;
      case "financing":
        return <div className={`${iconClasses} bg-orange-500`}>💰</div>;
      default:
        return <div className={`${iconClasses} bg-gray-500`}>?</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Atividades Recentes
      </h3>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhuma atividade recente
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              {getActivityIcon(activity.type)}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.title}
                </p>
                <p className="text-sm text-gray-500">{activity.subtitle}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {activity.timestamp}
                </p>
              </div>

              {activity.value && (
                <div className="flex-shrink-0">
                  <span className="text-sm font-medium text-gray-900">
                    {activity.value}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
