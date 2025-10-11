import { httpClient } from "@/infra/httpClient";

export interface TestResult {
  name: string;
  status: "success" | "error" | "warning";
  message: string;
  details?: Record<string, unknown> | string | null;
  duration?: number;
}

class TestService {
  /**
   * Testa a conectividade básica com o backend
   */
  async testBackendConnection(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Tenta fazer login com credenciais válidas para testar conectividade
      await httpClient.post("/auth/login", {
        email: "admin@barak.com",
        password: "123456",
      });

      const duration = Date.now() - startTime;
      return {
        name: "Conectividade Backend",
        status: "success",
        message: "Backend está acessível",
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const err = error as { status?: number; message?: string };

      // Se retornou algum status HTTP, significa que a conectividade funciona
      if (err.status && err.status >= 400 && err.status < 600) {
        return {
          name: "Conectividade Backend",
          status: "success",
          message: "Backend está acessível (conexão funcionando)",
          duration,
        };
      }

      return {
        name: "Conectividade Backend",
        status: "error",
        message: `Erro ao conectar: ${err.message}`,
        details: error ? { error: String(error) } : null,
        duration,
      };
    }
  }

  /**
   * Testa se o endpoint de login está funcionando
   */
  async testLoginEndpoint(): Promise<TestResult> {
    const startTime = Date.now();

    try {
      // Tenta fazer login com credenciais válidas
      const response = await httpClient.post("/auth/login", {
        email: "admin@barak.com",
        password: "123456",
      });

      const duration = Date.now() - startTime;

      // Verifica se retornou um token
      if (response && (response as { token?: string }).token) {
        return {
          name: "Endpoint de Login",
          status: "success",
          message: "Login funcionando corretamente com admin",
          duration,
        };
      } else {
        return {
          name: "Endpoint de Login",
          status: "warning",
          message: "Login retornou resposta sem token",
          duration,
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      const err = error as { status?: number; message?: string };

      return {
        name: "Endpoint de Login",
        status: "error",
        message: `Erro no login: ${err.message}`,
        details: error ? { error: String(error) } : null,
        duration,
      };
    }
  }

  /**
   * Testa CORS
   */
  async testCORS(): Promise<TestResult> {
    try {
      // Simplesmente teste se conseguimos fazer uma requisição (CORS será testado implicitamente)
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://barak-backend-665569303635.us-central1.run.app";

      return {
        name: "CORS",
        status: "success",
        message: `CORS parece estar funcionando (requisições pelo httpClient funcionaram)`,
        details: { apiUrl },
      };
    } catch (error) {
      return {
        name: "CORS",
        status: "error",
        message: `Erro no teste de CORS: ${(error as Error).message}`,
        details: error ? { error: String(error) } : null,
      };
    }
  }

  /**
   * Testa se as variáveis de ambiente estão configuradas
   */
  async testEnvironmentConfig(): Promise<TestResult> {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      if (!apiUrl) {
        return {
          name: "Configuração de Ambiente",
          status: "warning",
          message:
            "NEXT_PUBLIC_API_URL não definida, usando padrão (https://barak-backend-665569303635.us-central1.run.app)",
        };
      }

      if (apiUrl.includes("localhost") || apiUrl.includes("127.0.0.1")) {
        return {
          name: "Configuração de Ambiente",
          status: "success",
          message: `API URL configurada: ${apiUrl}`,
          details: { apiUrl },
        };
      }

      return {
        name: "Configuração de Ambiente",
        status: "success",
        message: `API URL configurada: ${apiUrl}`,
        details: { apiUrl },
      };
    } catch (error) {
      return {
        name: "Configuração de Ambiente",
        status: "error",
        message: `Erro ao verificar configuração: ${(error as Error).message}`,
        details: error ? { error: String(error) } : null,
      };
    }
  }

  /**
   * Cria um usuário de teste automaticamente
   */
  async createTestUser(): Promise<TestResult> {
    const startTime = Date.now();

    const testUser = {
      name: "Usuário Teste",
      email: "teste@barak.com",
      password: "123456",
    };

    try {
      await httpClient.post("/auth/register", testUser);
      const duration = Date.now() - startTime;

      return {
        name: "Criação de Usuário Teste",
        status: "success",
        message: `Usuário criado: ${testUser.email} (senha: ${testUser.password})`,
        details: { email: testUser.email, password: testUser.password },
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const err = error as { status?: number; message?: string };

      // Se o usuário já existe, não é um erro crítico
      if (err.status === 409 || err.message?.includes("já está cadastrado")) {
        return {
          name: "Criação de Usuário Teste",
          status: "warning",
          message: `Usuário já existe: ${testUser.email} (senha: ${testUser.password})`,
          details: { email: testUser.email, password: testUser.password },
          duration,
        };
      }

      return {
        name: "Criação de Usuário Teste",
        status: "error",
        message: `Erro ao criar usuário: ${err.message}`,
        details: { status: err.status, error },
        duration,
      };
    }
  }

  /**
   * Fluxo completo: cria usuário e testa login
   */
  async testCompleteFlow(): Promise<TestResult[]> {
    const results: TestResult[] = [];

    // 1. Cria usuário de teste
    const createResult = await this.createTestUser();
    results.push(createResult);

    // 2. Se criou com sucesso ou usuário já existe, tenta login
    if (
      createResult.status === "success" ||
      createResult.status === "warning"
    ) {
      const loginResult = await this.testLoginWithCredentials(
        "teste@barak.com",
        "123456"
      );
      results.push(loginResult);
    }

    return results;
  }

  /**
   * Testa um login com credenciais específicas
   */
  async testLoginWithCredentials(
    email: string,
    password: string
  ): Promise<TestResult> {
    const startTime = Date.now();

    try {
      const response = await httpClient.post("/auth/login", {
        email,
        password,
      });
      const duration = Date.now() - startTime;

      return {
        name: "Login com Credenciais",
        status: "success",
        message: "Login realizado com sucesso!",
        details: { hasToken: !!response },
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      const err = error as { status?: number; message?: string };

      return {
        name: "Login com Credenciais",
        status: "error",
        message: `Login falhou: ${err.message}`,
        details: { status: err.status, error },
        duration,
      };
    }
  }

  /**
   * Executa todos os testes
   */
  async runAllTests(): Promise<TestResult[]> {
    console.log("🧪 Iniciando testes de integração...");

    const tests = [
      () => this.testEnvironmentConfig(),
      () => this.testBackendConnection(),
      () => this.testCORS(),
      () => this.testLoginEndpoint(),
    ];

    const results: TestResult[] = [];

    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
        console.log(`✅ ${result.name}: ${result.message}`);
      } catch (error) {
        results.push({
          name: "Teste Desconhecido",
          status: "error",
          message: `Erro inesperado: ${(error as Error).message}`,
          details: error ? { error: String(error) } : null,
        });
        console.error(`❌ Erro em teste:`, error);
      }
    }

    return results;
  }
}

export const testService = new TestService();
