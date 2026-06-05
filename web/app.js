/**
 * Todo App - Lógica da Aplicação
 * Desenvolvido com Kiro AI
 */

// ========================================
// GERENCIAMENTO DE DADOS (localStorage)
// ========================================

const STORAGE_KEY = "todo-app-tarefas";

function carregarTarefas() {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarTarefas(tarefas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tarefas));
}

function gerarId(tarefas) {
    if (tarefas.length === 0) return 1;
    return Math.max(...tarefas.map((t) => t.id)) + 1;
}

function obterDataAtual() {
    const agora = new Date();
    const dia = String(agora.getDate()).padStart(2, "0");
    const mes = String(agora.getMonth() + 1).padStart(2, "0");
    const ano = agora.getFullYear();
    const hora = String(agora.getHours()).padStart(2, "0");
    const min = String(agora.getMinutes()).padStart(2, "0");
    return `${dia}/${mes}/${ano} ${hora}:${min}`;
}

// ========================================
// OPERAÇÕES CRUD
// ========================================

function adicionarTarefa(descricao, prioridade, categoria) {
    const tarefas = carregarTarefas();
    const novaTarefa = {
        id: gerarId(tarefas),
        descricao: descricao.trim(),
        concluida: false,
        prioridade: prioridade || "media",
        categoria: categoria.trim().toLowerCase() || "geral",
        criada_em: obterDataAtual(),
        concluida_em: null,
    };
    tarefas.push(novaTarefa);
    salvarTarefas(tarefas);
    return novaTarefa;
}

function concluirTarefa(id) {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find((t) => t.id === id);
    if (tarefa) {
        tarefa.concluida = !tarefa.concluida;
        tarefa.concluida_em = tarefa.concluida ? obterDataAtual() : null;
        salvarTarefas(tarefas);
        return true;
    }
    return false;
}

function editarTarefa(id, descricao, prioridade, categoria) {
    const tarefas = carregarTarefas();
    const tarefa = tarefas.find((t) => t.id === id);
    if (tarefa) {
        if (descricao) tarefa.descricao = descricao.trim();
        if (prioridade) tarefa.prioridade = prioridade;
        if (categoria) tarefa.categoria = categoria.trim().toLowerCase();
        salvarTarefas(tarefas);
        return true;
    }
    return false;
}

function removerTarefa(id) {
    const tarefas = carregarTarefas();
    const filtradas = tarefas.filter((t) => t.id !== id);
    if (filtradas.length < tarefas.length) {
        salvarTarefas(filtradas);
        return true;
    }
    return false;
}

// ========================================
// FILTROS E BUSCA
// ========================================

function aplicarFiltros(tarefas) {
    const status = document.getElementById("filtro-status").value;
    const prioridade = document.getElementById("filtro-prioridade").value;
    const categoria = document.getElementById("filtro-categoria").value;
    const busca = document.getElementById("filtro-busca").value.toLowerCase().trim();

    let resultado = [...tarefas];

    // Filtro por status
    if (status === "pendentes") {
        resultado = resultado.filter((t) => !t.concluida);
    } else if (status === "concluidas") {
        resultado = resultado.filter((t) => t.concluida);
    }

    // Filtro por prioridade
    if (prioridade !== "todas") {
        resultado = resultado.filter((t) => t.prioridade === prioridade);
    }

    // Filtro por categoria
    if (categoria !== "todas") {
        resultado = resultado.filter((t) => t.categoria === categoria);
    }

    // Busca por texto
    if (busca) {
        resultado = resultado.filter((t) =>
            t.descricao.toLowerCase().includes(busca)
        );
    }

    return resultado;
}

// ========================================
// ESTATÍSTICAS
// ========================================

function calcularEstatisticas(tarefas) {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluida).length;
    const pendentes = total - concluidas;
    const percentual = total > 0 ? Math.round((concluidas / total) * 100) : 0;

    return { total, concluidas, pendentes, percentual };
}

function atualizarEstatisticas() {
    const tarefas = carregarTarefas();
    const stats = calcularEstatisticas(tarefas);

    document.getElementById("stat-total").textContent = stats.total;
    document.getElementById("stat-pendentes").textContent = stats.pendentes;
    document.getElementById("stat-concluidas").textContent = stats.concluidas;
    document.getElementById("stat-percentual").textContent = `${stats.percentual}%`;
    document.getElementById("barra-progresso-fill").style.width = `${stats.percentual}%`;
}

// ========================================
// RENDERIZAÇÃO
// ========================================

function renderizarTarefas() {
    const tarefas = carregarTarefas();
    const tarefasFiltradas = aplicarFiltros(tarefas);
    const lista = document.getElementById("lista-tarefas");
    const listaVazia = document.getElementById("lista-vazia");
    const contador = document.getElementById("contador-tarefas");

    // Limpar lista (manter apenas o elemento vazio)
    lista.innerHTML = "";

    if (tarefasFiltradas.length === 0) {
        lista.appendChild(criarElementoVazio());
        contador.textContent = "0 tarefas";
    } else {
        const plural = tarefasFiltradas.length === 1 ? "tarefa" : "tarefas";
        contador.textContent = `${tarefasFiltradas.length} ${plural}`;

        tarefasFiltradas.forEach((tarefa) => {
            lista.appendChild(criarElementoTarefa(tarefa));
        });
    }

    atualizarEstatisticas();
    atualizarCategorias();
}

function criarElementoVazio() {
    const p = document.createElement("p");
    p.className = "lista-vazia";
    p.textContent = "📭 Nenhuma tarefa encontrada.";
    return p;
}

function criarElementoTarefa(tarefa) {
    const div = document.createElement("div");
    div.className = `tarefa-item prioridade-${tarefa.prioridade}${tarefa.concluida ? " concluida" : ""}`;
    div.dataset.id = tarefa.id;

    const prioridadeEmoji = {
        alta: "🔴",
        media: "🟡",
        baixa: "🟢",
    };

    div.innerHTML = `
        <input type="checkbox" class="tarefa-checkbox" 
               ${tarefa.concluida ? "checked" : ""} 
               title="Marcar como ${tarefa.concluida ? "pendente" : "concluída"}">
        <div class="tarefa-conteudo">
            <div class="tarefa-descricao">${escapeHtml(tarefa.descricao)}</div>
            <div class="tarefa-meta">
                <span class="tarefa-tag tag-prioridade-${tarefa.prioridade}">
                    ${prioridadeEmoji[tarefa.prioridade]} ${tarefa.prioridade}
                </span>
                <span class="tarefa-tag">🏷️ ${escapeHtml(tarefa.categoria)}</span>
                <span class="tarefa-tag">📅 ${tarefa.criada_em}</span>
                ${tarefa.concluida_em ? `<span class="tarefa-tag">✅ ${tarefa.concluida_em}</span>` : ""}
            </div>
        </div>
        <div class="tarefa-acoes">
            <button class="btn-acao btn-editar" title="Editar">✏️</button>
            <button class="btn-acao btn-remover" title="Remover">🗑️</button>
        </div>
    `;

    // Event listeners
    const checkbox = div.querySelector(".tarefa-checkbox");
    checkbox.addEventListener("change", () => {
        concluirTarefa(tarefa.id);
        renderizarTarefas();
    });

    const btnEditar = div.querySelector(".btn-editar");
    btnEditar.addEventListener("click", () => abrirModalEditar(tarefa));

    const btnRemover = div.querySelector(".btn-remover");
    btnRemover.addEventListener("click", () => {
        if (confirm(`Deseja remover a tarefa "${tarefa.descricao}"?`)) {
            removerTarefa(tarefa.id);
            renderizarTarefas();
        }
    });

    return div;
}

function escapeHtml(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// ========================================
// CATEGORIAS DINÂMICAS
// ========================================

function atualizarCategorias() {
    const tarefas = carregarTarefas();
    const categorias = [...new Set(tarefas.map((t) => t.categoria))].sort();
    const select = document.getElementById("filtro-categoria");
    const valorAtual = select.value;

    // Manter a primeira opção
    select.innerHTML = '<option value="todas">Todas</option>';

    categorias.forEach((cat) => {
        const option = document.createElement("option");
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
    });

    // Restaurar valor selecionado
    if (categorias.includes(valorAtual)) {
        select.value = valorAtual;
    }
}

// ========================================
// MODAL DE EDIÇÃO
// ========================================

function abrirModalEditar(tarefa) {
    const modal = document.getElementById("modal-editar");
    document.getElementById("editar-id").value = tarefa.id;
    document.getElementById("editar-descricao").value = tarefa.descricao;
    document.getElementById("editar-prioridade").value = tarefa.prioridade;
    document.getElementById("editar-categoria").value = tarefa.categoria;
    modal.hidden = false;
}

function fecharModalEditar() {
    const modal = document.getElementById("modal-editar");
    modal.hidden = true;
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    // Renderizar tarefas ao carregar
    renderizarTarefas();

    // Formulário de adicionar
    const formAdicionar = document.getElementById("form-tarefa");
    formAdicionar.addEventListener("submit", (e) => {
        e.preventDefault();

        const descricao = document.getElementById("input-descricao").value.trim();
        const prioridade = document.getElementById("select-prioridade").value;
        const categoria = document.getElementById("input-categoria").value.trim() || "geral";

        if (!descricao) return;

        adicionarTarefa(descricao, prioridade, categoria);

        // Limpar formulário
        document.getElementById("input-descricao").value = "";
        document.getElementById("select-prioridade").value = "media";
        document.getElementById("input-categoria").value = "geral";

        renderizarTarefas();

        // Foco de volta no input
        document.getElementById("input-descricao").focus();
    });

    // Formulário de editar
    const formEditar = document.getElementById("form-editar");
    formEditar.addEventListener("submit", (e) => {
        e.preventDefault();

        const id = parseInt(document.getElementById("editar-id").value);
        const descricao = document.getElementById("editar-descricao").value.trim();
        const prioridade = document.getElementById("editar-prioridade").value;
        const categoria = document.getElementById("editar-categoria").value.trim();

        editarTarefa(id, descricao, prioridade, categoria);
        fecharModalEditar();
        renderizarTarefas();
    });

    // Botão cancelar modal
    document.getElementById("btn-cancelar-editar").addEventListener("click", fecharModalEditar);

    // Fechar modal clicando fora
    document.getElementById("modal-editar").addEventListener("click", (e) => {
        if (e.target.classList.contains("modal-overlay")) {
            fecharModalEditar();
        }
    });

    // Fechar modal com ESC
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            fecharModalEditar();
        }
    });

    // Filtros - aplicar ao mudar
    const filtros = ["filtro-status", "filtro-prioridade", "filtro-categoria"];
    filtros.forEach((id) => {
        document.getElementById(id).addEventListener("change", renderizarTarefas);
    });

    // Busca - aplicar ao digitar (com debounce)
    let buscaTimeout;
    document.getElementById("filtro-busca").addEventListener("input", () => {
        clearTimeout(buscaTimeout);
        buscaTimeout = setTimeout(renderizarTarefas, 300);
    });
});
