import { useState, useCallback } from "react";
import { testService, TestResult } from "@/services/TestService";

export function useIntegrationTests() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runAllTests = useCallback(async () => {
    setIsRunning(true);
    setResults([]);

    try {
      const testResults = await testService.runAllTests();
      setResults(testResults);

      // Log para o console também
      console.group("🧪 Resultados dos Testes de Integração");
      testResults.forEach((result) => {
        const icon =
          result.status === "success"
            ? "✅"
            : result.status === "error"
            ? "❌"
            : "⚠️";
        console.log(`${icon} ${result.name}: ${result.message}`);
        if (result.details) {
          console.log("   Detalhes:", result.details);
        }
      });
      console.groupEnd();

      return testResults;
    } catch (error) {
      console.error("Erro ao executar testes:", error);
      const errorResult: TestResult = {
        name: "Erro nos Testes",
        status: "error",
        message: `Erro inesperado: ${(error as Error).message}`,
        details: { error: String(error) },
      };
      setResults([errorResult]);
      return [errorResult];
    } finally {
      setIsRunning(false);
    }
  }, []);

  const runSingleTest = useCallback(
    async (testName: string, testFn: () => Promise<TestResult>) => {
      setIsRunning(true);

      try {
        const result = await testFn();
        setResults((prev) => [...prev, result]);

        console.log(`🧪 ${result.name}:`, result);
        return result;
      } catch (error) {
        const errorResult: TestResult = {
          name: testName,
          status: "error",
          message: `Erro inesperado: ${(error as Error).message}`,
          details: { error: String(error) },
        };
        setResults((prev) => [...prev, errorResult]);
        console.error(`❌ ${testName}:`, error);
        return errorResult;
      } finally {
        setIsRunning(false);
      }
    },
    []
  );

  const clearResults = useCallback(() => {
    setResults([]);
  }, []);

  const getTestSummary = useCallback(() => {
    const summary = {
      total: results.length,
      success: results.filter((r) => r.status === "success").length,
      error: results.filter((r) => r.status === "error").length,
      warning: results.filter((r) => r.status === "warning").length,
    };

    return {
      ...summary,
      hasErrors: summary.error > 0,
      allPassed: summary.error === 0 && summary.total > 0,
    };
  }, [results]);

  return {
    results,
    isRunning,
    runAllTests,
    runSingleTest,
    clearResults,
    getTestSummary,
  };
}
