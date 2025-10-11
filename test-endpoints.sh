#!/bin/bash

echo "🧪 Verificando todos os endpoints do backend..."

# Fazer login e obter token
echo "1️⃣ Fazendo login para obter token..."
TOKEN=$(curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/auth/login" \
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
  -X POST "https://barak-backend-665569303635.us-central1.run.app/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"123456"}'

# Propostas
echo ""
echo "📋 Proposta endpoints:"
echo "  GET /proposta/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/proposta/listar"

echo "  POST /proposta:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "https://barak-backend-665569303635.us-central1.run.app/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"value":50000,"status":"PENDENTE"}'

# Clientes
echo ""
echo "👥 Cliente endpoints:"
echo "  GET /cliente/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/cliente/listar"

echo "  POST /cliente/salvar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "https://barak-backend-665569303635.us-central1.run.app/cliente/salvar" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cliente Teste","email":"cliente@teste.com","phone":"11999999999","address":"Rua Teste, 123"}'

# Bancos
echo ""
echo "🏦 Banco endpoints:"
echo "  GET /banco/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/banco/listar"

echo "  POST /banco/salvar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "https://barak-backend-665569303635.us-central1.run.app/banco/salvar" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Banco Teste","balance":100000}'

# Funcionários
echo ""
echo "👨‍💼 Funcionários endpoints:"
echo "  GET /funcionarios/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/funcionarios/listar"

echo "  POST /funcionarios:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "https://barak-backend-665569303635.us-central1.run.app/funcionarios" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Funcionário Teste","cpf":"12345678901","email":"func@teste.com","phone":"11999999999","isActive":true,"isManager":false}'

# Unidades
echo ""
echo "🏢 Unidade endpoints:"
echo "  GET /unidade/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/unidade/listar"

echo "  POST /unidade:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -X POST "https://barak-backend-665569303635.us-central1.run.app/unidade" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"Unidade Teste"}'

# Automate
echo ""
echo "🤖 Automate endpoints:"
echo "  GET /automate/ila:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/automate/ila"

# Veículos (se houver endpoint no backend)
echo ""
echo "🚗 Veículo endpoints:"
echo "  GET /veiculo/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/veiculo/listar"

# Despesas (se houver endpoint no backend)
echo ""
echo "💰 Despesa endpoints:"
echo "  GET /despesa/listar:"
curl -s -w "    HTTP %{http_code}\n" -o /dev/null \
  -H "Authorization: Bearer $TOKEN" \
  "https://barak-backend-665569303635.us-central1.run.app/despesa/listar"

echo ""
echo "🏁 Verificação completa!"
echo "📝 HTTP 200 = Funcionando"
echo "📝 HTTP 404 = Endpoint não implementado"
echo "📝 HTTP 500 = Erro no servidor"