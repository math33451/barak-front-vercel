#!/bin/bash

echo "📋 Criando propostas fake..."

# Fazer login e obter token
TOKEN=$(curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@barak.com","password":"123456"}' | \
  grep -o '"token":"[^"]*"' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token"
  exit 1
fi

echo "✅ Token obtido"

# Obter IDs dos clientes e bancos criados
echo "📊 Obtendo dados para propostas..."

CLIENTES=$(curl -s -H "Authorization: Bearer $TOKEN" "https://barak-backend-665569303635.us-central1.run.app/cliente/listar")
BANCOS=$(curl -s -H "Authorization: Bearer $TOKEN" "https://barak-backend-665569303635.us-central1.run.app/banco/listar")

# Criar algumas propostas de exemplo (simplificadas para testar o backend)
echo ""
echo "📋 Criando propostas de teste..."

# Proposta 1
echo "Criando proposta 1..."
curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 85000,
    "ilaValue": 5000,
    "returnValue": 3000,
    "bankReturnMultiplier": 1.2,
    "selectedReturn": 2,
    "isFinanced": "SIM",
    "status": "FINALIZADA"
  }' && echo " ✅"

# Proposta 2
echo "Criando proposta 2..."
curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 125000,
    "ilaValue": 7500,
    "returnValue": 4500,
    "bankReturnMultiplier": 1.5,
    "selectedReturn": 3,
    "isFinanced": "NAO",
    "status": "FINALIZADA"
  }' && echo " ✅"

# Proposta 3
echo "Criando proposta 3..."
curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 65000,
    "ilaValue": 4000,
    "returnValue": 2500,
    "bankReturnMultiplier": 1.1,
    "selectedReturn": 1,
    "isFinanced": "SIM",
    "status": "PENDENTE"
  }' && echo " ✅"

# Proposta 4
echo "Criando proposta 4..."
curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 45000,
    "ilaValue": 2500,
    "returnValue": 1800,
    "bankReturnMultiplier": 1.0,
    "selectedReturn": 1,
    "isFinanced": "SIM",
    "status": "FINALIZADA"
  }' && echo " ✅"

# Proposta 5
echo "Criando proposta 5..."
curl -s -X POST "https://barak-backend-665569303635.us-central1.run.app/proposta" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "value": 180000,
    "ilaValue": 12000,
    "returnValue": 8000,
    "bankReturnMultiplier": 2.0,
    "selectedReturn": 4,
    "isFinanced": "SIM",
    "status": "FINALIZADA"
  }' && echo " ✅"

echo ""
echo "🎉 Propostas criadas com sucesso!"
echo "📊 Agora você pode testar as páginas de vendas e relatórios!"