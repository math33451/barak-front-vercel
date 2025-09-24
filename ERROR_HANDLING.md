# Sistema de Tratamento de Erros - Barak Frontend

## Visão Geral

O sistema foi aprimorado com um tratamento de erros abrangente e em português. Todas as mensagens de erro são traduzidas automaticamente e formatadas de forma amigável para o usuário.

## Arquivos Principais

### 1. `src/utils/errorMessages.ts`

Centraliza todas as mensagens de erro e traduções do sistema.

### 2. `src/infra/httpClient.ts`

Cliente HTTP melhorado com:

- Interceptors para logging detalhado
- Tratamento automático de erros por status HTTP
- Tradução automática de mensagens
- Mensagens específicas para diferentes tipos de erro de rede

### 3. `src/services/AuthService.ts`

Serviço de autenticação com:

- Validações de entrada
- Tratamento específico para erros de login
- Mensagens contextuais para diferentes cenários

### 4. `src/hooks/useToast.ts`

Hook para exibir notificações de forma elegante.

## Como Funciona

### Tradução Automática

```typescript
// Mensagens do backend em inglês são automaticamente traduzidas
"User not found" → "Email ou senha incorretos"
"Invalid credentials" → "Email ou senha incorretos"
"Network Error" → "Erro de rede. Verifique sua conexão"
```

### Tratamento por Status HTTP

```typescript
// Cada status HTTP tem uma mensagem específica
400 → "Dados inválidos. Verifique as informações enviadas"
401 → "Email ou senha incorretos"
500 → "Erro interno do servidor. Tente novamente mais tarde"
```

### Validações no Frontend

```typescript
// Validações antes de enviar para o backend
- Email obrigatório e formato válido
- Senha com mínimo de caracteres
- Campos obrigatórios preenchidos
```

## Como Usar

### Em Componentes

```typescript
import { useLoginViewModel } from "@/viewmodels/useLoginViewModel";

function LoginForm() {
  const { credentials, isLoading, error, handleChange, handleSubmit } =
    useLoginViewModel();

  return (
    <form onSubmit={handleSubmit}>
      {/* Campos do formulário */}
      {error && (
        <div className="text-red-500 text-sm">
          {error} {/* Mensagem já formatada em português */}
        </div>
      )}
    </form>
  );
}
```

### Com Notificações Toast

```typescript
import { useToast } from "@/hooks/useToast";
import { ToastContainer } from "@/components/ui/ToastContainer";

function MyComponent() {
  const { toasts, showError, showSuccess, removeToast } = useToast();

  const handleLogin = async () => {
    try {
      await AuthService.login(credentials);
      showSuccess("Login realizado com sucesso!");
    } catch (error) {
      showError(error.message); // Mensagem já traduzida
    }
  };

  return (
    <>
      {/* Seu componente */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
```

## Tipos de Erro Tratados

### Erros de Rede

- Sem conexão com internet
- Servidor indisponível
- Timeout de requisição
- Erro de DNS

### Erros de Autenticação

- Credenciais inválidas
- Usuário não encontrado
- Conta bloqueada
- Sessão expirada

### Erros de Validação

- Campos obrigatórios
- Formato inválido
- Dados duplicados
- Regras de negócio

### Erros de Servidor

- Erro interno (500)
- Serviço indisponível (503)
- Gateway timeout (504)

## Logs de Debug

Durante o desenvolvimento, você pode ver logs detalhados no console:

```
HTTP Request: POST /auth/login {...}
HTTP Response: 500 /auth/login {...}
Erro no login: { message: "Email ou senha incorretos", originalError: {...} }
```

## Personalização

### Adicionando Novas Traduções

```typescript
// Em src/utils/errorMessages.ts
const translations: Record<string, string> = {
  "Your custom error": "Seu erro personalizado",
  // ...
};
```

### Adicionando Novos Status HTTP

```typescript
// Em src/utils/errorMessages.ts
export const HTTP_STATUS_MESSAGES = {
  418: "Sou um bule de chá", // Exemplo
  // ...
} as const;
```

## Benefícios

1. **Consistência**: Todas as mensagens seguem o mesmo padrão
2. **Internacionalização**: Fácil de traduzir para outros idiomas
3. **Debugging**: Logs detalhados para desenvolvimento
4. **UX**: Mensagens claras e contextuais para o usuário
5. **Manutenibilidade**: Centralizado e organizado
6. **Robustez**: Trata diferentes cenários de erro

## Próximos Passos

- [ ] Adicionar mais traduções conforme necessário
- [ ] Implementar retry automático para alguns erros
- [ ] Adicionar métricas de erro
- [ ] Criar sistema de fallback para mensagens
- [ ] Integrar com sistema de monitoramento
