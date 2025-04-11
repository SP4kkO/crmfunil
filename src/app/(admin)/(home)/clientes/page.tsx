"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table/index";
import Button from "@/components/ui/button/Button";
import TrashIcon from "../../../../icons/trash.svg"; // Ícone de delete
import EditIcon from "../../../../icons/pencil.svg"; // Ícone para edição (adicione ou crie esse componente conforme sua estrutura)
import Alert from "@/components/ui/alert/Alert"; // Componente para exibir alertas
import { Modal } from "@/components/ui/modal"; // Modal conforme o código que você forneceu

// Interface do Cliente
interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  contato: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function ClientsTable() {
  const router = useRouter();
  const [clients, setClients] = useState<Cliente[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // Itens por página

  // Estados para alertas (notificações)
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  // Estados para modal de deleção
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [clientToDelete, setClientToDelete] = useState<Cliente | null>(null);

  // Estados para modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingClient, setEditingClient] = useState<Cliente | null>(null);

  // Estado para os dados do formulário de edição
  const [formData, setFormData] = useState({
    id: 0,
    nome: "",
    cnpj: "",
    endereco: "",
    contato: "",
  });

  // Busca os clientes na carga inicial
  useEffect(() => {
    fetch("http://localhost:8080/api/clientes")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar clientes");
        }
        return response.json();
      })
      .then((data: Cliente[]) => setClients(data))
      .catch((err) => console.error("Erro ao buscar clientes:", err));
  }, []);

  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = clients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(clients.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Clique na linha para navegação
  const handleRowClick = (id: number) => {
    router.push(`/clientes/${id}`);
  };

  // Ação de abrir modal de deleção
  const handleDelete = (client: Cliente) => {
    setClientToDelete(client);
    setIsDeleteModalOpen(true);
  };

  // Confirma a exclusão
  const confirmDelete = () => {
    if (!clientToDelete) return;
    fetch(`http://localhost:8080/api/clientes/${clientToDelete.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Atualiza a lista removendo o cliente deletado
          setClients((prev) => prev.filter((c) => c.id !== clientToDelete.id));
          setAlertData({
            variant: "success",
            title: "Deletado",
            message: "Cliente foi deletado com sucesso.",
          });
        } else {
          setAlertData({
            variant: "error",
            title: "Erro",
            message: "Erro ao deletar o cliente.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlertData({
          variant: "error",
          title: "Erro",
          message: "Erro na requisição.",
        });
      })
      .finally(() => {
        setIsDeleteModalOpen(false);
        setClientToDelete(null);
      });
  };

  // Ação de abrir modal de edição
  const handleEdit = (client: Cliente) => {
    setEditingClient(client);
    setIsEditModalOpen(true);
  };

  // Sempre que um cliente for escolhido para edição, pré-carrega os dados no formulário
  useEffect(() => {
    if (editingClient) {
      setFormData({
        id: editingClient.id,
        nome: editingClient.nome,
        cnpj: editingClient.cnpj,
        endereco: editingClient.endereco,
        contato: editingClient.contato,
      });
    }
  }, [editingClient]);

  // Submissão do formulário de edição (PUT)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/clientes/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          setClients((prev) =>
            prev.map((client) =>
              client.id === formData.id ? { ...client, ...formData } : client
            )
          );
          setAlertData({
            variant: "success",
            title: "Atualizado",
            message: "Cliente atualizado com sucesso.",
          });
          setIsEditModalOpen(false);
          setEditingClient(null);
        } else {
          setAlertData({
            variant: "error",
            title: "Erro",
            message: "Erro ao atualizar o cliente.",
          });
        }
      })
      .catch((err) => {
        console.error(err);
        setAlertData({
          variant: "error",
          title: "Erro",
          message: "Erro na requisição.",
        });
      });
  };

  return (
    <div>
      {/* Alert para notificações */}
      {alertData && (
        <div className="mb-4">
          <Alert
            variant={alertData.variant}
            title={alertData.title}
            message={alertData.message}
          />
        </div>
      )}

      {/* Tabela de Clientes */}
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        {/* Cabeçalho com título e busca */}
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Clientes
            </h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <form>
              <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg
                    className="fill-gray-500 dark:fill-gray-400"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path fillRule="evenodd" clipRule="evenodd" d="M3.04199 9.37381H17.7067" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M17.7075 14.0961H2.29085" />
                  </svg>
                </button>
                <input
                  type="text"
                  placeholder="Search..."
                  className="dark:bg-dark-900 h-[42px] w-full rounded-lg border border-gray-300 bg-transparent py-2.5 pl-[42px] pr-4 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 xl:w-[300px]"
                />
              </div>
            </form>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-hidden">
          <div className="max-w-full px-5 overflow-x-auto sm:px-6">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    ID
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Nome
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    CNPJ
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Endereço
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    Contato
                  </TableCell>
                  <TableCell isHeader className="px-4 py-3 font-normal text-gray-500 text-center text-theme-sm dark:text-gray-400">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((cliente) => (
                  <TableRow key={cliente.id} className="hover:bg-gray-100">
                    <TableCell className="px-4 py-4">{cliente.id}</TableCell>
                    <TableCell className="px-4 py-4">{cliente.nome}</TableCell>
                    <TableCell className="px-4 py-4">{cliente.cnpj}</TableCell>
                    <TableCell className="px-4 py-4">{cliente.endereco}</TableCell>
                    <TableCell className="px-4 py-4">{cliente.contato}</TableCell>
                    <TableCell className="px-4 py-4 flex justify-center items-center space-x-2">
                      {/* Botão para editar */}
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EditIcon width={20} height={20} />
                      </button>
                      {/* Botão para deletar */}
                      <button
                        onClick={() => handleDelete(cliente)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <TrashIcon width={20} height={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Controles de Paginação */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-white/[0.05]">
          <div className="flex items-center justify-between">
            <Button
              size="sm"
              variant="outline"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M2.58301 9.99868C2.58272 10.1909 2.65588 10.3833 2.80249 10.53L7.79915 15.5301C8.09194 15.8231 8.56682 15.8233 8.85981 15.5305C9.15281 15.2377 9.15297 14.7629 8.86018 14.4699L5.14009 10.7472L16.6675 10.7472C17.0817 10.7472 17.4175 10.4114 17.4175 9.99715C17.4175 9.58294 17.0817 9.24715 16.6675 9.24715L5.14554 9.24715L8.86017 5.53016C9.15297 5.23717 9.15282 4.7623 8.85983 4.4695C8.56684 4.1767 8.09197 4.17685 7.79917 4.46984L2.84167 9.43049C2.68321 9.568 2.58301 9.77087 2.58301 9.99715C2.58301 9.99766 2.58301 9.99817 2.58301 9.99868Z"
                />
              </svg>
              <span className="hidden sm:inline">Previous</span>
            </Button>
            <span className="block text-sm font-medium text-gray-700 dark:text-gray-400 sm:hidden">
              Page {currentPage} of {totalPages}
            </span>
            <ul className="hidden items-center gap-0.5 sm:flex">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => goToPage(idx + 1)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-theme-sm font-medium ${
                      currentPage === idx + 1
                        ? "bg-brand-500 text-white"
                        : "text-gray-700 hover:bg-brand-500/[0.08] dark:hover:bg-brand-500 dark:hover:text-white hover:text-brand-500 dark:text-gray-400"
                    }`}
                  >
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
            <Button
              onClick={() => goToPage(currentPage + 1)}
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <span className="hidden sm:inline">Next</span>
              <svg
                className="fill-current"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M17.4175 9.9986C17.4178 10.1909 17.3446 10.3832 17.198 10.53L12.2013 15.5301C11.9085 15.8231 11.4337 15.8233 11.1407 15.5305C10.8477 15.2377 10.8475 14.7629 11.1403 14.4699L14.8604 10.7472L3.33301 10.7472C2.91879 10.7472 2.58301 10.4114 2.58301 9.99715C2.58301 9.58294 2.91879 9.24715 3.33301 9.24715L14.8549 9.24715L11.1403 5.53016C10.8475 5.23717 10.8477 4.7623 11.1407 4.4695C11.4336 4.1767 11.9085 4.17685 12.2013 4.46984L17.1588 9.43049C17.3173 9.568 17.4175 9.77087 17.4175 9.99715C17.4175 9.99763 17.4175 9.99812 17.4175 9.9986Z"
                />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação para Deletar */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Confirmar Exclusão</h2>
          <p className="mb-4">
            Tem certeza que deseja deletar o cliente{" "}
            <strong>{clientToDelete?.nome}</strong>?
          </p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Deletar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para Edição de Cliente */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Editar Cliente</h2>
          <form onSubmit={handleEditSubmit}>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="nome">
                Nome
              </label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="cnpj">
                CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={(e) =>
                  setFormData({ ...formData, cnpj: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="endereco">
                Endereço
              </label>
              <input
                id="endereco"
                type="text"
                value={formData.endereco}
                onChange={(e) =>
                  setFormData({ ...formData, endereco: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="contato">
                Contato
              </label>
              <input
                id="contato"
                type="text"
                value={formData.contato}
                onChange={(e) =>
                  setFormData({ ...formData, contato: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Salvar</Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
