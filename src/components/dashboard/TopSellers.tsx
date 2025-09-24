"use client";

import React from "react";
import { ArrowRight } from "lucide-react";

interface TopSellersProps {
  sellers: Array<{
    id?: string;
    name: string;
    sales: number;
    revenue?: number;
    avatar?: string;
  }>;
  onViewAll?: () => void;
}

const TopSellers: React.FC<TopSellersProps> = ({ sellers, onViewAll }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Top Vendedores</h3>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Ver todos
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sellers.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            Nenhum vendedor encontrado
          </p>
        ) : (
          sellers.slice(0, 5).map((seller, index) => (
            <div
              key={seller.id || index}
              className="flex items-center space-x-3"
            >
              {/* Ranking */}
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {index + 1}
                </span>
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {seller.avatar ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${seller.avatar})` }}
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {seller.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {seller.name}
                </p>
                <p className="text-xs text-gray-500">{seller.sales} vendas</p>
              </div>

              {/* Revenue */}
              {seller.revenue && (
                <div className="flex-shrink-0">
                  <p className="text-sm font-medium text-gray-900">
                    R$ {seller.revenue.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopSellers;
