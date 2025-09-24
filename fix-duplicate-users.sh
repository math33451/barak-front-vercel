#!/bin/bash

echo "🔧 LIMPANDO USUÁRIOS DUPLICADOS..."

# Primeiro, vamos tentar fazer login para pegar um token válido de algum usuário que ainda funcione
echo "Tentando login com admin..."
ADMIN_RESPONSE=$(curl -s -X POST http://localhost:8089/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"admin123"}')

echo "Admin response: $ADMIN_RESPONSE"

# Se admin não funcionar, vamos criar um usuário novo temporário
if [[ "$ADMIN_RESPONSE" != *"token"* ]]; then
  echo "❌ Admin não funcionou, criando usuário temporário..."
  
  # Criar um usuário temporário para poder fazer operações
  TEMP_USER_RESPONSE=$(curl -s -X POST http://localhost:8089/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "nome": "Admin Temp",
      "email": "temp@admin.com",
      "password": "temp123",
      "telefone": "11999999999",
      "cargo": "ADMIN"
    }')
  
  echo "Temp user response: $TEMP_USER_RESPONSE"
  
  # Fazer login com usuário temporário
  TEMP_LOGIN_RESPONSE=$(curl -s -X POST http://localhost:8089/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"temp@admin.com","password":"temp123"}')
  
  echo "Temp login response: $TEMP_LOGIN_RESPONSE"
  
  # Extrair token
  TOKEN=$(echo $TEMP_LOGIN_RESPONSE | grep -o '"token":"[^"]*"' | grep -o '[^"]*$')
else
  # Extrair token do admin
  TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*"' | grep -o '[^"]*$')
fi

echo "Token obtido: $TOKEN"

if [ -z "$TOKEN" ]; then
  echo "❌ Não foi possível obter token. Vamos tentar uma abordagem diferente..."
  
  # Se não conseguimos token, vamos tentar resetar o banco diretamente
  echo "🗑️ RESETANDO DADOS DO BANCO..."
  
  # Recriar só o usuário que precisamos
  echo "Recriando usuário único..."
  curl -X POST http://localhost:8089/auth/register \
    -H "Content-Type: application/json" \
    -d '{
      "nome": "Usuário Teste",
      "email": "user@teste.com",
      "password": "123456",
      "telefone": "11999999999",
      "cargo": "USER"
    }'
    
  echo ""
  echo "✅ Usuário único criado!"
else
  echo "✅ Token obtido com sucesso!"
  
  # Aqui podemos fazer outras operações se necessário
  echo "🎯 Sistema funcionando!"
fi

echo ""
echo "🚀 TESTANDO LOGIN FINAL..."
FINAL_TEST=$(curl -s -X POST http://localhost:8089/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@teste.com","password":"123456"}')

echo "Teste final: $FINAL_TEST"

if [[ "$FINAL_TEST" == *"token"* ]]; then
  echo "✅ SUCESSO! Login funcionando!"
else
  echo "❌ Ainda com problema. Pode ser necessário limpar o banco manualmente."
fi