#!/bin/bash

# Script para testar a conectividade do backend
# Execute: chmod +x test-backend.sh && ./test-backend.sh

API_URL="${NEXT_PUBLIC_API_URL:-http://localhost:8089}"

echo "🧪 Testando conectividade do backend..."
echo "📡 URL da API: $API_URL"
echo ""

# Teste 1: Verificar se o servidor está respondendo
echo "1️⃣ Testando conectividade básica..."
if curl -s --connect-timeout 5 "$API_URL" > /dev/null 2>&1; then
    echo "✅ Servidor está respondendo"
else
    echo "❌ Servidor não está respondendo"
    echo "   Verifique se o backend está rodando na porta 8089"
    exit 1
fi

# Teste 2: Testar endpoint de login
echo ""
echo "2️⃣ Testando endpoint de login..."
RESPONSE=$(curl -s -w "%{http_code}" -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}')

HTTP_CODE="${RESPONSE: -3}"
BODY="${RESPONSE%???}"

echo "Status HTTP: $HTTP_CODE"

if [ "$HTTP_CODE" = "500" ] || [ "$HTTP_CODE" = "401" ] || [ "$HTTP_CODE" = "400" ]; then
    echo "✅ Endpoint de login está funcionando (retornou erro esperado)"
    
    # Verifica se a resposta contém "não encontrado"
    if echo "$BODY" | grep -q "não encontrado"; then
        echo "✅ Mensagem de erro em português detectada"
    else
        echo "⚠️  Mensagem de erro pode estar em inglês"
    fi
else
    echo "❌ Endpoint de login retornou status inesperado: $HTTP_CODE"
fi

# Teste 3: Testar CORS
echo ""
echo "3️⃣ Testando CORS..."
CORS_RESPONSE=$(curl -s -w "%{http_code}" -X OPTIONS "$API_URL/auth/login" \
    -H "Origin: http://localhost:3000" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")

CORS_CODE="${CORS_RESPONSE: -3}"

if [ "$CORS_CODE" = "200" ] || [ "$CORS_CODE" = "204" ]; then
    echo "✅ CORS está configurado"
else
    echo "⚠️  CORS pode ter problemas (status: $CORS_CODE)"
fi

echo ""
echo "🏁 Testes concluídos!"
echo ""
echo "💡 Para testes mais detalhados, acesse: http://localhost:3000/tests"