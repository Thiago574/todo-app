"""Módulo de gerenciamento de tarefas."""

import json
from pathlib import Path
from datetime import datetime

ARQUIVO_DADOS = Path(__file__).parent / "tarefas.json"

PRIORIDADES = {"alta": "🔴", "media": "🟡", "baixa": "🟢"}


def carregar_tarefas() -> list[dict]:
    """Carrega as tarefas do arquivo JSON."""
    if ARQUIVO_DADOS.exists():
        with open(ARQUIVO_DADOS, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def salvar_tarefas(tarefas: list[dict]) -> None:
    """Salva as tarefas no arquivo JSON."""
    with open(ARQUIVO_DADOS, "w", encoding="utf-8") as f:
        json.dump(tarefas, f, ensure_ascii=False, indent=2)


def gerar_id(tarefas: list[dict]) -> int:
    """Gera um ID único incremental."""
    if not tarefas:
        return 1
    return max(t["id"] for t in tarefas) + 1


def adicionar_tarefa(descricao: str, prioridade: str = "media", categoria: str = "geral") -> dict:
    """Adiciona uma nova tarefa à lista."""
    tarefas = carregar_tarefas()
    nova_tarefa = {
        "id": gerar_id(tarefas),
        "descricao": descricao,
        "concluida": False,
        "prioridade": prioridade,
        "categoria": categoria,
        "criada_em": datetime.now().strftime("%d/%m/%Y %H:%M"),
        "concluida_em": None,
    }
    tarefas.append(nova_tarefa)
    salvar_tarefas(tarefas)
    return nova_tarefa


def listar_tarefas() -> list[dict]:
    """Retorna todas as tarefas."""
    return carregar_tarefas()


def filtrar_por_status(concluidas: bool) -> list[dict]:
    """Filtra tarefas por status (concluídas ou pendentes)."""
    tarefas = carregar_tarefas()
    return [t for t in tarefas if t["concluida"] == concluidas]


def filtrar_por_prioridade(prioridade: str) -> list[dict]:
    """Filtra tarefas por prioridade."""
    tarefas = carregar_tarefas()
    return [t for t in tarefas if t.get("prioridade") == prioridade]


def filtrar_por_categoria(categoria: str) -> list[dict]:
    """Filtra tarefas por categoria."""
    tarefas = carregar_tarefas()
    return [t for t in tarefas if t.get("categoria", "").lower() == categoria.lower()]


def buscar_tarefas(termo: str) -> list[dict]:
    """Busca tarefas que contenham o termo na descrição."""
    tarefas = carregar_tarefas()
    termo_lower = termo.lower()
    return [t for t in tarefas if termo_lower in t["descricao"].lower()]


def concluir_tarefa(tarefa_id: int) -> bool:
    """Marca uma tarefa como concluída."""
    tarefas = carregar_tarefas()
    for tarefa in tarefas:
        if tarefa["id"] == tarefa_id:
            tarefa["concluida"] = True
            tarefa["concluida_em"] = datetime.now().strftime("%d/%m/%Y %H:%M")
            salvar_tarefas(tarefas)
            return True
    return False


def editar_tarefa(tarefa_id: int, descricao: str = None, prioridade: str = None, categoria: str = None) -> bool:
    """Edita uma tarefa existente."""
    tarefas = carregar_tarefas()
    for tarefa in tarefas:
        if tarefa["id"] == tarefa_id:
            if descricao:
                tarefa["descricao"] = descricao
            if prioridade:
                tarefa["prioridade"] = prioridade
            if categoria:
                tarefa["categoria"] = categoria
            salvar_tarefas(tarefas)
            return True
    return False


def remover_tarefa(tarefa_id: int) -> bool:
    """Remove uma tarefa da lista."""
    tarefas = carregar_tarefas()
    tarefas_filtradas = [t for t in tarefas if t["id"] != tarefa_id]
    if len(tarefas_filtradas) < len(tarefas):
        salvar_tarefas(tarefas_filtradas)
        return True
    return False


def obter_estatisticas() -> dict:
    """Retorna estatísticas sobre as tarefas."""
    tarefas = carregar_tarefas()
    total = len(tarefas)
    concluidas = sum(1 for t in tarefas if t["concluida"])
    pendentes = total - concluidas

    por_prioridade = {"alta": 0, "media": 0, "baixa": 0}
    categorias = {}

    for t in tarefas:
        prio = t.get("prioridade", "media")
        if prio in por_prioridade:
            por_prioridade[prio] += 1

        cat = t.get("categoria", "geral")
        categorias[cat] = categorias.get(cat, 0) + 1

    return {
        "total": total,
        "concluidas": concluidas,
        "pendentes": pendentes,
        "percentual_concluido": round((concluidas / total * 100), 1) if total > 0 else 0,
        "por_prioridade": por_prioridade,
        "por_categoria": categorias,
    }
