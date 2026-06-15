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
    const contador = document.getElementById("contador-tarefas");

    // Limpar lista
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
    
    // Re-initialize Lucide icons if available
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
}

function criarElementoVazio() {
    const div = document.createElement("div");
    div.className = "text-center py-12 text-gray-400 dark:text-gray-500";
    div.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
        </svg>
        <span class="block text-sm">Nenhuma tarefa encontrada.</span>
    `;
    return div;
}

function criarElementoTarefa(tarefa) {
    const div = document.createElement("div");
    
    const prioridadeBorder = {
        alta: "border-l-red-400",
        media: "border-l-yellow-400",
        baixa: "border-l-emerald-400",
    };
    
    const prioridadeBadge = {
        alta: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300",
        media: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
        baixa: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300",
    };

    const prioridadeEmoji = {
        alta: "🔴",
        media: "🟡",
        baixa: "🟢",
    };

    const baseClasses = `flex items-center gap-3 p-4 rounded-xl border-l-4 ${prioridadeBorder[tarefa.prioridade]} transition-all hover:shadow-md hover:translate-x-1 animate-slide-up`;
    const bgClasses = tarefa.concluida 
        ? "bg-emerald-50/50 dark:bg-emerald-900/10 opacity-70" 
        : "bg-white/50 dark:bg-gray-800/50";
    
    div.className = `${baseClasses} ${bgClasses}`;
    div.dataset.id = tarefa.id;

    div.innerHTML = `
        <input type="checkbox" class="w-5 h-5 rounded-md border-2 border-gray-300 dark:border-gray-600 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer transition-all flex-shrink-0" 
               ${tarefa.concluida ? "checked" : ""} 
               title="Marcar como ${tarefa.concluida ? "pendente" : "concluída"}">
        <div class="flex-1 min-w-0">
            <p class="text-sm font-medium ${tarefa.concluida ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-800 dark:text-gray-100"} break-words">${escapeHtml(tarefa.descricao)}</p>
            <div class="flex flex-wrap gap-1.5 mt-1.5">
                <span class="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full ${prioridadeBadge[tarefa.prioridade]}">
                    ${prioridadeEmoji[tarefa.prioridade]} ${tarefa.prioridade}
                </span>
                <span class="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    🏷️ ${escapeHtml(tarefa.categoria)}
                </span>
                <span class="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    📅 ${tarefa.criada_em}
                </span>
                ${tarefa.concluida_em ? `<span class="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300">✅ ${tarefa.concluida_em}</span>` : ""}
            </div>
        </div>
        <div class="flex gap-1 flex-shrink-0">
            <button class="btn-editar p-2 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 dark:hover:text-indigo-400 transition-all" title="Editar">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
            </button>
            <button class="btn-remover p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400 transition-all" title="Remover">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
        </div>
    `;

    // Event listeners
    const checkbox = div.querySelector("input[type='checkbox']");
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
    document.getElementById("editar-descricao").focus();
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
        if (e.target === document.getElementById("modal-editar")) {
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
