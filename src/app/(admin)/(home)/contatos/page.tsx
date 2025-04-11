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
import { Modal } from "@/components/ui/modal"; // Modal conforme o código que você forneceu// Modal conforme seu componente de modal

// Interface para Contato conforme seu modelo em Go
interface Contato {
  id: number;
  nome: string;
  cargo?: string;
  telefones?: string[]; // Supondo que a API já retorne um array de strings
  email?: string;
  empresa?: string;
  informacoes_adicionais?: string;
  linkedin?: string;
  campos_personalizados?: unknown;
  e_decisor: boolean;
  negociacao_ids?: number[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export default function ContactsTable() {
  const router = useRouter();
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // número de itens por página

  // Estado para Alertas (notificações)
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  // Estados para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [contactToDelete, setContactToDelete] = useState<Contato | null>(null);

  // Estados para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingContact, setEditingContact] = useState<Contato | null>(null);

  // Estado para os dados do formulário de edição (apenas os campos principais)
  const [formData, setFormData] = useState({
    id: 0,
    nome: "",
    cargo: "",
    telefones: "",
    email: "",
    empresa: "",
  });

  // Busca os contatos na carga inicial
  useEffect(() => {
    fetch("http://localhost:8080/api/contatos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar contatos");
        }
        return response.json();
      })
      .then((data: Contato[]) => setContatos(data))
      .catch((err) => console.error("Erro ao buscar contatos:", err));
  }, []);

  // Cálculo de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contatos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(contatos.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/contatos/${id}`);
  };

  // Abre o modal de exclusão (evita a propagação para a linha)
  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contact: Contato
  ) => {
    e.stopPropagation();
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  // Executa a exclusão após confirmação
  const confirmDelete = () => {
    if (!contactToDelete) return;
    fetch(`http://localhost:8080/api/contatos/${contactToDelete.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          // Atualiza a lista removendo o contato deletado
          setContatos((prev) =>
            prev.filter((c) => c.id !== contactToDelete.id)
          );
          setAlertData({
            variant: "success",
            title: "Deletado",
            message: "Contato deletado com sucesso.",
          });
        } else {
          setAlertData({
            variant: "error",
            title: "Erro",
            message: "Erro ao deletar contato.",
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
        setContactToDelete(null);
      });
  };

  // Abre o modal de edição (evita a propagação para a linha)
  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    contact: Contato
  ) => {
    e.stopPropagation();
    setEditingContact(contact);
    setIsEditModalOpen(true);
  };

  // Pré-carrega os dados do contato a ser editado no formulário
  useEffect(() => {
    if (editingContact) {
      setFormData({
        id: editingContact.id,
        nome: editingContact.nome,
        cargo: editingContact.cargo || "",
        telefones: editingContact.telefones
          ? editingContact.telefones.join(", ")
          : "",
        email: editingContact.email || "",
        empresa: editingContact.empresa || "",
      });
    }
  }, [editingContact]);

  // Submissão do formulário de edição (envia PUT)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Converte a string de telefones para um array
    const updatedData = {
      ...formData,
      telefones: formData.telefones
        .split(",")
        .map((tel) => tel.trim())
        .filter((tel) => tel !== ""),
    };

    fetch(`http://localhost:8080/api/contatos/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (res.ok) {
          // Atualiza localmente a lista de contatos
          setContatos((prev) =>
            prev.map((contact) =>
              contact.id === formData.id ? { ...contact, ...updatedData } : contact
            )
          );
          setAlertData({
            variant: "success",
            title: "Atualizado",
            message: "Contato atualizado com sucesso.",
          });
          setIsEditModalOpen(false);
          setEditingContact(null);
        } else {
          setAlertData({
            variant: "error",
            title: "Erro",
            message: "Erro ao atualizar contato.",
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
      {/* Exibição de Alertas */}
      {alertData && (
        <div className="mb-4">
          <Alert
            variant={alertData.variant}
            title={alertData.title}
            message={alertData.message}
          />
        </div>
      )}

      {/* Cabeçalho com título e busca */}
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Contatos
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
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M3.04199 9.37381H17.7067"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M17.7075 14.0961H2.29085"
                    />
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

        {/* Tabela de Contatos */}
        <div className="overflow-hidden">
          <div className="max-w-full px-5 overflow-x-auto sm:px-6">
            <Table>
              <TableHeader className="border-y border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Nome
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Cargo
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Telefones
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Empresa
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-center text-theme-sm text-gray-500 dark:text-gray-400"
                  >
                    Ações
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((contato) => (
                  <TableRow
                    key={contato.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(contato.id)}
                  >
                    <TableCell className="px-4 py-4">{contato.id}</TableCell>
                    <TableCell className="px-4 py-4">{contato.nome}</TableCell>
                    <TableCell className="px-4 py-4">
                      {contato.cargo || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {contato.telefones && Array.isArray(contato.telefones)
                        ? contato.telefones.join(", ")
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {contato.email || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {contato.empresa || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4 flex justify-center items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(e, contato)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EditIcon width={20} height={20} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, contato)}
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

      {/* Modal para Confirmação de Exclusão */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Confirmar Exclusão</h2>
          <p className="mb-4">
            Tem certeza de que deseja deletar o contato{" "}
            <strong>{contactToDelete?.nome}</strong>?
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

      {/* Modal para Edição de Contato */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Editar Contato</h2>
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
              <label className="block mb-1" htmlFor="cargo">
                Cargo
              </label>
              <input
                id="cargo"
                type="text"
                value={formData.cargo}
                onChange={(e) =>
                  setFormData({ ...formData, cargo: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="telefones">
                Telefones (separados por vírgula)
              </label>
              <input
                id="telefones"
                type="text"
                value={formData.telefones}
                onChange={(e) =>
                  setFormData({ ...formData, telefones: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="empresa">
                Empresa
              </label>
              <input
                id="empresa"
                type="text"
                value={formData.empresa}
                onChange={(e) =>
                  setFormData({ ...formData, empresa: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
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
