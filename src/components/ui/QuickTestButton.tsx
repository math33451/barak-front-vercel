"use client";

import { useState } from "react";
import { useIntegrationTests } from "@/hooks/useIntegrationTests";
import { testService } from "@/services/TestService";
import { Wrench, X } from "lucide-react";

export function QuickTestButton() {
  const [showPanel, setShowPanel] = useState(false);
  const { results, isRunning, runAllTests, runSingleTest } =
    useIntegrationTests();

  const testLogin = async () => {
    const email = prompt("Digite o email para teste:");
    const password = prompt("Digite a senha para teste:");

    if (email && password) {
      await runSingleTest("Login Manual", () =>
        testService.testLoginWithCredentials(email, password)
      );
    }
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="fixed bottom-4 right-4 p-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
        title="Testes de Integração"
      >
        <Wrench className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 bg-white rounded-lg shadow-xl border z-50">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">🧪 Testes Rápidos</h3>
          <button
            onClick={() => setShowPanel(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-2 mb-4">
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? "Testando..." : "Testar Conectividade"}
          </button>

          <button
            onClick={testLogin}
            disabled={isRunning}
            className="w-full px-3 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            Testar Login
          </button>
        </div>

        {results.length > 0 && (
          <div className="space-y-2 max-h-40 overflow-y-auto">
            {results.slice(-3).map((result, index) => (
              <div
                key={index}
                className={`p-2 rounded text-xs ${
                  result.status === "success"
                    ? "bg-green-50 text-green-800"
                    : result.status === "error"
                    ? "bg-red-50 text-red-800"
                    : "bg-yellow-50 text-yellow-800"
                }`}
              >
                <div className="font-medium">{result.name}</div>
                <div className="opacity-80">{result.message}</div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          Para testes completos:{" "}
          <a href="/tests" className="text-blue-600 hover:underline">
            /tests
          </a>
        </div>
      </div>
    </div>
  );
}
