# 📐 Plano de Refatoração - Arquitetura e Boas Práticas

## 🎯 Objetivos

1. **Segurança:** Remover valores hardcoded sensíveis
2. **POO:** Aplicar padrões orientados a objetos
3. **Design Patterns:** Implementar Repository, Singleton, Factory
4. **MVVM:** Melhorar separação de responsabilidades
5. **Componentização:** Reduzir page.tsx de 2407 para <300 linhas
6. **Limpeza:** Remover arquivos desnecessários

---

## 📋 FASE 1: Limpeza de Arquivos

### Arquivos para REMOVER:
```
❌ GEMINI.md (raiz do projeto)
❌ barak-front/GEMINI.md
❌ barak-front/ANALISE_DADOS_MOCKADOS.md (temporário)
❌ barak-front/TESTING.md
❌ barak-front/ERROR_HANDLING.md  
❌ barak-front/FAKE_AUTH_README.md
❌ barak-front/test-relatorios.sh
❌ barak-front/test-backend.sh
❌ barak-front/test-login-complete.sh
❌ barak-front/create-proposals.sh
❌ barak-front/populate-test-data.sh
❌ barak-front/reset-database.sh
❌ barak-front/test-endpoints.sh
❌ barak-front/fix-duplicate-users.sh
❌ barak-front/test-api.html
❌ barak-front/test-completo.html
```

### Arquivos para MANTER:
```
✅ README.md (documentação principal)
✅ package.json
✅ tsconfig.json
✅ next.config.ts
✅ .env.local (configurações)
```

---

## 🔒 FASE 2: Auditoria de Segurança

### Valores Expostos Encontrados:

#### 🔴 CRÍTICO - URLs Hardcoded em Múltiplos Arquivos:
```typescript
// ❌ PROBLEMA: URL hardcoded em 4 arquivos diferentes
src/infra/httpClient.ts: "https://barak-backend-665569303635.us-central1.run.app"
src/services/BankService.ts: "https://barak-backend-665569303635.us-central1.run.app"
src/services/FinancingService.ts: "https://barak-backend-665569303635.us-central1.run.app"
src/services/AuthService.ts: "https://barak-backend-665569303635.us-central1.run.app"
```

**SOLUÇÃO:** Centralizar em arquivo de configuração único.

#### 🟡 ATENÇÃO - Senhas de Teste Expostas:
```typescript
// TestService.ts
password: "123456" // ⚠️ Senha de teste hardcoded
```

**SOLUÇÃO:** Mover para variáveis de ambiente `.env.test`.

#### 🟡 ATENÇÃO - localStorage Keys Hardcoded:
```typescript
localStorage.getItem("jwt_token") // ⚠️ Key repetida 6x
```

**SOLUÇÃO:** Criar constantes centralizadas.

---

## 🏗️ FASE 3: Refatoração POO - HttpClient

### Estado Atual (Funcional):
```typescript
// httpClient.ts - ANTES
const API_BASE_URL = "https://..."; // ❌ Hardcoded
const getToken = () => localStorage.getItem("jwt_token"); // ❌ Funcional

export const httpClient = {
  get: async <T>(endpoint: string): Promise<T> => { /* ... */ },
  post: async <T>(endpoint: string, data: unknown): Promise<T> => { /* ... */ },
  // ...
};
```

### Novo Design (POO + Singleton):
```typescript
// HttpClient.ts - DEPOIS
class HttpClient {
  private static instance: HttpClient;
  private baseURL: string;
  private tokenKey: string;

  private constructor() {
    this.baseURL = "https://barak-backend-665569303635.us-central1.run.app";
    this.tokenKey = "jwt_token";
  }

  public static getInstance(): HttpClient {
    if (!HttpClient.instance) {
      HttpClient.instance = new HttpClient();
    }
    return HttpClient.instance;
  }

  private getHeaders(): HeadersInit {
    const token = localStorage.getItem(this.tokenKey);
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  public async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "GET",
      headers: this.getHeaders(),
    });
    return this.handleResponse<T>(response);
  }

  public async post<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || "Request failed");
    }
    return response.json();
  }

  public setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  public clearToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}

export const httpClient = HttpClient.getInstance();
```

**Benefícios:**
- ✅ Singleton garante instância única
- ✅ Encapsulamento de configurações
- ✅ Métodos privados/públicos bem definidos
- ✅ Fácil adicionar interceptors no futuro
- ✅ Centraliza tratamento de erros

---

## 🏛️ FASE 4: Repository Pattern

### Estado Atual (Service = Repository + Domain Logic):
```typescript
// ClientService.ts - ANTES (MISTURADO)
const fetchClients = async (): Promise<Client[]> => {
  const response = await httpClient.get<BackendCliente[]>("/cliente/listar");
  return response.map(mapFromBackend); // ❌ Mapeamento + lógica de busca
};
```

### Novo Design (Separação clara):
```typescript
// repositories/ClientRepository.ts
export class ClientRepository {
  async findAll(): Promise<BackendCliente[]> {
    return httpClient.get<BackendCliente[]>("/cliente/listar");
  }

  async findById(id: string): Promise<BackendCliente> {
    return httpClient.get<BackendCliente>(`/cliente/${id}`);
  }

  async create(data: Omit<BackendCliente, "id">): Promise<BackendCliente> {
    return httpClient.post<BackendCliente>("/cliente/salvar", data);
  }

  async delete(id: string): Promise<void> {
    return httpClient.delete(`/cliente/delete/${id}`);
  }
}

// services/ClientService.ts  
export class ClientService {
  private repository = new ClientRepository();

  async getAll(): Promise<Client[]> {
    const backendClients = await this.repository.findAll();
    return backendClients.map(ClientMapper.toDomain);
  }

  async getById(id: string): Promise<Client> {
    const backendClient = await this.repository.findById(id);
    return ClientMapper.toDomain(backendClient);
  }

  // Business logic aqui (validações, cálculos, etc.)
}

// mappers/ClientMapper.ts
export class ClientMapper {
  static toDomain(backend: BackendCliente): Client {
    return {
      id: backend.idCliente?.toString() || "",
      name: backend.nomeCliente || "",
      cpf: backend.cpfCliente || "",
      // ...
    };
  }

  static toBackend(client: Partial<Client>): Omit<BackendCliente, "idCliente"> {
    return {
      nomeCliente: client.name as string,
      cpfCliente: client.cpf as string,
      // ...
    };
  }
}
```

**Benefícios:**
- ✅ Repository: apenas acessa dados
- ✅ Service: lógica de negócio
- ✅ Mapper: transformações de dados
- ✅ Fácil testar cada camada isoladamente
- ✅ Fácil trocar fonte de dados (API → LocalStorage → IndexedDB)

---

## 🎨 FASE 5: Componentização - Relatórios (2407 linhas)

### Estrutura Atual:
```
src/app/relatorios/page.tsx (2407 linhas) ❌ MUITO GRANDE
```

### Nova Estrutura:
```
src/
├── components/
│   ├── relatorios/
│   │   ├── SimulationControls/
│   │   │   ├── index.tsx (componente principal)
│   │   │   ├── ProspectionParams.tsx (150 linhas)
│   │   │   ├── CommercialParams.tsx (120 linhas)
│   │   │   ├── MarketParams.tsx (80 linhas)
│   │   │   ├── TeamParams.tsx (60 linhas)
│   │   │   ├── FinancialParams.tsx (150 linhas)
│   │   │   └── OperationalParams.tsx (100 linhas)
│   │   │
│   │   ├── MetricsDisplay/
│   │   │   ├── index.tsx
│   │   │   ├── RevenueCard.tsx
│   │   │   ├── SalesCard.tsx
│   │   │   ├── FinancingCard.tsx
│   │   │   └── OperationalCard.tsx
│   │   │
│   │   ├── ChartsSection/
│   │   │   ├── index.tsx
│   │   │   ├── SalesChart.tsx
│   │   │   ├── RevenueChart.tsx
│   │   │   └── ComparisonChart.tsx
│   │   │
│   │   └── InsightsPanel/
│   │       ├── index.tsx
│   │       └── InsightCard.tsx
│   │
│   └── ui/ (componentes base reutilizáveis)
│       ├── FormInput.tsx
│       ├── Slider.tsx
│       ├── StatCard.tsx
│       ├── Badge.tsx
│       └── Card.tsx
│
└── app/relatorios/page.tsx (< 300 linhas) ✅ LIMPO
```

### Exemplo de Componente Reutilizável:

```typescript
// components/ui/Slider.tsx
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  description?: string;
  isReal?: boolean; // Badge "REAL"
  onChange: (value: number) => void;
  formatValue?: (value: number) => string;
}

export const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  unit,
  description,
  isReal,
  onChange,
  formatValue = (v) => v.toString(),
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {isReal && (
            <span className="px-2 py-0.5 text-[10px] font-semibold bg-green-100 text-green-700 rounded-full">
              REAL
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <input
            type="number"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="w-24 px-2 py-1 text-sm text-right font-semibold text-blue-600 border-2 border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {unit && <span className="text-sm text-gray-500">{unit}</span>}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={Math.min(value, max)}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-600"
      />
      {description && (
        <p className="text-xs text-gray-500">
          {description}
          {isReal && (
            <span className="ml-1 font-semibold text-green-600">
              • Valor real do backend
            </span>
          )}
        </p>
      )}
    </div>
  );
};
```

### Uso no Page:
```typescript
// app/relatorios/page.tsx - DEPOIS
export default function Relatorios() {
  const viewModel = useReportViewModel();

  return (
    <DashboardLayout title="Relatórios e Projeções" activePath="/relatorios">
      {viewModel.isLoading ? <LoadingState /> : (
        <>
          <MetricsDisplay metrics={viewModel.metricasReais} />
          <SimulationControls viewModel={viewModel} />
          <ChartsSection data={viewModel.salesByMonth} />
          <InsightsPanel insights={viewModel.calculatedInsights} />
        </>
      )}
    </DashboardLayout>
  );
}
```

**Redução:** 2407 linhas → ~250 linhas ✅

---

## 🧠 FASE 6: MVVM - Melhorias nos ViewModels

### Princípios MVVM:

1. **Model:** Dados puros (types/index.ts) ✅ JÁ OK
2. **View:** Componentes React (pages) ⚠️ MELHORAR
3. **ViewModel:** Lógica de apresentação ⚠️ MELHORAR

### Problemas Atuais:
```typescript
// ❌ ERRADO: ViewModel com lógica de UI
export const useReportViewModel = () => {
  // ... lógica
  return {
    isLoading, // ✅ OK
    data,      // ✅ OK
    setClientes, // ❌ ERRADO: setter exposto
    // View deve chamar actions, não setters diretos
  };
};
```

### Solução:
```typescript
// ✅ CORRETO: ViewModel com Actions
export const useReportViewModel = () => {
  const [clientes, setClientes] = useState(80);
  
  // Actions (encapsulam lógica)
  const updateClientes = (novoValor: number) => {
    if (novoValor < 0) {
      toast.error("Valor inválido");
      return;
    }
    setClientes(novoValor);
    // Pode ter lógica adicional aqui (analytics, validações, etc.)
  };

  return {
    // State (somente leitura)
    state: {
      clientes,
      isLoading,
      metricasReais,
    },
    // Actions (comandos)
    actions: {
      updateClientes,
      updateTaxaConversao,
      resetSimulation,
    },
    // Computed (valores derivados)
    computed: {
      vendasSimuladas,
      faturamentoProjetado,
    },
  };
};
```

---

## 📐 FASE 7: Arquitetura de Pastas Final

```
src/
├── app/                    # Pages (Next.js App Router)
│   ├── layout.tsx
│   ├── page.tsx
│   ├── relatorios/
│   │   └── page.tsx       # < 300 linhas
│   ├── dashboard/
│   ├── vendas/
│   └── ...
│
├── components/
│   ├── ui/                # Componentes base reutilizáveis
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Slider.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   │
│   ├── relatorios/        # Componentes específicos
│   │   ├── SimulationControls/
│   │   ├── MetricsDisplay/
│   │   └── ChartsSection/
│   │
│   ├── dashboard/
│   ├── forms/
│   └── layout/
│
├── core/                  # Camada de infraestrutura
│   ├── http/
│   │   ├── HttpClient.ts  # Classe Singleton
│   │   ├── interceptors/
│   │   └── types.ts
│   │
│   ├── storage/
│   │   ├── LocalStorage.ts
│   │   └── SessionStorage.ts
│   │
│   └── config/
│       ├── constants.ts   # STORAGE_KEYS, API_ENDPOINTS
│       └── env.ts         # Validação de env vars
│
├── domain/                # Lógica de negócio
│   ├── models/           # Interfaces de domínio
│   │   ├── Client.ts
│   │   ├── Proposal.ts
│   │   └── Sale.ts
│   │
│   ├── repositories/     # Acesso a dados
│   │   ├── ClientRepository.ts
│   │   ├── ProposalRepository.ts
│   │   └── SaleRepository.ts
│   │
│   ├── services/         # Lógica de negócio
│   │   ├── ClientService.ts
│   │   ├── ProposalService.ts
│   │   └── ReportAggregatorService.ts
│   │
│   └── mappers/          # Transformações
│       ├── ClientMapper.ts
│       └── ProposalMapper.ts
│
├── presentation/          # MVVM
│   ├── viewmodels/
│   │   ├── useReportViewModel.ts
│   │   ├── useDashboardViewModel.ts
│   │   └── useClientViewModel.ts
│   │
│   └── hooks/            # React Query hooks
│       ├── useReports.ts
│       └── useEntities.ts
│
├── types/                # TypeScript interfaces compartilhadas
│   └── index.ts
│
└── utils/
    ├── formatters.ts
    ├── validators.ts
    └── errorMessages.ts
```

---

## 🚀 Ordem de Execução

### Sprint 1: Limpeza e Segurança (1 dia)
1. ✅ Remover arquivos .md e .sh desnecessários
2. ✅ Criar arquivo `.env.example` com todas as variáveis
3. ✅ Centralizar URLs em `core/config/constants.ts`
4. ✅ Mover senhas de teste para `.env.test`

### Sprint 2: POO e Patterns (2 dias)
5. ✅ Refatorar `httpClient` para classe Singleton
6. ✅ Criar estrutura de Repositories
7. ✅ Criar Mappers para todas as entidades
8. ✅ Refatorar Services para usar Repositories

### Sprint 3: Componentização Fase 1 (2 dias)
9. ✅ Criar componentes UI base (Slider, Input, Card, Badge)
10. ✅ Testar componentes isoladamente (Storybook?)

### Sprint 4: Componentização Fase 2 (3 dias)
11. ✅ Quebrar `relatorios/page.tsx` em seções
12. ✅ Criar `SimulationControls` com sub-componentes
13. ✅ Criar `MetricsDisplay` com cards
14. ✅ Criar `ChartsSection`

### Sprint 5: MVVM e Refinamento (2 dias)
15. ✅ Refatorar ViewModels com padrão Actions/State/Computed
16. ✅ Adicionar testes unitários para ViewModels
17. ✅ Documentar padrões de projeto usados

---

## ✅ Checklist de Qualidade

- [ ] Nenhuma URL hardcoded no código
- [ ] Nenhuma senha/token no código
- [ ] localStorage.getItem() usa constantes
- [ ] HttpClient é classe Singleton
- [ ] Todos os Services usam Repositories
- [ ] Todos os mappers em arquivos separados
- [ ] Nenhum arquivo > 500 linhas
- [ ] ViewModels seguem padrão Actions/State/Computed
- [ ] Componentes UI 100% reutilizáveis
- [ ] TypeScript sem `any` (usar `unknown`)
- [ ] Build passa sem warnings
- [ ] ESLint sem erros

---

## 📊 Métricas de Sucesso

| Métrica | Antes | Meta | Depois |
|---------|-------|------|--------|
| Linhas relatorios/page.tsx | 2407 | < 300 | ? |
| Arquivos > 500 linhas | 3 | 0 | ? |
| URLs hardcoded | 4 | 0 | ? |
| Componentes reutilizáveis | 5 | 20+ | ? |
| Test Coverage | 0% | 60% | ? |
| Build warnings | 12 | 0 | ? |

---

## 🎓 Padrões Aplicados

1. **Singleton:** HttpClient (instância única)
2. **Repository:** Separação de acesso a dados
3. **Mapper:** Transformação de dados
4. **MVVM:** Model-View-ViewModel
5. **Composite:** Componentes compostos
6. **Factory:** (futuro) para criar instâncias complexas
7. **Observer:** React Query (built-in)

---

**Próxima Ação:** Começar Sprint 1 - Limpeza e Segurança
