/**
 * Componentes de Skeleton para Loading States
 *
 * Fornece componentes reutilizáveis para criar loading states profissionais
 * em todo o aplicativo. Usa animações suaves e respeita o design system.
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Componente base de Skeleton
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  width,
  height,
  variant = 'rectangular',
  animation = 'pulse',
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700';

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%]',
    none: '',
  };

  const styles: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={styles}
      role="status"
      aria-label="Carregando..."
    />
  );
};

/**
 * Skeleton para texto (linha única)
 */
export const SkeletonText: React.FC<{
  className?: string;
  width?: string | number;
}> = ({ className = '', width = '100%' }) => (
  <Skeleton
    variant="text"
    height={16}
    width={width}
    className={className}
  />
);

/**
 * Skeleton para parágrafos (múltiplas linhas)
 */
export const SkeletonParagraph: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className = '' }) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonText
        key={i}
        width={i === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
);

/**
 * Skeleton para avatar circular
 */
export const SkeletonAvatar: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 40, className = '' }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);

/**
 * Skeleton para card genérico
 */
export const SkeletonCard: React.FC<{
  className?: string;
  hasImage?: boolean;
  lines?: number;
}> = ({ className = '', hasImage = false, lines = 3 }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {hasImage && (
      <Skeleton
        variant="rounded"
        height={200}
        className="mb-4"
      />
    )}
    <SkeletonText width="60%" className="mb-3" />
    <SkeletonParagraph lines={lines} />
  </div>
);

/**
 * Skeleton para botão
 */
export const SkeletonButton: React.FC<{
  className?: string;
  width?: string | number;
  fullWidth?: boolean;
}> = ({ className = '', width = 100, fullWidth = false }) => (
  <Skeleton
    variant="rounded"
    height={40}
    width={fullWidth ? '100%' : width}
    className={className}
  />
);

/**
 * Skeleton para input/form field
 */
export const SkeletonInput: React.FC<{
  className?: string;
  label?: boolean;
}> = ({ className = '', label = false }) => (
  <div className={className}>
    {label && <SkeletonText width={80} className="mb-2" />}
    <Skeleton variant="rounded" height={40} />
  </div>
);

/**
 * Skeleton para tabela
 */
export const SkeletonTable: React.FC<{
  rows?: number;
  columns?: number;
  className?: string;
  showHeader?: boolean;
}> = ({ rows = 5, columns = 4, className = '', showHeader = true }) => (
  <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
    {/* Header */}
    {showHeader && (
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <SkeletonText key={i} width="80%" />
          ))}
        </div>
      </div>
    )}

    {/* Rows */}
    <div className="divide-y divide-gray-200">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="px-6 py-4">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <SkeletonText key={colIndex} width={`${60 + Math.random() * 30}%`} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Skeleton para lista de itens
 */
export const SkeletonList: React.FC<{
  items?: number;
  className?: string;
  hasAvatar?: boolean;
}> = ({ items = 5, className = '', hasAvatar = false }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4">
        {hasAvatar && <SkeletonAvatar size={48} />}
        <div className="flex-1">
          <SkeletonText width="40%" className="mb-2" />
          <SkeletonText width="80%" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Skeleton para stat card (métricas do dashboard)
 */
export const SkeletonStatCard: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <SkeletonText width={100} />
      <Skeleton variant="circular" width={40} height={40} />
    </div>
    <Skeleton variant="text" width={120} height={32} className="mb-2" />
    <SkeletonText width={150} />
  </div>
);

/**
 * Skeleton para gráfico/chart
 */
export const SkeletonChart: React.FC<{
  className?: string;
  height?: number;
}> = ({ className = '', height = 300 }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    <SkeletonText width={150} className="mb-6" />
    <Skeleton
      variant="rounded"
      height={height}
    />
  </div>
);

/**
 * Skeleton para formulário completo
 */
export const SkeletonForm: React.FC<{
  fields?: number;
  className?: string;
  showSubmitButton?: boolean;
}> = ({ fields = 4, className = '', showSubmitButton = true }) => (
  <div className={`space-y-6 ${className}`}>
    {Array.from({ length: fields }).map((_, i) => (
      <SkeletonInput key={i} label />
    ))}
    {showSubmitButton && (
      <SkeletonButton fullWidth className="mt-8" />
    )}
  </div>
);

/**
 * Skeleton para página inteira
 */
export const SkeletonPage: React.FC<{
  className?: string;
}> = ({ className = '' }) => (
  <div className={`space-y-6 ${className}`}>
    {/* Header */}
    <div className="mb-8">
      <Skeleton variant="text" width={200} height={32} className="mb-2" />
      <SkeletonText width={300} />
    </div>

    {/* Content */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </div>

    <SkeletonChart />
    <SkeletonTable />
  </div>
);

// Export default com todos os componentes
const Skeletons = {
  Skeleton,
  SkeletonText,
  SkeletonParagraph,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonButton,
  SkeletonInput,
  SkeletonTable,
  SkeletonList,
  SkeletonStatCard,
  SkeletonChart,
  SkeletonForm,
  SkeletonPage,
};

export default Skeletons;
