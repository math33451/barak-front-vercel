#!/bin/bash

BASE_URL="http://localhost:8089"
EMAIL="user@teste.com"
PASSWORD="123456"

echo "🔍 Iniciando população de dados de teste para o Barak System..."

# Function to make HTTP requests with error handling
make_request() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo "📤 $description..."
    
    if [ "$method" = "POST" ]; then
        response=$(curl -s -w "\n%{http_code}" -X POST \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            -d "$data" \
            "$BASE_URL$endpoint")
    else
        response=$(curl -s -w "\n%{http_code}" -X GET \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer $TOKEN" \
            "$BASE_URL$endpoint")
    fi
    
    # Separate body and status code
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')
    
    if [[ $http_code -ge 200 && $http_code -lt 300 ]]; then
        echo "✅ Sucesso ($http_code): $description"
        # Store response for later use if needed
        eval "${5:-LAST_RESPONSE}='$body'"
    else
        echo "❌ Erro ($http_code): $description"
        echo "Response: $body"
    fi
    
    echo ""
}

# Step 1: Authenticate and get token
echo "🔐 Fazendo login com admin@barak.com..."
login_response=$(curl -s -w "\n%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}" \
    "$BASE_URL/auth/login")

http_code=$(echo "$login_response" | tail -n1)
body=$(echo "$login_response" | sed '$d')

if [[ $http_code -eq 200 ]]; then
    TOKEN=$(echo "$body" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
    echo "✅ Login realizado com sucesso!"
    echo "🎟️  Token obtido: ${TOKEN:0:20}..."
else
    echo "❌ Erro no login ($http_code)"
    echo "Response: $body"
    exit 1
fi

echo ""

# Step 2: Create Unidades Empresariais
echo "🏢 Criando Unidades Empresariais..."

unidade1_data='{
    "name": "Matriz São Paulo"
}'

unidade2_data='{
    "name": "Filial Rio de Janeiro"
}'

make_request "POST" "/rest/unidade" "$unidade1_data" "Criando Unidade Matriz São Paulo"
make_request "POST" "/rest/unidade" "$unidade2_data" "Criando Unidade Filial Rio de Janeiro"

# Step 3: Create Banks
echo "🏦 Criando Bancos..."

banco1_data='{
    "nomeBanco": "Banco do Brasil",
    "retorno1": 0.8,
    "retorno2": 1.2,
    "retorno3": 1.5,
    "retorno4": 1.8,
    "retorno5": 2.0
}'

banco2_data='{
    "nomeBanco": "Itaú Unibanco",
    "retorno1": 0.85,
    "retorno2": 1.15,
    "retorno3": 1.45,
    "retorno4": 1.75,
    "retorno5": 2.1
}'

banco3_data='{
    "nomeBanco": "Caixa Econômica Federal",
    "retorno1": 0.9,
    "retorno2": 1.1,
    "retorno3": 1.4,
    "retorno4": 1.7,
    "retorno5": 2.0
}'

banco4_data='{
    "nomeBanco": "Santander",
    "retorno1": 0.75,
    "retorno2": 1.25,
    "retorno3": 1.55,
    "retorno4": 1.85,
    "retorno5": 2.2
}'

banco5_data='{
    "nomeBanco": "Bradesco",
    "retorno1": 0.82,
    "retorno2": 1.18,
    "retorno3": 1.48,
    "retorno4": 1.78,
    "retorno5": 2.05
}'

make_request "POST" "/rest/banco/salvar" "$banco1_data" "Criando Banco do Brasil" "BANCO1_RESPONSE"
make_request "POST" "/rest/banco/salvar" "$banco2_data" "Criando Itaú Unibanco" "BANCO2_RESPONSE"
make_request "POST" "/rest/banco/salvar" "$banco3_data" "Criando Caixa Econômica Federal" "BANCO3_RESPONSE"
make_request "POST" "/rest/banco/salvar" "$banco4_data" "Criando Santander" "BANCO4_RESPONSE"
make_request "POST" "/rest/banco/salvar" "$banco5_data" "Criando Bradesco" "BANCO5_RESPONSE"

# Step 4: Create Clients
echo "👥 Criando Clientes..."

client1_data='{
    "name": "João Silva Santos",
    "email": "joao.silva@email.com",
    "phone": "(11) 99999-1111",
    "cpf": "123.456.789-01"
}'

client2_data='{
    "name": "Maria Oliveira Costa",
    "email": "maria.oliveira@email.com", 
    "phone": "(11) 99999-2222",
    "cpf": "234.567.890-12"
}'

client3_data='{
    "name": "Pedro Santos Lima",
    "email": "pedro.santos@email.com",
    "phone": "(11) 99999-3333", 
    "cpf": "345.678.901-23"
}'

client4_data='{
    "name": "Ana Ferreira Alves",
    "email": "ana.ferreira@email.com",
    "phone": "(11) 99999-4444",
    "cpf": "456.789.012-34"
}'

client5_data='{
    "name": "Carlos Eduardo Silva",
    "email": "carlos.eduardo@email.com",
    "phone": "(11) 99999-5555",
    "cpf": "567.890.123-45"
}'

make_request "POST" "/rest/cliente/salvar" "$client1_data" "Criando cliente João Silva Santos"
make_request "POST" "/rest/cliente/salvar" "$client2_data" "Criando cliente Maria Oliveira Costa"
make_request "POST" "/rest/cliente/salvar" "$client3_data" "Criando cliente Pedro Santos Lima"
make_request "POST" "/rest/cliente/salvar" "$client4_data" "Criando cliente Ana Ferreira Alves"
make_request "POST" "/rest/cliente/salvar" "$client5_data" "Criando cliente Carlos Eduardo Silva"

# Step 5: Create Funcionários
echo "👨‍💼 Criando Funcionários..."

funcionario1_data='{
    "nomeFuncionario": "Roberto Silva Manager", 
    "cpfFuncionario": "111.222.333-44",
    "idUnidadeEmpresa": 1,
    "isGerente": {
        "id": "S",
        "descricao": "SIM",
        "logical": true
    }
}'

funcionario2_data='{
    "nomeFuncionario": "Julia Vendedora Santos",
    "cpfFuncionario": "222.333.444-55", 
    "idUnidadeEmpresa": 1,
    "isGerente": {
        "id": "N",
        "descricao": "NÃO",
        "logical": false
    }
}'

funcionario3_data='{
    "nomeFuncionario": "Rafael Consultor Lima",
    "cpfFuncionario": "333.444.555-66",
    "idUnidadeEmpresa": 2,
    "isGerente": {
        "id": "N",
        "descricao": "NÃO",
        "logical": false
    }
}'

make_request "POST" "/rest/funcionarios" "$funcionario1_data" "Criando funcionário Roberto Silva Manager"
make_request "POST" "/rest/funcionarios" "$funcionario2_data" "Criando funcionária Julia Vendedora Santos"
make_request "POST" "/rest/funcionarios" "$funcionario3_data" "Criando funcionário Rafael Consultor Lima"

# Step 6: Create Acordos (para a página de retorno)
echo "🤝 Criando Acordos com Bancos..."

acordo1_data='{
    "idBanco": 1,
    "idUnidade": 1,
    "retorno1": 0.8,
    "retorno2": 1.2,
    "retorno3": 1.5,
    "retorno4": 1.8,
    "retorno5": 2.0
}'

acordo2_data='{
    "idBanco": 2,
    "idUnidade": 1,
    "retorno1": 0.85,
    "retorno2": 1.15,
    "retorno3": 1.45,
    "retorno4": 1.75,
    "retorno5": 2.1
}'

acordo3_data='{
    "idBanco": 3,
    "idUnidade": 2,
    "retorno1": 0.9,
    "retorno2": 1.1,
    "retorno3": 1.4,
    "retorno4": 1.7,
    "retorno5": 2.0
}'

make_request "POST" "/rest/acordo/salvar" "$acordo1_data" "Criando acordo BB x Matriz SP"
make_request "POST" "/rest/acordo/salvar" "$acordo2_data" "Criando acordo Itaú x Matriz SP"
make_request "POST" "/rest/acordo/salvar" "$acordo3_data" "Criando acordo CEF x Filial RJ"

# Step 7: Create Sample Proposals (para gerar vendas)
echo "📋 Criando Propostas de Exemplo..."

# Observação: backend espera strings simples para status (FINALIZADA, PENDENTE, CANCELADA)
# e para isFinanciado (SIM, NAO) conforme converters JPA.

current_year=$(date +%Y)

proposta1_data='{
    "idVendedor": 1,
    "idCliente": 1,
    "valorPropostaReal": 85000.0,
    "valorPropostaArrecadadoILA": 80000.0,
    "isFinanciado": "SIM",
    "idBanco": 1,
    "retornoSelecionado": 2,
    "multiplicadorRetornoBanco": 1.2,
    "valorRetorno": 5000.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-01-15"
}'

proposta2_data='{
    "idVendedor": 2,
    "idCliente": 2,
    "valorPropostaReal": 120000.0,
    "valorPropostaArrecadadoILA": 115000.0,
    "isFinanciado": "SIM",
    "idBanco": 2,
    "retornoSelecionado": 1,
    "multiplicadorRetornoBanco": 1.1,
    "valorRetorno": 6000.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-02-10"
}'

proposta3_data='{
    "idVendedor": 1,
    "idCliente": 3,
    "valorPropostaReal": 95000.0,
    "valorPropostaArrecadadoILA": 90000.0,
    "isFinanciado": "NAO",
    "idBanco": 3,
    "retornoSelecionado": 3,
    "multiplicadorRetornoBanco": 1.15,
    "valorRetorno": 4000.0,
    "status": "PENDENTE"
}'

proposta4_data='{
    "idVendedor": 2,
    "idCliente": 4,
    "valorPropostaReal": 70000.0,
    "valorPropostaArrecadadoILA": 68000.0,
    "isFinanciado": "SIM",
    "idBanco": 1,
    "retornoSelecionado": 4,
    "multiplicadorRetornoBanco": 1.05,
    "valorRetorno": 3500.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-03-05"
}'

proposta5_data='{
    "idVendedor": 1,
    "idCliente": 5,
    "valorPropostaReal": 110000.0,
    "valorPropostaArrecadadoILA": 108000.0,
    "isFinanciado": "SIM",
    "idBanco": 2,
    "retornoSelecionado": 5,
    "multiplicadorRetornoBanco": 1.25,
    "valorRetorno": 7500.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-03-28"
}'

proposta6_data='{
    "idVendedor": 2,
    "idCliente": 1,
    "valorPropostaReal": 65000.0,
    "valorPropostaArrecadadoILA": 63000.0,
    "isFinanciado": "NAO",
    "idBanco": 3,
    "retornoSelecionado": 2,
    "multiplicadorRetornoBanco": 1.18,
    "valorRetorno": 3200.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-04-12"
}'

proposta7_data='{
    "idVendedor": 1,
    "idCliente": 2,
    "valorPropostaReal": 140000.0,
    "valorPropostaArrecadadoILA": 134000.0,
    "isFinanciado": "SIM",
    "idBanco": 1,
    "retornoSelecionado": 1,
    "multiplicadorRetornoBanco": 1.3,
    "valorRetorno": 9000.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-05-20"
}'

proposta8_data='{
    "idVendedor": 2,
    "idCliente": 3,
    "valorPropostaReal": 50000.0,
    "valorPropostaArrecadadoILA": 48000.0,
    "isFinanciado": "SIM",
    "idBanco": 2,
    "retornoSelecionado": 3,
    "multiplicadorRetornoBanco": 1.12,
    "valorRetorno": 2800.0,
    "status": "FINALIZADA",
    "dataVenda": "'$current_year'-05-27"
}'

make_request "POST" "/rest/proposta" "$proposta1_data" "Criando proposta finalizada 1 (Jan)"
make_request "POST" "/rest/proposta" "$proposta2_data" "Criando proposta finalizada 2 (Fev)"
make_request "POST" "/rest/proposta" "$proposta3_data" "Criando proposta pendente 3"
make_request "POST" "/rest/proposta" "$proposta4_data" "Criando proposta finalizada 4 (Mar)"
make_request "POST" "/rest/proposta" "$proposta5_data" "Criando proposta finalizada 5 (Mar)"
make_request "POST" "/rest/proposta" "$proposta6_data" "Criando proposta finalizada 6 (Abr)"
make_request "POST" "/rest/proposta" "$proposta7_data" "Criando proposta finalizada 7 (Mai)"
make_request "POST" "/rest/proposta" "$proposta8_data" "Criando proposta finalizada 8 (Mai)"

echo "🎉 População de dados de teste concluída!"
echo ""
echo "📋 Resumo dos dados criados:"
echo "   • Unidades: 2 (Matriz SP, Filial RJ)"
echo "   • Bancos: 5 (com retornos configurados)"
echo "   • Clientes: 5 pessoas"
echo "   • Funcionários: 3 (1 manager, 2 vendedores)"
echo "   • Acordos: 3 (para página de retorno)"
echo "   • Propostas: 8 (7 finalizadas = vendas, 1 pendente)"
echo ""
echo "🔑 Use as credenciais: admin@barak.com / 123456"
echo "🌐 Acesse: http://localhost:3001"
echo ""
echo "✨ Agora todas as páginas têm dados para exibir!"