#!/bin/bash

echo "🧪 Testando página de relatórios..."

# Primeiro, verifica se o frontend está funcionando
echo "1️⃣ Verificando se o frontend está rodando..."
if ! curl -s "http://localhost:3000" > /dev/null; then
  echo "❌ Frontend não está rodando na porta 3000"
  exit 1
fi

echo "✅ Frontend está rodando"

# Testa a página de relatórios
echo "2️⃣ Testando página de relatórios..."
RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:3000/relatorios" -o /dev/null)

if [ "$RESPONSE" = "200" ]; then
  echo "✅ Página de relatórios está acessível (HTTP 200)"
else
  echo "❌ Página de relatórios retornou HTTP $RESPONSE"
  exit 1
fi

# Testa se o backend está funcionando para os dados dos relatórios
echo "3️⃣ Testando endpoints do backend para relatórios..."

# Testa propostas
PROPOSALS_RESPONSE=$(curl -s -w "%{http_code}" "https://barak-backend-665569303635.us-central1.run.app/proposta/listar" \
  -H "Authorization: Bearer $(curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -o /dev/null 2>/dev/null)

if [ "$PROPOSALS_RESPONSE" = "200" ]; then
  echo "✅ Endpoint de propostas funcionando"
else
  echo "⚠️  Endpoint de propostas retornou HTTP $PROPOSALS_RESPONSE"
fi

# Testa clientes
CLIENTS_RESPONSE=$(curl -s -w "%{http_code}" "https://barak-backend-665569303635.us-central1.run.app/cliente/listar" \
  -H "Authorization: Bearer $(curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -o /dev/null 2>/dev/null)

if [ "$CLIENTS_RESPONSE" = "200" ]; then
  echo "✅ Endpoint de clientes funcionando"
else
  echo "⚠️  Endpoint de clientes retornou HTTP $CLIENTS_RESPONSE"
fi

# Testa bancos
BANKS_RESPONSE=$(curl -s -w "%{http_code}" "https://barak-backend-665569303635.us-central1.run.app/banco/listar" \
  -H "Authorization: Bearer $(curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}' | grep -o '"token":"[^"]*"' | cut -d'"' -f4)" \
  -o /dev/null 2>/dev/null)

if [ "$BANKS_RESPONSE" = "200" ]; then
  echo "✅ Endpoint de bancos funcionando"
else
  echo "⚠️  Endpoint de bancos retornou HTTP $BANKS_RESPONSE"
fi

echo ""
echo "🏁 Teste da página de relatórios concluído!"
echo "📝 A página de relatórios deve estar funcionando agora"
echo "🌐 Acesse: http://localhost:3000/relatorios"