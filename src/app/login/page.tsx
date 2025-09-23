'use client';

import Link from 'next/link';
import { Car } from 'lucide-react';
import { useLoginViewModel } from '@/viewmodels/useLoginViewModel';

export default function Login() {
  const { credentials, isLoading, error, handleChange, handleSubmit } = useLoginViewModel();

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--background)' }}
    >
      <div
        className="w-full max-w-md space-y-8 p-8 rounded-xl shadow-sm border border-gray-100"
        style={{ background: 'var(--card-background)' }}
      >
        <div className="text-center">
          <div className="flex justify-center items-center gap-2">
            <Car className="h-7 w-7" style={{ color: 'var(--primary)' }} />
            <h1
              className="text-3xl font-bold"
              style={{ color: 'var(--primary)' }}
            >
              Barak
            </h1>
          </div>
          <h2
            className="mt-6 text-2xl font-bold tracking-tight"
            style={{ color: 'var(--heading)' }}
          >
            Acesso ao Dashboard
          </h2>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted)' }}>
            Entre com suas credenciais para gerenciar o sistema
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: 'var(--foreground)' }}
              >
                E-mail
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={credentials.email}
                onChange={handleChange}
                className="input w-full text-sm"
                placeholder="seu.email@barak.com.br"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  Senha
                </label>
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-primary transition-colors hover:text-primary-hover"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="input w-full text-sm"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center">
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            <span>
              Barak - Sistema de gerenciamento de concessionária
            </span>
            <div className="mt-1 text-center">
              © {new Date().getFullYear()} Todos os direitos reservados
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
