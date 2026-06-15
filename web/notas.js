/**
 * Notas Rápidas - CRUD Completo
 * Create, Read, Update, Delete
 * Desenvolvido com Kiro AI
 */

// ========================================
// GERENCIAMENTO DE DADOS
// ========================================

const NOTAS_STORAGE_KEY = "todo-app-notas";

const NOTAS_CORES = {
    yellow: {
        bg: "bg-yellow-50 dark:bg-yellow-900/20",
        border: "border-yellow-200 dark:border-yellow-800",
        title: "text-yellow-800 dark:text-yellow-200",
        badge: "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200",
    },
    blue: {
        bg: "bg-blue-50 dark:bg-blue-900/20",
        border: "border-blue-200 dark:border-blue-800",
        title: "text-blue-800 dark:text-blue-200",
        badge: "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200",
    },
    green: {
        bg: "bg-emerald-50 dark:bg-emerald-900/20",
        border: "border-emerald-200 dark:border-emerald-800",
        title: "text-emerald-800 dark:text-emerald-200",
        badge: "bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200",
    },
    pink: {
        bg: "bg-pink-50 dark:bg-pink-900/20",
        border: "border-pink-200 dark:border-pink-800",
        title: "text-pink-800 dark:text-pink-200",
        badge: "bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200",
    },
    purple: {
        bg: "bg-purple-50 dark:bg-purple-900/20",
        border: "border-purple-200 dark:border-purple-800",
        title: "text-purple-800 dark:text-purple-200",
        badge: "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200",
    },
};

function carregarNotas() {
    const dados = localStorage.getItem(NOTAS_STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
}

function salvarNotas(notas) {
    localStorage.setItem(NOTAS_STORAGE_KEY, JSON.stringify(notas));
}

function gerarNotaId(notas) {
    if (notas.length === 0) return 1;
    return Math.max(...notas.map((n) => n.id)) + 1;
}

// ========================================
// CRUD - CREATE
// ========================================

function criarNota(titulo, conteudo, cor) {
    const notas = carregarNotas();
    const novaNota = {
        id: gerarNotaId(notas),
        titulo: titulo.trim(),
        conteudo: conteudo.trim(),
        cor: cor || "yellow",
        criada_em: obterDataAtual(),
        atualizada_em: null,
    };
    notas.unshift(novaNota);
    salvarNotas(notas);
    return novaNota;
}

// ========================================
// CRUD - READ (renderização)
// ========================================

function renderizarNotas() {
    const notas = carregarNotas();
    const lista = document.getElementById("lista-notas");
    const contador = document.getElementById("contador-notas");

    lista.innerHTML = "";

    if (notas.length === 0) {
        lista.innerHTML = `
            <div class="text-center py-8 text-gray-400 dark:text-gray-500 col-span-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 mx-auto mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                </svg>
                <span class="block text-sm">Nenhuma nota criada ainda.</span>
            </div>
        `;
        contador.textContent = "0 notas";
        return;
    }

    const plural = notas.length === 1 ? "nota" : "notas";
    contador.textContent = `${notas.length} ${plural}`;

    notas.forEach((nota) => {
        lista.appendChild(criarElementoNota(nota));
    });

    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }
}

function criarElementoNota(nota) {
    const cores = NOTAS_CORES[nota.cor] || NOTAS_CORES.yellow;
    const div = document.createElement("div");
    div.className = `${cores.bg} ${cores.border} border rounded-xl p-4 transition-all hover:shadow-md hover:-translate-y-0.5 animate-scale-in relative group`;
    div.dataset.id = nota.id;

    const conteudoTruncado = nota.conteudo.length > 120 
        ? nota.conteudo.substring(0, 120) + "..." 
        : nota.conteudo;

    div.innerHTML = `
        <div class="flex items-start justify-between gap-2 mb-2">
            <h4 class="text-sm font-semibold ${cores.title} truncate flex-1">${escapeHtmlNotas(nota.titulo)}</h4>
            <div class="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button class="nota-editar p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all" title="Editar nota">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button class="nota-remover p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-white/50 dark:hover:bg-gray-800/50 transition-all" title="Remover nota">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                </button>
            </div>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">${escapeHtmlNotas(conteudoTruncado)}</p>
        <div class="flex items-center justify-between mt-3 pt-2 border-t ${cores.border}">
            <span class="text-[10px] text-gray-400 dark:text-gray-500">📅 ${nota.criada_em}</span>
            ${nota.atualizada_em ? `<span class="text-[10px] text-gray-400 dark:text-gray-500">✏️ ${nota.atualizada_em}</span>` : ""}
        </div>
    `;

    // Event listeners
    div.querySelector(".nota-editar").addEventListener("click", () => abrirEdicaoNota(nota));
    div.querySelector(".nota-remover").addEventListener("click", () => {
        if (confirm(`Deseja remover a nota "${nota.titulo}"?`)) {
            removerNota(nota.id);
        }
    });

    return div;
}

function escapeHtmlNotas(texto) {
    const div = document.createElement("div");
    div.textContent = texto;
    return div.innerHTML;
}

// ========================================
// CRUD - UPDATE
// ========================================

function atualizarNota(id, titulo, conteudo, cor) {
    const notas = carregarNotas();
    const nota = notas.find((n) => n.id === id);
    if (nota) {
        if (titulo) nota.titulo = titulo.trim();
        if (conteudo) nota.conteudo = conteudo.trim();
        if (cor) nota.cor = cor;
        nota.atualizada_em = obterDataAtual();
        salvarNotas(notas);
        renderizarNotas();
        return true;
    }
    return false;
}

function abrirEdicaoNota(nota) {
    const modal = document.getElementById("modal-editar-nota");
    if (!modal) return;
    document.getElementById("editar-nota-id").value = nota.id;
    document.getElementById("editar-nota-titulo").value = nota.titulo;
    document.getElementById("editar-nota-conteudo").value = nota.conteudo;
    
    // Selecionar a cor correta
    const corRadio = modal.querySelector(`input[name="editar-nota-cor"][value="${nota.cor}"]`);
    if (corRadio) corRadio.checked = true;
    
    modal.hidden = false;
    document.getElementById("editar-nota-titulo").focus();
}

function fecharModalNota() {
    const modal = document.getElementById("modal-editar-nota");
    if (modal) modal.hidden = true;
}

// ========================================
// CRUD - DELETE
// ========================================

function removerNota(id) {
    const notas = carregarNotas();
    const filtradas = notas.filter((n) => n.id !== id);
    if (filtradas.length < notas.length) {
        salvarNotas(filtradas);
        renderizarNotas();
        return true;
    }
    return false;
}

// ========================================
// INICIALIZAÇÃO
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    // Criar modal de edição de nota dinamicamente
    criarModalEditarNota();
    
    // Renderizar notas ao carregar
    renderizarNotas();

    // Form de adicionar nota
    const formNota = document.getElementById("form-nota");
    if (formNota) {
        formNota.addEventListener("submit", (e) => {
            e.preventDefault();

            const titulo = document.getElementById("input-nota-titulo").value.trim();
            const conteudo = document.getElementById("input-nota-conteudo").value.trim();
            const corSelecionada = document.querySelector('input[name="nota-cor"]:checked');
            const cor = corSelecionada ? corSelecionada.value : "yellow";

            if (!titulo || !conteudo) return;

            criarNota(titulo, conteudo, cor);

            // Limpar form
            document.getElementById("input-nota-titulo").value = "";
            document.getElementById("input-nota-conteudo").value = "";
            document.querySelector('input[name="nota-cor"][value="yellow"]').checked = true;

            renderizarNotas();
            document.getElementById("input-nota-titulo").focus();
        });
    }
});

// ========================================
// MODAL DE EDIÇÃO (criado dinamicamente)
// ========================================

function criarModalEditarNota() {
    const modal = document.createElement("div");
    modal.id = "modal-editar-nota";
    modal.className = "fixed inset-0 z-50 flex items-center justify-center p-4";
    modal.hidden = true;

    modal.innerHTML = `
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm modal-nota-backdrop"></div>
        <div class="relative glass rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
            <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
                <svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                Editar Nota
            </h3>
            <form id="form-editar-nota" class="space-y-4">
                <input type="hidden" id="editar-nota-id">
                <div class="space-y-1">
                    <label for="editar-nota-titulo" class="text-xs font-medium text-gray-500 dark:text-gray-400">Título</label>
                    <input type="text" id="editar-nota-titulo" required
                        class="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm">
                </div>
                <div class="space-y-1">
                    <label for="editar-nota-conteudo" class="text-xs font-medium text-gray-500 dark:text-gray-400">Conteúdo</label>
                    <textarea id="editar-nota-conteudo" rows="4" required
                        class="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all text-sm resize-none"></textarea>
                </div>
                <div class="space-y-1">
                    <label class="text-xs font-medium text-gray-500 dark:text-gray-400">Cor</label>
                    <div class="flex items-center gap-2">
                        <label class="cursor-pointer"><input type="radio" name="editar-nota-cor" value="yellow" checked class="sr-only peer"><span class="block w-6 h-6 rounded-full bg-yellow-200 border-2 border-transparent peer-checked:border-yellow-500 peer-checked:ring-2 peer-checked:ring-yellow-300 transition-all"></span></label>
                        <label class="cursor-pointer"><input type="radio" name="editar-nota-cor" value="blue" class="sr-only peer"><span class="block w-6 h-6 rounded-full bg-blue-200 border-2 border-transparent peer-checked:border-blue-500 peer-checked:ring-2 peer-checked:ring-blue-300 transition-all"></span></label>
                        <label class="cursor-pointer"><input type="radio" name="editar-nota-cor" value="green" class="sr-only peer"><span class="block w-6 h-6 rounded-full bg-emerald-200 border-2 border-transparent peer-checked:border-emerald-500 peer-checked:ring-2 peer-checked:ring-emerald-300 transition-all"></span></label>
                        <label class="cursor-pointer"><input type="radio" name="editar-nota-cor" value="pink" class="sr-only peer"><span class="block w-6 h-6 rounded-full bg-pink-200 border-2 border-transparent peer-checked:border-pink-500 peer-checked:ring-2 peer-checked:ring-pink-300 transition-all"></span></label>
                        <label class="cursor-pointer"><input type="radio" name="editar-nota-cor" value="purple" class="sr-only peer"><span class="block w-6 h-6 rounded-full bg-purple-200 border-2 border-transparent peer-checked:border-purple-500 peer-checked:ring-2 peer-checked:ring-purple-300 transition-all"></span></label>
                    </div>
                </div>
                <div class="flex gap-3 justify-end pt-2">
                    <button type="button" class="btn-cancelar-nota px-5 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                        Cancelar
                    </button>
                    <button type="submit" class="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/25 transition-all text-sm">
                        Salvar
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Event listeners do modal
    modal.querySelector(".modal-nota-backdrop").addEventListener("click", fecharModalNota);
    modal.querySelector(".btn-cancelar-nota").addEventListener("click", fecharModalNota);

    document.getElementById("form-editar-nota").addEventListener("submit", (e) => {
        e.preventDefault();
        const id = parseInt(document.getElementById("editar-nota-id").value);
        const titulo = document.getElementById("editar-nota-titulo").value.trim();
        const conteudo = document.getElementById("editar-nota-conteudo").value.trim();
        const corRadio = modal.querySelector('input[name="editar-nota-cor"]:checked');
        const cor = corRadio ? corRadio.value : "yellow";

        atualizarNota(id, titulo, conteudo, cor);
        fecharModalNota();
    });

    // ESC para fechar
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.hidden) {
            fecharModalNota();
        }
    });
}
