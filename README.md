# Todo App - Lista de Tarefas em Python

> **Este projeto foi inteiramente desenvolvido utilizando o [Kiro](https://kiro.dev), o assistente de desenvolvimento com IA da AWS.  
> Trata-se de um projeto de teste para explorar as capacidades desta tecnologia na criação de software de forma colaborativa e assistida por inteligência artificial.**

---

## Sobre o Projeto

Uma aplicação de lista de tarefas via linha de comando (CLI) desenvolvida em Python, com funcionalidades completas de gerenciamento, filtros, busca e estatísticas.

## Funcionalidades

| Funcionalidade | Descrição |
|----------------|-----------|
| Adicionar tarefas | Cria tarefas com descrição, prioridade e categoria |
| Listar tarefas | Exibe todas as tarefas em formato de tabela |
| Concluir tarefas | Marca tarefas como concluídas com registro de data |
| Remover tarefas | Remove tarefas com confirmação |
| Editar tarefas | Altera descrição, prioridade ou categoria |
| Buscar tarefas | Pesquisa por texto na descrição |
| Filtrar por status | Mostra apenas pendentes ou concluídas |
| Filtrar por prioridade | Filtra por alta, média ou baixa |
| Filtrar por categoria | Filtra por categorias personalizadas |
| Estatísticas | Exibe progresso, contagens e barra visual |

## Prioridades

- 🔴 **Alta** — Tarefas urgentes
- 🟡 **Média** — Prioridade padrão
- 🟢 **Baixa** — Podem esperar

## Como usar

```bash
python main.py
```

## Menu da Aplicação

```
==================================================
            📝 LISTA DE TAREFAS v2.0
==================================================
  1.  Adicionar tarefa
  2.  Listar todas as tarefas
  3.  Concluir tarefa
  4.  Remover tarefa
  5.  Editar tarefa
  6.  Buscar tarefas
  7.  Filtrar por status
  8.  Filtrar por prioridade
  9.  Filtrar por categoria
  10. Estatísticas
  0.  Sair
==================================================
```

## Estrutura do Projeto

```
todo-app/
├── main.py          # Interface CLI interativa
├── todo.py          # Módulo de lógica (CRUD + filtros + estatísticas)
├── tarefas.json     # Dados persistidos (criado automaticamente)
└── README.md        # Documentação
```

## Requisitos

- Python 3.10+

## Desenvolvido com Kiro

Este projeto é uma demonstração prática do uso do **Kiro** como ferramenta de desenvolvimento assistido por IA. Todo o código — da concepção à implementação — foi gerado de forma colaborativa com o Kiro, incluindo:

- Estruturação do projeto
- Implementação das funcionalidades
- Evolução e refatoração do código
- Testes de validação
- Documentação
- Versionamento e push para o GitHub

O objetivo é testar e demonstrar como a IA pode acelerar o processo de desenvolvimento de software, mantendo a qualidade e organização do código.

---

*Projeto criado em Junho/2026 como teste da tecnologia Kiro.*
