"use client";

import { useState } from "react";
import { testService, TestResult } from "@/services/TestService";
import {
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
} from "lucide-react";

export default function TestsPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testCredentials, setTestCredentials] = useState({
    email: "",
    password: "",
  });

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    try {
      const testResults = await testService.runAllTests();
      setResults(testResults);
    } catch (error) {
      console.error("Erro ao executar testes:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const runLoginTest = async () => {
    if (!testCredentials.email || !testCredentials.password) {
      alert("Por favor, preencha email e senha para testar");
      return;
    }

    setIsRunning(true);

    try {
      const result = await testService.testLoginWithCredentials(
        testCredentials.email,
        testCredentials.password
      );
      setResults((prev) => [...prev, result]);
    } catch (error) {
      console.error("Erro no teste de login:", error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "border-green-200 bg-green-50 text-green-800";
      case "error":
        return "border-red-200 bg-red-50 text-red-800";
      case "warning":
        return "border-yellow-200 bg-yellow-50 text-yellow-800";
      default:
        return "border-gray-200 bg-gray-50 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🧪 Testes de Integração
          </h1>
          <p className="text-gray-600">
            Verifique se todas as integrações do frontend estão funcionando
            corretamente
          </p>
        </div>

        {/* Configuração da API */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">📡 Configuração da API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL da API
              </label>
              <code className="block p-2 bg-gray-100 rounded text-sm">
                {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8089"}
              </code>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ambiente
              </label>
              <code className="block p-2 bg-gray-100 rounded text-sm">
                {process.env.NODE_ENV || "development"}
              </code>
            </div>
          </div>
        </div>

        {/* Testes Automáticos */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">🔍 Testes Automáticos</h2>
            <button
              onClick={runAllTests}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRunning ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? "Executando..." : "Executar Todos os Testes"}
            </button>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${getStatusColor(
                    result.status
                  )}`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                    {result.duration && (
                      <span className="text-sm opacity-70">
                        ({result.duration}ms)
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{result.message}</p>
                  {result.details && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-sm font-medium">
                        Ver detalhes
                      </summary>
                      <pre className="mt-2 p-2 bg-black bg-opacity-10 rounded text-xs overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Teste de Login Manual */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold mb-4">
            🔐 Teste de Login Manual
          </h2>
          <p className="text-gray-600 mb-4">
            Teste o login com credenciais reais que você criou no backend
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={testCredentials.email}
                onChange={(e) =>
                  setTestCredentials((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="seu.email@exemplo.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={testCredentials.password}
                onChange={(e) =>
                  setTestCredentials((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            onClick={runLoginTest}
            disabled={
              isRunning || !testCredentials.email || !testCredentials.password
            }
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            Testar Login
          </button>
        </div>

        {/* Informações de Debug */}
        <div className="mt-8 bg-gray-100 rounded-lg p-4">
          <h3 className="font-semibold mb-2">💡 Dicas de Debug</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>
              • Abra o Console do navegador (F12) para ver logs detalhados
            </li>
            <li>• Verifique a aba Network para ver as requisições HTTP</li>
            <li>• Certifique-se que o backend está rodando na porta 8089</li>
            <li>• Verifique se você criou um usuário no backend para teste</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
