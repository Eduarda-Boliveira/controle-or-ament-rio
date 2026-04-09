# Controle Financeiro

Aplicação web full-stack para controle orçamentário (receitas, despesas e saldos).

## 📋 Descrição do Projeto

O objetivo do projeto é desenhar e construir uma aplicação web para controle orçamentário, permitindo o gerenciamento completo de receitas, despesas e saldos com foco na consistência de dados.

## ✨ Funcionalidades

A aplicação permite ao usuário final:

- ✅ Registrar-se e realizar sua autenticação (login/logout)
- ✅ Permanecer logado ao fechar a aba ou navegador (controle de sessão)
- ✅ Cadastrar, editar e excluir despesas (mesmo sem categoria)
- ✅ Cadastrar, editar e excluir receitas (mesmo sem categoria)
- ✅ Consultar saldos
- ✅ Cadastrar, editar e excluir categorias
- ✅ Cadastrar e relacionar categorias às despesas e receitas
- ✅ Listar e filtrar as receitas e despesas por data e/ou categoria
- ✅ Valores com precisão de dezenas de centavos (exemplo: R$25,99)

## 🔒 Segurança

A aplicação **NÃO permite** ao usuário final:

- ✅ Acessar ou interagir com dados de outro usuário

## 🎯 Consistência de Dados

O foco da aplicação é a consistência de dados! Toda alteração é corretamente refletida nas listagens:

- ✅ Uma receita reflete positivamente no saldo
- ✅ Uma despesa reflete negativamente no saldo
- ✅ A mudança de um registro de uma categoria para outra reflete na listagem por filtros
- ✅ Quando uma categoria é excluída, os registros dessa categoria são atualizados (para ficarem sem categoria definida)

## ⚠️ Tratamento de Erros

- Em caso de falhas pelo lado do cliente, o usuário recebe instruções claras sobre o problema
- Em caso de falhas do servidor, o usuário recebe uma mensagem amigável e compreensível

## 🏗️ Arquitetura

O projeto segue uma arquitetura em três camadas:

1. **Frontend** - Interface de interação do usuário final (React + TypeScript + Vite)
2. **Backend** - API REST para lidar com as requisições (Node.js + Express + TypeScript)
3. **Banco de Dados** - Camada de persistência (PostgreSQL + Prisma ORM)

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- TypeScript
- Express
- Prisma ORM
- PostgreSQL
- AWS Cognito (Autenticação JWT)
- Docker

### Frontend
- React
- TypeScript
- Vite
- CSS Modules
- Axios

### DevOps
- Docker & Docker Compose
- Git & GitHub

## 📦 Pré-requisitos

- Node.js (v18 ou superior)
- Docker e Docker Compose
- Git

## 📚 API Collection

O projeto inclui uma coleção Bruno para testes da API, localizada em `backend/bruno-collection/`.

## 🗂️ Estrutura do Projeto

```
controle-financeiro/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middlewares/
│   │   └── database/
│   ├── prisma/
│   └── bruno-collection/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── atoms/
│       │   ├── molecules/
│       │   ├── organisms/
│       │   ├── pages/
│       │   └── templates/
│       └── api/
└── docker-compose.yml
```
