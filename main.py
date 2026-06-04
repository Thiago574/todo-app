"""Aplicação de Lista de Tarefas - Interface CLI."""

from todo import (
    adicionar_tarefa,
    listar_tarefas,
    concluir_tarefa,
    remover_tarefa,
    editar_tarefa,
    buscar_tarefas,
    filtrar_por_status,
    filtrar_por_prioridade,
    filtrar_por_categoria,
    obter_estatisticas,
    PRIORIDADES,
)


def exibir_menu():
    """Exibe o menu principal."""
    print("\n" + "=" * 50)
    print("            📝 LISTA DE TAREFAS v2.0")
    print("=" * 50)
    print("  1.  Adicionar tarefa")
    print("  2.  Listar todas as tarefas")
    print("  3.  Concluir tarefa")
    print("  4.  Remover tarefa")
    print("  5.  Editar tarefa")
    print("  6.  Buscar tarefas")
    print("  7.  Filtrar por status")
    print("  8.  Filtrar por prioridade")
    print("  9.  Filtrar por categoria")
    print("  10. Estatísticas")
    print("  0.  Sair")
    print("=" * 50)


def exibir_tarefas(tarefas=None, titulo="TODAS AS TAREFAS"):
    """Exibe tarefas formatadas."""
    if tarefas is None:
        tarefas = listar_tarefas()

    if not tarefas:
        print("\n  📭 Nenhuma tarefa encontrada.")
        return

    print(f"\n  📋 {titulo} ({len(tarefas)})\n")
    print(f"  {'ID':<4} {'Status':<3} {'Prio':<3} {'Categoria':<12} {'Descrição':<30} {'Criada em'}")
    print(f"  {'—'*4} {'—'*3} {'—'*3} {'—'*12} {'—'*30} {'—'*16}")

    for tarefa in tarefas:
        status = "✅" if tarefa["concluida"] else "⬜"
        prio = PRIORIDADES.get(tarefa.get("prioridade", "media"), "🟡")
        categoria = tarefa.get("categoria", "geral")[:12]
        descricao = tarefa["descricao"][:30]
        print(f"  {tarefa['id']:<4} {status:<3} {prio:<3} {categoria:<12} {descricao:<30} {tarefa['criada_em']}")


def cmd_adicionar():
    """Comando para adicionar uma tarefa."""
    descricao = input("\n  Descrição da tarefa: ").strip()
    if not descricao:
        print("\n  ⚠️  Descrição não pode ser vazia.")
        return

    print("  Prioridade (alta/media/baixa) [media]: ", end="")
    prioridade = input().strip().lower() or "media"
    if prioridade not in PRIORIDADES:
        prioridade = "media"

    categoria = input("  Categoria [geral]: ").strip().lower() or "geral"

    tarefa = adicionar_tarefa(descricao, prioridade, categoria)
    print(f"\n  ✅ Tarefa #{tarefa['id']} adicionada com sucesso!")
    print(f"     Prioridade: {PRIORIDADES[prioridade]} {prioridade} | Categoria: {categoria}")


def cmd_concluir():
    """Comando para concluir uma tarefa."""
    pendentes = filtrar_por_status(concluidas=False)
    exibir_tarefas(pendentes, "TAREFAS PENDENTES")
    if not pendentes:
        return
    try:
        tarefa_id = int(input("\n  ID da tarefa a concluir: "))
        if concluir_tarefa(tarefa_id):
            print(f"\n  🎉 Tarefa #{tarefa_id} concluída!")
        else:
            print(f"\n  ❌ Tarefa #{tarefa_id} não encontrada.")
    except ValueError:
        print("\n  ⚠️  Digite um número válido.")


def cmd_remover():
    """Comando para remover uma tarefa."""
    exibir_tarefas()
    try:
        tarefa_id = int(input("\n  ID da tarefa a remover: "))
        confirma = input(f"  Confirma remoção da tarefa #{tarefa_id}? (s/n): ").strip().lower()
        if confirma == "s":
            if remover_tarefa(tarefa_id):
                print(f"\n  🗑️  Tarefa #{tarefa_id} removida!")
            else:
                print(f"\n  ❌ Tarefa #{tarefa_id} não encontrada.")
        else:
            print("\n  ↩️  Remoção cancelada.")
    except ValueError:
        print("\n  ⚠️  Digite um número válido.")


def cmd_editar():
    """Comando para editar uma tarefa."""
    exibir_tarefas()
    try:
        tarefa_id = int(input("\n  ID da tarefa a editar: "))
        print("  (Deixe em branco para manter o valor atual)")

        descricao = input("  Nova descrição: ").strip() or None
        prioridade = input("  Nova prioridade (alta/media/baixa): ").strip().lower() or None
        if prioridade and prioridade not in PRIORIDADES:
            prioridade = None
        categoria = input("  Nova categoria: ").strip().lower() or None

        if editar_tarefa(tarefa_id, descricao, prioridade, categoria):
            print(f"\n  ✏️  Tarefa #{tarefa_id} atualizada!")
        else:
            print(f"\n  ❌ Tarefa #{tarefa_id} não encontrada.")
    except ValueError:
        print("\n  ⚠️  Digite um número válido.")


def cmd_buscar():
    """Comando para buscar tarefas."""
    termo = input("\n  Buscar por: ").strip()
    if not termo:
        print("\n  ⚠️  Digite um termo para buscar.")
        return
    resultados = buscar_tarefas(termo)
    exibir_tarefas(resultados, f"RESULTADOS PARA '{termo}'")


def cmd_filtrar_status():
    """Comando para filtrar por status."""
    print("\n  1. Pendentes")
    print("  2. Concluídas")
    opcao = input("\n  Escolha: ").strip()

    if opcao == "1":
        tarefas = filtrar_por_status(concluidas=False)
        exibir_tarefas(tarefas, "TAREFAS PENDENTES")
    elif opcao == "2":
        tarefas = filtrar_por_status(concluidas=True)
        exibir_tarefas(tarefas, "TAREFAS CONCLUÍDAS")
    else:
        print("\n  ⚠️  Opção inválida.")


def cmd_filtrar_prioridade():
    """Comando para filtrar por prioridade."""
    print("\n  1. 🔴 Alta")
    print("  2. 🟡 Média")
    print("  3. 🟢 Baixa")
    opcao = input("\n  Escolha: ").strip()

    mapa = {"1": "alta", "2": "media", "3": "baixa"}
    if opcao in mapa:
        prioridade = mapa[opcao]
        tarefas = filtrar_por_prioridade(prioridade)
        exibir_tarefas(tarefas, f"PRIORIDADE: {prioridade.upper()}")
    else:
        print("\n  ⚠️  Opção inválida.")


def cmd_filtrar_categoria():
    """Comando para filtrar por categoria."""
    categoria = input("\n  Categoria: ").strip().lower()
    if not categoria:
        print("\n  ⚠️  Digite uma categoria.")
        return
    tarefas = filtrar_por_categoria(categoria)
    exibir_tarefas(tarefas, f"CATEGORIA: {categoria.upper()}")


def cmd_estatisticas():
    """Exibe estatísticas das tarefas."""
    stats = obter_estatisticas()

    print("\n" + "=" * 50)
    print("            📊 ESTATÍSTICAS")
    print("=" * 50)
    print(f"\n  Total de tarefas:      {stats['total']}")
    print(f"  Concluídas:            {stats['concluidas']}")
    print(f"  Pendentes:             {stats['pendentes']}")
    print(f"  Progresso:             {stats['percentual_concluido']}%")

    # Barra de progresso visual
    preenchido = int(stats['percentual_concluido'] / 5)
    barra = "█" * preenchido + "░" * (20 - preenchido)
    print(f"  [{barra}]")

    print(f"\n  📌 Por prioridade:")
    for prio, qtd in stats['por_prioridade'].items():
        emoji = PRIORIDADES.get(prio, "")
        print(f"     {emoji} {prio.capitalize()}: {qtd}")

    if stats['por_categoria']:
        print(f"\n  🏷️  Por categoria:")
        for cat, qtd in stats['por_categoria'].items():
            print(f"     • {cat.capitalize()}: {qtd}")

    print()


def main():
    """Loop principal da aplicação."""
    print("\n  Bem-vindo ao gerenciador de tarefas! 🚀")
    print("  Desenvolvido com Kiro AI ✨")

    while True:
        exibir_menu()
        opcao = input("\n  Escolha uma opção: ").strip()

        match opcao:
            case "1":
                cmd_adicionar()
            case "2":
                exibir_tarefas()
            case "3":
                cmd_concluir()
            case "4":
                cmd_remover()
            case "5":
                cmd_editar()
            case "6":
                cmd_buscar()
            case "7":
                cmd_filtrar_status()
            case "8":
                cmd_filtrar_prioridade()
            case "9":
                cmd_filtrar_categoria()
            case "10":
                cmd_estatisticas()
            case "0":
                print("\n  👋 Até mais! Bom trabalho!\n")
                break
            case _:
                print("\n  ⚠️  Opção inválida. Tente novamente.")


if __name__ == "__main__":
    main()
