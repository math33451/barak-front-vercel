#!/bin/bash

echo "🧪 Verificando todos os endpoints do backend..."

# Fazer login e obter token
echo "1️⃣ Fazendo login para obter token..."
TOKEN=$(curl -s -X POST "http://localhost:8089/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token de autenticação"
  exit 1
fi

echo "✅ Token obtido: ${TOKEN:0:20}..."

# Testar todos os endpoints identificados
echo ""
echo "2️⃣ Testando endpoints..."

# Auth endpoints
echo "🔐 Auth endpoints:"
echo "  POST /auth/login - ✅ Funcionando"
echo "  POST /auth/register:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "http://localhost:8089/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Propostas
echo ""
echo "📋 Proposta endpoints:"
echo "  GET /rest/proposta/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/proposta/listar"

echo "  POST /rest/proposta:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "http://localhost:8089/rest/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value":50000,"status":"PENDENTE"}'

# Clientes
echo ""
echo "👥 Cliente endpoints:"
echo "  GET /rest/cliente/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/cliente/listar"

echo "  POST /rest/cliente/salvar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "http://localhost:8089/rest/cliente/salvar" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cliente Teste","email":"cliente@teste.com","phone":"11999999999","address":"Rua Teste, 123"}'

# Bancos
echo ""
echo "🏦 Banco endpoints:"
echo "  GET /rest/banco/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/banco/listar"

echo "  POST /rest/banco/salvar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "http://localhost:8089/rest/banco/salvar" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Banco Teste","balance":100000}'

# Funcionários
echo ""
echo "👨‍💼 Funcionários endpoints:"
echo "  GET /rest/funcionarios/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/funcionarios/listar"

echo "  POST /rest/funcionarios:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "http://localhost:8089/rest/funcionarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Funcionário Teste","cpf":"12345678901","email":"func@teste.com","phone":"11999999999","isActive":true,"isManager":false}'

# Unidades
echo ""
echo "🏢 Unidade endpoints:"
echo "  GET /rest/unidade/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/unidade/listar"

echo "  POST /rest/unidade:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "http://localhost:8089/rest/unidade" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unidade Teste"}'

# Automate
echo ""
echo "🤖 Automate endpoints:"
echo "  GET /rest/automate/ila:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/automate/ila"

# Veículos (se houver endpoint no backend)
echo ""
echo "🚗 Veículo endpoints:"
echo "  GET /rest/veiculo/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/veiculo/listar"

# Despesas (se houver endpoint no backend)
echo ""
echo "💰 Despesa endpoints:"
echo "  GET /rest/despesa/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8089/rest/despesa/listar"

echo ""
echo "🏁 Verificação completa!"
echo "📝 HTTP 200 = Funcionando"
echo "📝 HTTP 404 = Endpoint não implementado"
echo "📝 HTTP 500 = Erro no servidor"