"use client";

import { Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { logger } from "@/utils/logger";

// Skeleton components para loading states
const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
    <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
  </div>
);

const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="h-64 bg-gray-100 rounded"></div>
  </div>
);

const TableSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-16"></div>
        </div>
      ))}
    </div>
  </div>
);

const DonutChartSkeleton = () => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
    <div className="flex items-center justify-center">
      <div className="h-48 w-48 bg-gray-100 rounded-full"></div>
    </div>
  </div>
);

// Error fallback component
interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback = ({ error, resetErrorBoundary }: ErrorFallbackProps) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0">
        <svg
          className="h-5 w-5 text-red-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-medium text-red-800">
          Erro ao carregar dados
        </h3>
        <p className="text-sm text-red-700 mt-1">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  </div>
);

// Wrapper components para cada seção
interface SectionWrapperProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  name?: string;
}

const SectionWrapper = ({ children, fallback, name }: SectionWrapperProps) => (
  <ErrorBoundary
    FallbackComponent={ErrorFallback}
    onError={(error) => {
      logger.error(
        `Erro na seção ${name || "desconhecida"}`,
        error,
        "Dashboard",
      );
    }}
  >
    <Suspense fallback={fallback}>{children}</Suspense>
  </ErrorBoundary>
);

// Seções otimizadas do Dashboard
export const HeaderSection = ({ children }: { children: React.ReactNode }) => (
  <SectionWrapper
    name="Header"
    fallback={
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 animate-pulse">
        <div className="h-8 bg-blue-500/50 rounded w-1/3 mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="text-center">
              <div className="h-10 bg-blue-500/50 rounded mb-2"></div>
              <div className="h-4 bg-blue-500/50 rounded w-2/3 mx-auto"></div>
            </div>
          ))}
        </div>
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const StatsCardsSection = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SectionWrapper
    name="Stats Cards"
    fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const MetricsSection = ({ children }: { children: React.ReactNode }) => (
  <SectionWrapper
    name="Metrics"
    fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const KPIsSection = ({ children }: { children: React.ReactNode }) => (
  <SectionWrapper
    name="KPIs"
    fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const WeeklyStatsSection = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SectionWrapper
    name="Weekly Stats"
    fallback={
      <div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i}>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded mb-1"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const ChartsSection = ({ children }: { children: React.ReactNode }) => (
  <SectionWrapper
    name="Charts"
    fallback={
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton />
        </div>
        <div>
          <DonutChartSkeleton />
        </div>
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const ProgressSection = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SectionWrapper
    name="Progress"
    fallback={
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        </div>
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const AnalysisSection = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <SectionWrapper
    name="Analysis"
    fallback={
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DonutChartSkeleton />
        <DonutChartSkeleton />
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

export const BottomSection = ({ children }: { children: React.ReactNode }) => (
  <SectionWrapper
    name="Bottom Section"
    fallback={
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TableSkeleton />
        <TableSkeleton />
        <TableSkeleton />
      </div>
    }
  >
    {children}
  </SectionWrapper>
);

// Export all at once for convenience
export const DashboardSections = {
  Header: HeaderSection,
  StatsCards: StatsCardsSection,
  Metrics: MetricsSection,
  KPIs: KPIsSection,
  WeeklyStats: WeeklyStatsSection,
  Charts: ChartsSection,
  Progress: ProgressSection,
  Analysis: AnalysisSection,
  Bottom: BottomSection,
};
