"use client";

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

  useEffect(() => {
    console.log("🔄 AuthContext useEffect - verificando token no localStorage");
    const storedToken = localStorage.getItem("jwt_token");
    if (storedToken) {
      console.log("✅ Token encontrado no localStorage");
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      console.log("❌ Nenhum token encontrado no localStorage");
    }
  }, []);

  const login = (newToken: string) => {
    console.log(
      "🔐 Login chamado com token:",
      newToken ? "token válido" : "token inválido"
    );
    localStorage.setItem("jwt_token", newToken);
    setToken(newToken);
    setIsAuthenticated(true);
    console.log("✅ Estado de autenticação atualizado:", true);
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
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
