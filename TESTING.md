# 🧪 Guia de Testes - Frontend Barak

## Como Testar se as Integrações Estão Funcionando

### 1. 📱 Testes via Interface Web

#### Página de Testes Completa

Acesse: **http://localhost:3000/tests**

Esta página oferece:

- ✅ Testes automáticos de conectividade
- ✅ Verificação de CORS
- ✅ Teste de endpoints
- ✅ Teste de login manual
- ✅ Logs detalhados

#### Botão de Testes Rápidos (Login)

- Na página de login (http://localhost:3000/login)
- Clique no ícone de ferramenta (🔧) no canto inferior direito
- Execute testes rápidos sem sair da página

### 2. 💻 Testes via Terminal

#### Script Automático

```bash
# No diretório barak-front
npm run test:backend
```

#### Testes Manuais com cURL

```bash
# Teste básico de conectividade
curl -I http://localhost:8089

# Teste do endpoint de login
curl -X POST http://localhost:8089/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test"}'

# Teste de CORS
curl -X OPTIONS http://localhost:8089/auth/login \
  -H "Origin: http://localhost:3000"
```

### 3. 🔍 Debug no Navegador

#### Console do Navegador (F12)

Ao tentar fazer login, você verá logs como:

```
HTTP Request: POST /auth/login {email: "...", password: "..."}
Response Interceptor Error: {status: 500, data: {...}}
Erro no login: {message: "Email ou senha incorretos"}
```

#### Aba Network

- Veja todas as requisições HTTP
- Verifique status codes
- Analise headers e responses

### 4. 📋 Checklist de Verificação

#### ✅ Backend

- [ ] Servidor Java rodando na porta 8089
- [ ] Endpoint `/auth/login` acessível
- [ ] CORS configurado para `http://localhost:3000`
- [ ] Usuário criado no banco de dados

#### ✅ Frontend

- [ ] Next.js rodando na porta 3000
- [ ] Variável `NEXT_PUBLIC_API_URL` configurada
- [ ] Sem erros de compilação TypeScript
- [ ] Console sem erros JavaScript

#### ✅ Rede

- [ ] Conexão entre frontend e backend
- [ ] Firewall não bloqueando as portas
- [ ] DNS/localhost funcionando

### 5. 🔧 Comandos Úteis

#### Verificar Processos

```bash
# Backend (Java)
ps aux | grep java

# Frontend (Node)
ps aux | grep node

# Portas em uso
lsof -i :3000  # Frontend
lsof -i :8089  # Backend
```

#### Testar Conectividade

```bash
# Ping do backend
curl -I http://localhost:8089

# Teste de porta
telnet localhost 8089
```

### 6. 🚨 Problemas Comuns

#### Erro 500 - "Usuário não encontrado"

**Solução:** Criar usuário no backend

```sql
-- Execute no seu banco de dados
INSERT INTO users (email, password, name) VALUES
('admin@barak.com', 'senha_hash', 'Administrador');
```

#### Erro de CORS

**Solução:** Verificar configuração no backend

```java
@CrossOrigin(origins = "http://localhost:3000")
```

#### Erro "Network Error"

**Soluções:**

- Verificar se backend está rodando
- Conferir URL da API no `.env.local`
- Verificar firewall/antivírus

#### Erro de Compilação TypeScript

**Solução:** Verificar tipos e imports

```bash
npm run lint
```

### 7. 📊 Interpretando Resultados

#### Status dos Testes

- 🟢 **Success**: Funcionando perfeitamente
- 🟡 **Warning**: Funcionando mas com ressalvas
- 🔴 **Error**: Não funcionando, precisa correção

#### Logs do Console

```javascript
// ✅ Sucesso
HTTP Response: 200 /auth/login {token: "..."}

// ❌ Erro esperado (credenciais inválidas)
HTTP Response: 500 /auth/login {message: "Usuário não encontrado"}

// 🚨 Erro de rede
HTTP Request Error: Network Error
```

### 8. 🎯 Próximos Passos

Se todos os testes passarem:

1. ✅ Criar usuário válido no backend
2. ✅ Testar login com credenciais reais
3. ✅ Verificar redirecionamento para dashboard
4. ✅ Testar outras funcionalidades

Se houver falhas:

1. 🔍 Verificar logs detalhados
2. 🔧 Corrigir configurações
3. 🔄 Executar testes novamente
4. 📞 Consultar documentação do backend

### 9. 💡 Dicas Extras

- Use **http://localhost:3000/tests** para debug visual
- Mantenha o console aberto durante os testes
- Teste tanto com credenciais válidas quanto inválidas
- Verifique se há atualizações nos deps do projeto

---

**📞 Suporte:** Se os testes continuarem falhando, verifique:

1. Configuração do banco de dados
2. Configuração do Spring Security
3. Configuração de CORS
4. Logs do backend Java
