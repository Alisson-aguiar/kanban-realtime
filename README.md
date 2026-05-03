# 🎯 Kanban Pro - Gestão de Tarefas em Tempo Real

![Kanban Pro Banner](/public/images/tela_inicial.jpg)

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.0-010101?logo=socket.io)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📋 Sobre o Projeto

**Kanban Pro** é uma aplicação completa de gerenciamento de tarefas no estilo Kanban, desenvolvida com foco em **experiência offline-first**, **sincronização em tempo real** e **gestão de equipes**.

### 🎯 Diferenciais Técnicos

- ✅ **Offline First**: Funciona sem internet usando IndexedDB
- ✅ **Tempo Real**: Sincronização instantânea via WebSocket
- ✅ **Drag & Drop**: Interface intuitiva com @dnd-kit
- ✅ **Gestão Completa**: Projetos, equipe e tarefas

## 🚀 Tecnologias Utilizadas

### Frontend
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Next.js | 16.2.4 | Framework React com App Router |
| TypeScript | 5.0 | Tipagem estática |
| Tailwind CSS | 3.4 | Estilização utilitária |
| shadcn/ui | Latest | Componentes acessíveis |
| Zustand | 4.5 | Gerenciamento de estado |
| React Hook Form | 7.51 | Formulários performáticos |
| Zod | 3.22 | Validação de schemas |
| @dnd-kit | 6.1 | Drag and drop |

### Backend & Sincronização
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Socket.io | 4.6 | WebSocket em tempo real |
| Dexie.js | 4.0 | IndexedDB wrapper |
| Next.js API | 16.2 | Rotas de API |

### Testes
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| Vitest | 1.6 | Testes unitários |
| Playwright | 1.42 | Testes E2E |

## 📸 Screenshots

### Tela Inicial
![Tela Inicial](/public/images/tela_inicial.jpg)

### Tela com Projetos, Membros e Tarefas
![Tela com Projetos e Tarefas](/public/images/tela_com_projetos_membros_e_tarefas_a_fazer_em_progresso_e_concluido.jpg)

### Criando uma Nova Tarefa
![Criando Tarefa](/public/images/tela_criando_tarefa.jpg)

### Projetos e Membros Criados
![Projetos e Membros](/public/images/tela_projeto_e_membro_criado.jpg)

## ✨ Funcionalidades

### 🎯 Tarefas
- ✅ Criar, editar e excluir tarefas
- ✅ Prioridades: Baixa, Média, Alta, Urgente
- ✅ Drag and drop entre colunas
- ✅ Reordenar dentro da mesma coluna
- ✅ Status pré-selecionado pela coluna

### 🏗️ Projetos
- ✅ CRUD completo de projetos
- ✅ Cores personalizadas
- ✅ Filtro por projeto
- ✅ Cores para identificação visual

### 👥 Equipe
- ✅ CRUD completo de membros
- ✅ Funções: Admin, Member, Viewer
- ✅ Status online/offline
- ✅ Filtro por responsável

### 🔌 Tempo Real
- ✅ WebSocket com Socket.io
- ✅ Sincronização multi-usuário
- ✅ Heartbeat e reconexão automática
- ✅ Métricas de conexão

### 📴 Offline First
- ✅ Cache local com IndexedDB
- ✅ Fila de sincronização
- ✅ Retry com backoff exponencial
- ✅ Sincronização automática ao voltar online

## 🧪 Testando o WebSocket

### Pré-requisitos
```bash
Node.js 18+
npm ou yarn