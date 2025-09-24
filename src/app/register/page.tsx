"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, UserPlus, CheckCircle } from "lucide-react";
import { AuthService } from "@/services/AuthService";
import { RegisterDTO } from "@/types";
import PasswordInput from "@/components/ui/PasswordInput";

export default function Register() {
  const [formData, setFormData] = useState<RegisterDTO>({
    name: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await AuthService.register(formData);
      setSuccess(true);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "Erro ao criar conta. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "var(--background)" }}
      >
        <div
          className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-sm border border-gray-100 text-center"
          style={{ background: "var(--card-background)" }}
        >
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-700 mb-2">
              Conta Criada!
            </h1>
            <p className="text-gray-600 mb-6">
              Sua conta foi criada com sucesso. Agora você pode fazer login.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Ir para Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--background)" }}
    >
      <div
        className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-sm border border-gray-100"
        style={{ background: "var(--card-background)" }}
      >
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Car className="h-7 w-7" style={{ color: "var(--primary)" }} />
            <h1
              className="text-3xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              Barak
            </h1>
          </div>
          <h2
            className="mt-6 text-2xl font-bold tracking-tight"
            style={{ color: "var(--heading)" }}
          >
            Criar Conta
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>
            Registre-se para acessar o sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--foreground)" }}
              >
                Nome Completo
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="input w-full text-sm"
                placeholder="Ex: João da Silva Santos"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--foreground)" }}
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input w-full text-sm"
                placeholder="Ex: joao.silva@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--foreground)" }}
              >
                Senha
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="input w-full text-sm"
                required
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                "Criando conta..."
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Já tem uma conta?{" "}
            <Link
              href="/login"
              className="font-medium text-primary hover:text-primary-hover"
            >
              Fazer login
            </Link>
          </p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="text-xs" style={{ color: "var(--muted)" }}>
            <span>Barak - Sistema de gerenciamento de concessionária</span>
            <div className="mt-1 text-center">
              © {new Date().getFullYear()} Todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
