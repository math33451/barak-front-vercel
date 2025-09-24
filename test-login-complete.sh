#!/bin/bash

# Script para testar o login completo
echo "🧪 Testando login completo..."

# Primeiro, verifica se o backend está funcionando
echo "1️⃣ Testando backend direto..."
BACKEND_RESPONSE=$(curl -s -X POST "http://localhost:8089/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}')

echo "Backend response: $BACKEND_RESPONSE"

if echo "$BACKEND_RESPONSE" | grep -q "token"; then
  echo "✅ Backend está funcionando e retornando token"
else
  echo "❌ Backend não está retornando token válido"
  exit 1
fi

echo ""
echo "2️⃣ Aguardando frontend estar pronto..."
sleep 5

echo "3️⃣ Testando via frontend..."
FRONTEND_RESPONSE=$(curl -s -X POST "http://localhost:3000/api/test-login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}' 2>/dev/null)

if [ $? -eq 0 ]; then
  echo "Frontend response: $FRONTEND_RESPONSE"
  
  if echo "$FRONTEND_RESPONSE" | grep -q "success.*true"; then
    echo "✅ Frontend conseguiu fazer login via backend"
  else
    echo "❌ Frontend não conseguiu fazer login"
  fi
else
  echo "❌ Frontend não está respondendo"
  echo "💡 Acesse manualmente: http://localhost:3000/login"
  echo "💡 Use as credenciais: admin@barak.com / 123456"
fi

echo ""
echo "🏁 Teste concluído!"
echo "📝 Credenciais válidas: admin@barak.com / 123456"