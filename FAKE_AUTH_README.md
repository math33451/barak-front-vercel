# ⚠️ AUTENTICAÇÃO FAKE ATIVADA - MODO DE TESTE

## Status: ATIVO 🔴

A autenticação fake está **ATIVADA** para testes do frontend.

## Como funciona

- O sistema está configurado para simular um usuário logado automaticamente
- Um token fake é injetado no localStorage
- Todas as requisições são feitas com esse token fake

## Para DESATIVAR e voltar à autenticação real:

1. Abra o arquivo: `src/contexts/AuthContext.tsx`

2. Na linha 6, altere:

```typescript
const FAKE_AUTH_MODE = true; // ⚠️ MODO FAKE ATIVO
```

Para:

```typescript
const FAKE_AUTH_MODE = false; // ✅ MODO REAL
```

3. Salve o arquivo e reinicie o servidor de desenvolvimento

## Arquivos modificados:

- `src/contexts/AuthContext.tsx` - Adicionada flag FAKE_AUTH_MODE

## Observações:

- O token fake usado é: `fake-jwt-token-for-testing-123456789`
- Esse token é automaticamente salvo no localStorage
- As requisições ao backend usarão esse token fake
- **IMPORTANTE**: Lembre-se de desativar antes de fazer deploy para produção!

---

**Data de ativação**: 28 de Outubro de 2025
**Motivo**: Testes do frontend sem necessidade de login real
