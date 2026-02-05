"use client";

// Importar storage PRIMEIRO para garantir inicialização
import "@/utils/storage";

import { ReactNode, useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { QueryProvider } from "@/providers/QueryProvider";

interface ClientProvidersProps {
  children: ReactNode;
}

/**
 * ClientProviders - Wrapper para todos os providers client-side
 * Garante que todos os providers sejam executados apenas no cliente
 * Previne problemas com localStorage durante SSR
 */
export function ClientProviders({ children }: ClientProvidersProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Não renderizar nada no servidor para evitar problemas com localStorage
  if (!mounted) {
    return null;
  }

  return (
    <QueryProvider>
      <AuthProvider>{children}</AuthProvider>
    </QueryProvider>
  );
}
