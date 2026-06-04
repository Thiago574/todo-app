"""Módulo de gerenciamento de tarefas."""

import json
from pathlib import Path
from datetime import datetime

ARQUIVO_DADOS = Path(__file__).parent / "tarefas.json"


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


def adicionar_tarefa(descricao: str) -> dict:
    """Adiciona uma nova tarefa à lista."""
    tarefas = carregar_tarefas()
    nova_tarefa = {
        "id": len(tarefas) + 1,
        "descricao": descricao,
        "concluida": False,
        "criada_em": datetime.now().strftime("%d/%m/%Y %H:%M"),
    }
    tarefas.append(nova_tarefa)
    salvar_tarefas(tarefas)
    return nova_tarefa


def listar_tarefas() -> list[dict]:
    """Retorna todas as tarefas."""
    return carregar_tarefas()


def concluir_tarefa(tarefa_id: int) -> bool:
    """Marca uma tarefa como concluída."""
    tarefas = carregar_tarefas()
    for tarefa in tarefas:
        if tarefa["id"] == tarefa_id:
            tarefa["concluida"] = True
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
