"use client";

import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Info,
  XCircle,
  Clock,
} from "lucide-react";

interface Alert {
  id: string;
  type: "success" | "warning" | "error" | "info";
  title: string;
  message: string;
  timestamp?: Date;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface AlertsPanelProps {
  alerts: Alert[];
  maxVisible?: number;
  className?: string;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  alerts,
  maxVisible = 5,
  className = "",
}) => {
  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "success":
        return "border-l-green-500";
      case "warning":
        return "border-l-yellow-500";
      case "error":
        return "border-l-red-500";
      default:
        return "border-l-blue-500";
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50";
      case "warning":
        return "bg-yellow-50";
      case "error":
        return "bg-red-50";
      default:
        return "bg-blue-50";
    }
  };

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return "";
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (minutes < 1) return "Agora";
    if (minutes < 60) return `${minutes}min atrás`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h atrás`;
    const days = Math.floor(hours / 24);
    return `${days}d atrás`;
  };

  const visibleAlerts = alerts.slice(0, maxVisible);

  if (visibleAlerts.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Alertas e Notificações
        </h3>
        <div className="text-center text-gray-500 py-8">
          <CheckCircle className="w-12 h-12 mx-auto text-green-500 mb-3" />
          <p>Tudo está funcionando perfeitamente!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Alertas e Notificações
        </h3>
        {alerts.length > maxVisible && (
          <span className="text-sm text-gray-500">
            +{alerts.length - maxVisible} mais
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        {visibleAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-4 rounded-lg border-l-4 ${getBorderColor(
              alert.type
            )} ${getBackgroundColor(alert.type)} transition-all hover:shadow-sm`}
          >
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 mt-0.5">
                {getIcon(alert.type)}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {alert.title}
                  </h4>
                  {alert.timestamp && (
                    <div className="flex items-center text-xs text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatTimestamp(alert.timestamp)}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.message}</p>
                {alert.action && (
                  <button
                    onClick={alert.action.onClick}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {alert.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Componente para gerar alertas baseados nos dados do dashboard
export const useBusinessAlerts = () => {
  const generateAlerts = (data: {
    totalVehicles?: number;
    conversionRate?: number;
    totalSales?: number;
    newClients?: number;
    averageTicket?: number;
  }): Alert[] => {
    const alerts: Alert[] = [];

    // Alerta de estoque baixo - baseado em dados reais
    if (data?.totalVehicles && data.totalVehicles < 15) {
      alerts.push({
        id: "low-stock",
        type: data.totalVehicles < 5 ? "error" : "warning",
        title: data.totalVehicles < 5 ? "Estoque Crítico!" : "Estoque Baixo",
        message: `${data.totalVehicles} veículos em estoque. ${data.totalVehicles < 5 ? 'Reposição urgente necessária!' : 'Considere reabastecer.'}`,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        action: {
          label: "Ver Estoque",
          onClick: () => {},
        },
      });
    }

    // Alerta de conversão alta - baseado em dados reais
    if (data?.conversionRate && data.conversionRate >= 70) {
      alerts.push({
        id: "high-conversion",
        type: "success",
        title: "Excelente Performance!",
        message: `Taxa de conversão de ${data.conversionRate.toFixed(1)}% está acima da meta!`,
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 min atrás
        action: {
          label: "Ver Relatório",
          onClick: () => {},
        },
      });
    } else if (data?.conversionRate && data.conversionRate < 30) {
      // Alerta de conversão baixa - baseado em dados reais
      alerts.push({
        id: "low-conversion",
        type: "warning",
        title: "Taxa de Conversão Baixa",
        message: `Taxa atual de ${data.conversionRate.toFixed(1)}% está abaixo do esperado (30%+).`,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        action: {
          label: "Analisar Leads",
          onClick: () => {},
        },
      });
    }

    // Alerta de ticket médio alto - baseado em dados reais
    if (data?.averageTicket && data.averageTicket > 50000) {
      alerts.push({
        id: "high-ticket",
        type: "success",
        title: "Ticket Médio Elevado!",
        message: `Ticket médio de R$ ${data.averageTicket.toLocaleString()} está excelente!`,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hora atrás
      });
    }

    // Alerta de novos clientes - baseado em dados reais
    if (data?.newClients && data.newClients > 0) {
      alerts.push({
        id: "new-clients",
        type: "info",
        title: `${data.newClients} Novos Clientes`,
        message: data.newClients === 1 
          ? "1 novo cliente cadastrado hoje."
          : `${data.newClients} novos clientes cadastrados recentemente.`,
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 min atrás
        action: {
          label: "Ver Clientes",
          onClick: () => {},
        },
      });
    }

    // Alerta genérico quando tudo está bem
    if (alerts.length === 0) {
      alerts.push({
        id: "all-good",
        type: "success",
        title: "Sistema Funcionando Bem",
        message: "Todas as métricas estão dentro do esperado.",
        timestamp: new Date(),
      });
    }

    return alerts.slice(0, 5); // Limitar a 5 alertas
  };

  return { generateAlerts };
};

export default AlertsPanel;