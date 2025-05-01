# Produtos CRUD

Este projeto é uma aplicação completa CRUD (Create, Read, Update, Delete) para gerenciamento de produtos e categorias. A aplicação possui uma arquitetura separada entre frontend e backend, proporcionando uma experiência de usuário moderna e responsiva.

## 📋 Visão Geral

O sistema permite:
- Visualizar, cadastrar, editar e excluir produtos
- Visualizar categorias e associá-las a produtos
- Interface amigável e responsiva

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React** - Biblioteca para construção de interfaces
- **Chakra UI** - Framework de componentes com design moderno
- **React Router** - Gerenciamento de rotas no frontend
- **Zustand** - Gerenciamento de estado leve e eficiente
- **Axios** - Cliente HTTP para comunicação com a API

### Backend
- **NestJS** - Framework para APIs robustas e escaláveis
- **Prisma** - ORM para manipulação do banco de dados
- **SQLite** - Banco de dados leve incorporado
- **Class Validator** - Validação robusta de dados
- **Jest** - Framework para testes automatizados

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes do Node)

### Configuração e Execução

#### Backend

1. Acesse o diretório do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure o banco de dados (crie um arquivo .env baseado no .env.example):
   ```bash
   cp .env.example .env
   ```

4. Execute as migrações do banco de dados:
   ```bash
   npx prisma migrate dev
   ```

5. Popule o banco com dados iniciais:
   ```bash
   npx prisma db seed
   ```

6. Inicie o servidor:
   ```bash
   npm run start:dev
   ```

O servidor backend estará executando em `http://localhost:3000`

#### Frontend

1. Em outro terminal, acesse o diretório do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O aplicativo frontend estará disponível em `http://localhost:5173`

## 📊 Funcionalidades Principais

### Gestão de Produtos
- Listagem de produtos com filtragem por nome
- Detalhes completos do produto
- Adição de novos produtos
- Edição de produtos existentes
- Exclusão de produtos

### Categorias
- Visualização de todas as categorias
- Associação de produtos a categorias

## 📝 Endpoints da API

### Produtos
- `GET /product` - Listar todos os produtos (suporta filtro por nome com ?name=termo)
- `GET /product/:id` - Obter detalhes de um produto
- `POST /product` - Criar novo produto
- `PATCH /product/:id` - Atualizar produto
- `DELETE /product/:id` - Remover produto

### Categorias
- `GET /category` - Listar todas as categorias com sua hierarquia

## 🧪 Testes

### Backend
- Execute os testes unitários:
  ```bash
  cd backend
  npm test
  ```

- Execute os testes de integração:
  ```bash
  cd backend
  npm run test:e2e
  ```

## 🔍 Solução de Problemas

- **Erro ao iniciar o backend**: Verifique se o arquivo `.env` existe e está configurado corretamente.
- **Problema com as migrações do Prisma**: Execute `npx prisma migrate reset` para reiniciar o banco de dados.
- **Frontend não conecta ao backend**: Confirme se o backend está rodando e se a URL base no frontend está configurada corretamente.

## 📚 Estrutura do Projeto

```
.
├── backend/             # Código do servidor NestJS
│   ├── prisma/          # Configurações e migrações do banco de dados
│   ├── src/
│   │   ├── product/     # Módulo de produtos
│   │   ├── category/    # Módulo de categorias
│   │   └── app.module.ts
│   └── package.json
│
└── frontend/            # Código do cliente React
    ├── src/
    │   ├── components/  # Componentes reutilizáveis
    │   ├── pages/       # Páginas da aplicação
    │   ├── store/       # Estados Zustand
    │   └── services/    # Serviços de API
    └── package.json
```

## ✨ Recursos Adicionais

- Interface responsiva para uso em dispositivos móveis
- Validação de formulários em tempo real
- Feedback visual para operações do usuário
- Design moderno e amigável com Chakra UI

---

Desenvolvido como um projeto de demonstração CRUD com React e NestJS.