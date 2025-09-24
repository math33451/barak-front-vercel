import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "@/services/AuthService";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDTO } from "@/types";

interface LoginViewModel {
  credentials: LoginDTO;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export const useLoginViewModel = (): LoginViewModel => {
  const [credentials, setCredentials] = useState<LoginDTO>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validações no frontend antes de enviar
      if (!credentials.email.trim()) {
        throw new Error("Por favor, digite seu email");
      }

      if (!credentials.password.trim()) {
        throw new Error("Por favor, digite sua senha");
      }

      if (!credentials.email.includes("@")) {
        throw new Error("Por favor, digite um email válido");
      }

      if (credentials.password.length < 3) {
        throw new Error("A senha deve ter pelo menos 3 caracteres");
      }

      console.log("Tentando fazer login com:", { email: credentials.email });

      const token = await AuthService.login(credentials);

      if (!token) {
        throw new Error("Token de acesso não foi recebido. Tente novamente.");
      }

      console.log("Login realizado com sucesso");
      login(token); // Update AuthContext with the token
      router.push("/dashboard");
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || "Erro inesperado. Tente novamente.";

      console.error("Erro no login:", {
        message: errorMessage,
        originalError: error,
      });

      // Personaliza algumas mensagens comuns
      if (
        errorMessage.toLowerCase().includes("network") ||
        errorMessage.toLowerCase().includes("conexão")
      ) {
        setError(
          "Problema de conexão. Verifique sua internet e tente novamente."
        );
      } else if (
        errorMessage.toLowerCase().includes("timeout") ||
        errorMessage.toLowerCase().includes("tempo limite")
      ) {
        setError("A operação demorou muito. Tente novamente.");
      } else if (errorMessage.toLowerCase().includes("servidor indisponível")) {
        setError(
          "O servidor está temporariamente indisponível. Tente novamente em alguns instantes."
        );
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    credentials,
    isLoading,
    error,
    handleChange,
    handleSubmit,
  };
};
