"""Aplicação de Lista de Tarefas - Interface CLI."""

from todo import adicionar_tarefa, listar_tarefas, concluir_tarefa, remover_tarefa


def exibir_menu():
    """Exibe o menu principal."""
    print("\n" + "=" * 40)
    print("       📝 LISTA DE TAREFAS")
    print("=" * 40)
    print("  1. Adicionar tarefa")
    print("  2. Listar tarefas")
    print("  3. Concluir tarefa")
    print("  4. Remover tarefa")
    print("  5. Sair")
    print("=" * 40)


def exibir_tarefas():
    """Exibe todas as tarefas formatadas."""
    tarefas = listar_tarefas()
    if not tarefas:
        print("\n  📭 Nenhuma tarefa cadastrada.")
        return

    print(f"\n  📋 Total: {len(tarefas)} tarefa(s)\n")
    for tarefa in tarefas:
        status = "✅" if tarefa["concluida"] else "⬜"
        print(f"  {status} [{tarefa['id']}] {tarefa['descricao']}  ({tarefa['criada_em']})")


def cmd_adicionar():
    """Comando para adicionar uma tarefa."""
    descricao = input("\n  Descrição da tarefa: ").strip()
    if descricao:
        tarefa = adicionar_tarefa(descricao)
        print(f"\n  ✅ Tarefa #{tarefa['id']} adicionada com sucesso!")
    else:
        print("\n  ⚠️  Descrição não pode ser vazia.")


def cmd_concluir():
    """Comando para concluir uma tarefa."""
    exibir_tarefas()
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
        if remover_tarefa(tarefa_id):
            print(f"\n  🗑️  Tarefa #{tarefa_id} removida!")
        else:
            print(f"\n  ❌ Tarefa #{tarefa_id} não encontrada.")
    except ValueError:
        print("\n  ⚠️  Digite um número válido.")


def main():
    """Loop principal da aplicação."""
    print("\n  Bem-vindo ao gerenciador de tarefas! 🚀")

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
                print("\n  👋 Até mais! Bom trabalho!\n")
                break
            case _:
                print("\n  ⚠️  Opção inválida. Tente novamente.")


if __name__ == "__main__":
    main()
