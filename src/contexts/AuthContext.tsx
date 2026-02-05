"use client";

// Importar storage PRIMEIRO para garantir inicialização
import { storage } from "@/utils/storage";
import { logger } from "@/utils/logger";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Primeiro useEffect: apenas marcar como montado
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Segundo useEffect: acessar storage APENAS após montagem
  useEffect(() => {
    // Não fazer nada até estar montado no cliente
    if (!isMounted) {
      logger.debug("Aguardando montagem no cliente", undefined, "AuthContext");
      return;
    }

    try {
      logger.debug("Verificando token no storage", undefined, "AuthContext");

      const storedToken = storage.getItem("jwt_token");
      if (storedToken) {
        logger.info("Token encontrado no storage", undefined, "AuthContext");
        setToken(storedToken);
        setIsAuthenticated(true);
      } else {
        logger.debug(
          "Nenhum token encontrado no storage",
          undefined,
          "AuthContext",
        );
      }
    } catch (error) {
      logger.error("Erro ao acessar storage", error, "AuthContext");
    }
  }, [isMounted]);

  const login = (newToken: string) => {
    logger.info("Login realizado", { hasToken: !!newToken }, "AuthContext");
    storage.setItem("jwt_token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    logger.debug(
      "Estado de autenticação atualizado",
      { isAuthenticated: true },
      "AuthContext",
    );
  };

  const logout = () => {
    logger.info("Logout realizado", undefined, "AuthContext");
    storage.removeItem("jwt_token");
    setToken(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
