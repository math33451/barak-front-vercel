#!/bin/bash

echo "🗑️ LIMPANDO BANCO DE DADOS MYSQL..."

# Conectar no MySQL e limpar usuarios duplicados
mysql -u root -proot12 barak_db << 'EOF'
-- Mostrar usuarios antes
SELECT id, email, nome FROM usuarios;

-- Deletar TODOS os usuarios 
DELETE FROM usuarios;

-- Confirmar que foi limpo
SELECT COUNT(*) as total_usuarios FROM usuarios;

-- Inserir apenas UM usuario de teste
INSERT INTO usuarios (nome, email, password, telefone, cargo, ativo, email_validated, created_at, updated_at) 
VALUES ('Usuário Teste', 'user@teste.com', '$2a$10$N.KGdSfIyWBJqJd2/6fLaeWd0ALMS/8fLWL.aDfg9U8lJkjLF2RLi', '11999999999', 'USER', 1, 1, NOW(), NOW());

-- Confirmar que foi criado
SELECT id, email, nome FROM usuarios;
EOF

echo "✅ Banco limpo e usuario único criado!"