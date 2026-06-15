/**
 * Chatbot com integração à API Gemini (Google AI)
 * 
 * ╔══════════════════════════════════════════════════════════════════╗
 * ║  CONFIGURAÇÃO: Insira sua API Key do Google Gemini abaixo.     ║
 * ║  Obtenha sua chave em: https://aistudio.google.com/apikey      ║
 * ║                                                                 ║
 * ║  Se a chave estiver vazia (""), o chatbot NÃO será exibido     ║
 * ║  e o site funcionará normalmente sem ele.                       ║
 * ╚══════════════════════════════════════════════════════════════════╝
 */

// ┌─────────────────────────────────────────────────────────────────┐
// │  ⬇️  INSIRA SUA API KEY AQUI (entre as aspas)  ⬇️              │
// └─────────────────────────────────────────────────────────────────┘
const GEMINI_API_KEY = "";
// └─────────────────────────────────────────────────────────────────┘
// Exemplo: const GEMINI_API_KEY = "AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
// Deixe vazio ("") para desativar o chatbot.

// ========================================
// CONFIGURAÇÕES
// ========================================

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CHATBOT_SYSTEM_PROMPT = `Você é um assistente integrado ao "Todo App - Lista de Tarefas". 
Você ajuda os usuários com:
- Dicas de produtividade e organização de tarefas
- Sugestões de como priorizar atividades
- Técnicas como Pomodoro, GTD, Eisenhower Matrix
- Ajuda geral sobre uso do aplicativo
Responda de forma concisa, amigável e em português brasileiro.
Use emojis quando apropriado para tornar a conversa mais leve.`;

// ========================================
// CONTROLE DE INICIALIZAÇÃO
// ========================================

const CHATBOT_ENABLED = GEMINI_API_KEY && GEMINI_API_KEY.trim().length > 0;

let chatHistorico = [];
let chatAberto = false;

// ========================================
// INICIALIZAÇÃO CONDICIONAL
// ========================================

document.addEventListener("DOMContentLoaded", () => {
    if (!CHATBOT_ENABLED) {
        // Chatbot desativado - site funciona normalmente sem ele
        console.log("[Chatbot] Desativado - API Key não configurada em chatbot.js");
        return;
    }

    console.log("[Chatbot] Ativado - Inicializando widget...");
    criarWidgetChatbot();
    carregarHistoricoChatbot();
});

// ========================================
// CRIAÇÃO DO WIDGET (DOM dinâmico)
// ========================================

function criarWidgetChatbot() {
    // Botão flutuante
    const botaoFlutuante = document.createElement("button");
    botaoFlutuante.id = "chatbot-toggle";
    botaoFlutuante.className = "fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all hover:scale-110 active:scale-95 flex items-center justify-center";
    botaoFlutuante.title = "Abrir Assistente IA";
    botaoFlutuante.innerHTML = `
        <svg class="w-6 h-6 chatbot-icon-open" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
        <svg class="w-6 h-6 chatbot-icon-close hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
        </svg>
    `;

    // Container do chat
    const chatContainer = document.createElement("div");
    chatContainer.id = "chatbot-container";
    chatContainer.className = "fixed bottom-24 right-6 z-40 w-80 md:w-96 h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-black/20 transition-all duration-300 transform scale-0 origin-bottom-right opacity-0 pointer-events-none";
    chatContainer.innerHTML = `
        <div class="flex flex-col h-full glass border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden">
            <!-- Header do chat -->
            <div class="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white flex-shrink-0">
                <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                </div>
                <div class="flex-1">
                    <h4 class="text-sm font-semibold">Assistente IA</h4>
                    <p class="text-[10px] opacity-80">Powered by Gemini</p>
                </div>
                <button id="chatbot-limpar" class="p-1.5 rounded-lg hover:bg-white/20 transition-colors" title="Limpar conversa">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                </button>
            </div>

            <!-- Área de mensagens -->
            <div id="chatbot-mensagens" class="flex-1 overflow-y-auto p-4 space-y-3 bg-white/30 dark:bg-gray-900/30">
                <div class="flex gap-2">
                    <div class="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                        <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                    </div>
                    <div class="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                        <p class="text-xs text-gray-700 dark:text-gray-300">Olá! 👋 Sou seu assistente de produtividade. Posso te ajudar com dicas de organização, priorização de tarefas e técnicas de foco. Como posso ajudar?</p>
                    </div>
                </div>
            </div>

            <!-- Input de mensagem -->
            <div class="flex-shrink-0 p-3 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50">
                <form id="chatbot-form" class="flex gap-2">
                    <input type="text" id="chatbot-input" placeholder="Digite sua mensagem..."
                        class="flex-1 px-3 py-2 rounded-xl bg-white/80 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all text-xs placeholder:text-gray-400"
                        autocomplete="off">
                    <button type="submit" id="chatbot-enviar" class="px-3 py-2 bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white rounded-xl transition-all hover:shadow-lg shadow-teal-500/25 disabled:opacity-50 disabled:cursor-not-allowed">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    `;

    document.body.appendChild(botaoFlutuante);
    document.body.appendChild(chatContainer);

    // Event Listeners
    botaoFlutuante.addEventListener("click", toggleChatbot);
    document.getElementById("chatbot-form").addEventListener("submit", enviarMensagem);
    document.getElementById("chatbot-limpar").addEventListener("click", limparConversa);
}

// ========================================
// TOGGLE DO CHATBOT
// ========================================

function toggleChatbot() {
    const container = document.getElementById("chatbot-container");
    const iconOpen = document.querySelector(".chatbot-icon-open");
    const iconClose = document.querySelector(".chatbot-icon-close");
    
    chatAberto = !chatAberto;

    if (chatAberto) {
        container.classList.remove("scale-0", "opacity-0", "pointer-events-none");
        container.classList.add("scale-100", "opacity-100", "pointer-events-auto");
        iconOpen.classList.add("hidden");
        iconClose.classList.remove("hidden");
        document.getElementById("chatbot-input").focus();
        scrollChatParaBaixo();
    } else {
        container.classList.add("scale-0", "opacity-0", "pointer-events-none");
        container.classList.remove("scale-100", "opacity-100", "pointer-events-auto");
        iconOpen.classList.remove("hidden");
        iconClose.classList.add("hidden");
    }
}

// ========================================
// ENVIAR MENSAGEM
// ========================================

async function enviarMensagem(e) {
    e.preventDefault();

    const input = document.getElementById("chatbot-input");
    const btnEnviar = document.getElementById("chatbot-enviar");
    const mensagem = input.value.trim();

    if (!mensagem) return;

    // Desabilitar input durante envio
    input.disabled = true;
    btnEnviar.disabled = true;

    // Adicionar mensagem do usuário na tela
    adicionarMensagemUI("user", mensagem);
    input.value = "";

    // Adicionar ao histórico
    chatHistorico.push({ role: "user", parts: [{ text: mensagem }] });

    // Mostrar indicador de digitação
    const typingId = mostrarDigitando();

    try {
        const resposta = await chamarGeminiAPI(mensagem);
        removerDigitando(typingId);
        adicionarMensagemUI("bot", resposta);
        chatHistorico.push({ role: "model", parts: [{ text: resposta }] });
        salvarHistoricoChatbot();
    } catch (error) {
        removerDigitando(typingId);
        const errMsg = "❌ Erro ao conectar com a IA. Verifique sua API Key ou conexão.";
        adicionarMensagemUI("bot", errMsg);
        console.error("[Chatbot] Erro:", error);
    }

    // Reabilitar input
    input.disabled = false;
    btnEnviar.disabled = false;
    input.focus();
}

// ========================================
// CHAMADA À API GEMINI
// ========================================

async function chamarGeminiAPI(mensagemUsuario) {
    const body = {
        contents: [
            { role: "user", parts: [{ text: CHATBOT_SYSTEM_PROMPT }] },
            { role: "model", parts: [{ text: "Entendido! Estou pronto para ajudar com produtividade e organização de tarefas. 😊" }] },
            ...chatHistorico.slice(-20) // Últimas 20 mensagens para contexto
        ],
        generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
        },
        safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
    };

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error ${response.status}: ${errorData.error?.message || "Erro desconhecido"}`);
    }

    const data = await response.json();
    const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!texto) {
        throw new Error("Resposta vazia da API");
    }

    return texto;
}

// ========================================
// UI - ADICIONAR MENSAGENS
// ========================================

function adicionarMensagemUI(tipo, texto) {
    const container = document.getElementById("chatbot-mensagens");

    const msgDiv = document.createElement("div");
    msgDiv.className = `flex gap-2 animate-slide-up ${tipo === "user" ? "flex-row-reverse" : ""}`;

    const avatarClasses = tipo === "user"
        ? "w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0"
        : "w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0";

    const avatarSVG = tipo === "user"
        ? `<svg class="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>`
        : `<svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`;

    const bubbleClasses = tipo === "user"
        ? "bg-indigo-500 text-white rounded-xl rounded-tr-sm px-3 py-2 max-w-[80%]"
        : "bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%]";

    const textClasses = tipo === "user"
        ? "text-xs text-white"
        : "text-xs text-gray-700 dark:text-gray-300";

    // Formatar texto com markdown básico
    const textoFormatado = formatarTextoChat(texto);

    msgDiv.innerHTML = `
        <div class="${avatarClasses}">${avatarSVG}</div>
        <div class="${bubbleClasses}">
            <div class="${textClasses} whitespace-pre-line leading-relaxed">${textoFormatado}</div>
        </div>
    `;

    container.appendChild(msgDiv);
    scrollChatParaBaixo();
}

function formatarTextoChat(texto) {
    // Escape HTML básico
    let formatado = texto
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    
    // Bold: **texto**
    formatado = formatado.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic: *texto*
    formatado = formatado.replace(/\*(.*?)\*/g, "<em>$1</em>");
    // Code inline: `código`
    formatado = formatado.replace(/`(.*?)`/g, '<code class="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded text-[10px]">$1</code>');

    return formatado;
}

// ========================================
// UI - INDICADOR DE DIGITAÇÃO
// ========================================

function mostrarDigitando() {
    const container = document.getElementById("chatbot-mensagens");
    const id = "typing-" + Date.now();

    const typingDiv = document.createElement("div");
    typingDiv.id = id;
    typingDiv.className = "flex gap-2 animate-fade-in";
    typingDiv.innerHTML = `
        <div class="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
        </div>
        <div class="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tl-sm px-4 py-3">
            <div class="flex gap-1">
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0ms;"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 150ms;"></span>
                <span class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 300ms;"></span>
            </div>
        </div>
    `;

    container.appendChild(typingDiv);
    scrollChatParaBaixo();
    return id;
}

function removerDigitando(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

// ========================================
// UTILIDADES
// ========================================

function scrollChatParaBaixo() {
    const container = document.getElementById("chatbot-mensagens");
    if (container) {
        setTimeout(() => {
            container.scrollTop = container.scrollHeight;
        }, 50);
    }
}

function limparConversa() {
    if (!confirm("Deseja limpar todo o histórico da conversa?")) return;
    
    chatHistorico = [];
    localStorage.removeItem("chatbot-historico");
    
    const container = document.getElementById("chatbot-mensagens");
    container.innerHTML = `
        <div class="flex gap-2">
            <div class="w-7 h-7 rounded-full bg-teal-100 dark:bg-teal-900/50 flex items-center justify-center flex-shrink-0">
                <svg class="w-4 h-4 text-teal-600 dark:text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                </svg>
            </div>
            <div class="bg-gray-100 dark:bg-gray-800 rounded-xl rounded-tl-sm px-3 py-2 max-w-[80%]">
                <p class="text-xs text-gray-700 dark:text-gray-300">Conversa limpa! 🧹 Como posso te ajudar agora?</p>
            </div>
        </div>
    `;
}

// ========================================
// PERSISTÊNCIA DO HISTÓRICO
// ========================================

function salvarHistoricoChatbot() {
    // Guardar apenas as últimas 50 mensagens
    const historico = chatHistorico.slice(-50);
    localStorage.setItem("chatbot-historico", JSON.stringify(historico));
}

function carregarHistoricoChatbot() {
    const dados = localStorage.getItem("chatbot-historico");
    if (dados) {
        chatHistorico = JSON.parse(dados);
        // Renderizar histórico na UI
        chatHistorico.forEach((msg) => {
            const tipo = msg.role === "user" ? "user" : "bot";
            const texto = msg.parts[0]?.text || "";
            if (texto) {
                adicionarMensagemUI(tipo, texto);
            }
        });
    }
}
