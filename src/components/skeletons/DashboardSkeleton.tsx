/**
 * Dashboard Skeleton
 *
 * Loading state específico para a página de Dashboard.
 * Replica a estrutura visual do dashboard real para melhor UX.
 */

import React from 'react';
import { SkeletonStatCard, SkeletonChart, SkeletonTable } from '../ui/Skeleton';

export const DashboardSkeleton: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`space-y-6 animate-pulse ${className}`}>
      {/* Header com título */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-96" />
      </div>

      {/* Cards de Métricas - Grid 4 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Seção de Gráficos - 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por Mês */}
        <SkeletonChart height={300} />

        {/* Vendas por Marca */}
        <SkeletonChart height={300} />
      </div>

      {/* Seção de Tabelas - 2 colunas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Vendedores */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-200 rounded-full" />
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-32 mb-1" />
                    <div className="h-3 bg-gray-200 rounded w-20" />
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>

        {/* Financiamentos por Banco */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="flex items-center space-x-2">
                  <div className="h-4 bg-gray-200 rounded w-12" />
                  <div className="h-4 bg-gray-200 rounded w-16" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton para seção individual do Dashboard
 * Útil para loading progressivo de cada seção
 */
export const DashboardSectionSkeleton: React.FC<{
  type: 'stats' | 'chart' | 'table' | 'list';
  className?: string;
}> = ({ type, className = '' }) => {
  switch (type) {
    case 'stats':
      return (
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
          <SkeletonStatCard />
        </div>
      );

    case 'chart':
      return <SkeletonChart className={className} height={300} />;

    case 'table':
      return <SkeletonTable className={className} rows={5} columns={3} />;

    case 'list':
      return (
        <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
          <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};

export default DashboardSkeleton;
