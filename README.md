# Todo App - Lista de Tarefas

> **🤖 Este projeto foi inteiramente desenvolvido utilizando o [Kiro](https://kiro.dev), o assistente de desenvolvimento com IA da AWS.  
> Trata-se de um projeto de teste para explorar as capacidades desta tecnologia na criação de software de forma colaborativa e assistida por inteligência artificial.**

---

## 🌐 Versão Web (GitHub Pages)

A versão web está disponível online via GitHub Pages:

🔗 **[https://thiago574.github.io/todo-app/web/](https://thiago574.github.io/todo-app/web/)**

### Como ativar o GitHub Pages:

1. Acesse o repositório no GitHub
2. Vá em **Settings** → **Pages**
3. Em "Source", selecione **Deploy from a branch**
4. Escolha a branch `projeto-todo-app` e pasta `/ (root)`
5. Clique em **Save**
6. Aguarde alguns minutos e acesse o link acima

---

## 📁 Estrutura do Projeto

```
todo-app/
├── main.py              # CLI em Python - Interface interativa
├── todo.py              # CLI em Python - Módulo de lógica
├── README.md            # Documentação
└── web/                 # Versão Web (GitHub Pages)
    ├── index.html       # Estrutura da página
    ├── style.css        # Estilos e design responsivo
    └── app.js           # Lógica da aplicação (JavaScript)
```

---

## 🐍 Versão Python (CLI)

Aplicação de linha de comando para gerenciamento de tarefas.

### Como executar:

```bash
python main.py
```

### Menu da CLI:

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

---

## 🌐 Versão Web (HTML/CSS/JS)

Interface moderna e responsiva que roda diretamente no navegador, sem necessidade de servidor.

### Tecnologias:

- **HTML5** — Estrutura semântica
- **Tailwind CSS** — Framework utility-first (via CDN) com design system moderno
- **JavaScript (ES6+)** — Lógica da aplicação com localStorage
- **Google Fonts (Inter)** — Tipografia moderna
- **Lucide Icons** — Iconografia SVG leve e consistente
- **Dark Mode** — Suporte nativo a tema escuro/claro

### Para rodar localmente:

Basta abrir o arquivo `web/index.html` no navegador, ou usar um servidor local:

```bash
cd web
python -m http.server 8000
# Acesse: http://localhost:8000
```

---

## ✨ Funcionalidades (ambas as versões)

| Funcionalidade | Descrição |
|----------------|-----------|
| ➕ Adicionar tarefas | Cria tarefas com descrição, prioridade e categoria |
| 📋 Listar tarefas | Exibe todas as tarefas em formato organizado |
| ✅ Concluir tarefas | Marca tarefas como concluídas com registro de data |
| 🗑️ Remover tarefas | Remove tarefas com confirmação |
| ✏️ Editar tarefas | Altera descrição, prioridade ou categoria |
| 🔍 Buscar tarefas | Pesquisa por texto na descrição |
| 🗂️ Filtrar por status | Mostra apenas pendentes ou concluídas |
| 🎯 Filtrar por prioridade | Filtra por alta, média ou baixa |
| 🏷️ Filtrar por categoria | Filtra por categorias personalizadas |
| 📊 Estatísticas | Progresso, contagens e barra visual |

## Prioridades

- 🔴 **Alta** — Tarefas urgentes
- 🟡 **Média** — Prioridade padrão
- 🟢 **Baixa** — Podem esperar

---

## 💾 Armazenamento

| Versão | Método |
|--------|--------|
| Python (CLI) | Arquivo `tarefas.json` local |
| Web | `localStorage` do navegador |

---

## Requisitos

- **Python CLI:** Python 3.10+
- **Web:** Navegador moderno (Chrome, Firefox, Edge, Safari)

---

## 🤖 Desenvolvido com Kiro

Este projeto é uma demonstração prática do uso do **[Kiro](https://kiro.dev)** como ferramenta de desenvolvimento assistido por IA. Todo o código — da concepção à implementação — foi gerado de forma colaborativa com o Kiro, incluindo:

- ✅ Estruturação do projeto (Python + Web)
- ✅ Implementação das funcionalidades
- ✅ Evolução e refatoração do código
- ✅ Design responsivo e moderno
- ✅ Testes de validação
- ✅ Documentação completa
- ✅ Versionamento e deploy no GitHub

O objetivo é testar e demonstrar como a IA pode acelerar o processo de desenvolvimento de software, mantendo a qualidade e organização do código.

---

*Projeto criado em Junho/2026 como teste da tecnologia Kiro.*

---

> 🧪 Teste de conexão Git realizado em 09/06/2026 via Kiro IDE.
