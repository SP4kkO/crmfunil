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

// Interface de Empresa conforme retorno da API
interface Empresa {
  id: number;
  nome: string;
  segmento?: string;
  url?: string;
  resumo?: string;
  tamanho_empresa?: string;
  faixa_faturamento?: string;
  cnpj_matriz?: string;
  razao_social?: string;
  telefone_matriz?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  cliente_da_base?: boolean;
  cliente_id?: number;
  linkedin_empresa?: string;
  grupo?: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  anotacoes?: unknown[];
}

export default function CompaniesTable() {
  const router = useRouter();
  const [companies, setCompanies] = useState<Empresa[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5; // número de itens por página

  // Estado para exibir alertas (notificações)
  const [alertData, setAlertData] = useState<{
    variant: "success" | "error" | "warning" | "info";
    title: string;
    message: string;
  } | null>(null);

  // Estados para o modal de exclusão
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [companyToDelete, setCompanyToDelete] = useState<Empresa | null>(null);

  // Estados para o modal de edição
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingCompany, setEditingCompany] = useState<Empresa | null>(null);

  // Estado para os dados do formulário de edição (ex.: editamos os campos nome, segmento, cidade e estado)
  const [formData, setFormData] = useState({
    id: 0,
    nome: "",
    segmento: "",
    cidade: "",
    estado: "",
  });

  // Busca as empresas na carga inicial
  useEffect(() => {
    fetch("http://localhost:8080/api/empresas")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar empresas");
        }
        return response.json();
      })
      .then((data: Empresa[]) => setCompanies(data))
      .catch((err) => console.error("Erro ao buscar empresas:", err));
  }, []);

  // Cálculo de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = companies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(companies.length / itemsPerPage);

  const goToPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowClick = (id: number) => {
    router.push(`/empresas/${id}`);
  };

  // Abre o modal de exclusão sem acionar a navegação da linha
  const handleDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    company: Empresa
  ) => {
    e.stopPropagation();
    setCompanyToDelete(company);
    setIsDeleteModalOpen(true);
  };

  // Executa a exclusão após confirmação
  const confirmDelete = () => {
    if (!companyToDelete) return;
    fetch(`http://localhost:8080/api/empresas/${companyToDelete.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          setCompanies((prev) =>
            prev.filter((comp) => comp.id !== companyToDelete.id)
          );
          setAlertData({
            variant: "success",
            title: "Deletado",
            message: "Empresa deletada com sucesso.",
          });
        } else {
          setAlertData({
            variant: "error",
            title: "Erro",
            message: "Erro ao deletar empresa.",
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
        setCompanyToDelete(null);
      });
  };

  // Abre o modal de edição sem acionar a navegação
  const handleEdit = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    company: Empresa
  ) => {
    e.stopPropagation();
    setEditingCompany(company);
    setIsEditModalOpen(true);
  };

  // Pré-carrega os dados da empresa a ser editada no formulário
  useEffect(() => {
    if (editingCompany) {
      setFormData({
        id: editingCompany.id,
        nome: editingCompany.nome,
        segmento: editingCompany.segmento || "",
        cidade: editingCompany.cidade || "",
        estado: editingCompany.estado || "",
      });
    }
  }, [editingCompany]);

  // Submissão do formulário de edição (PUT)
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedData = { ...formData };
    fetch(`http://localhost:8080/api/empresas/${formData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (res.ok) {
          setCompanies((prev) =>
            prev.map((comp) =>
              comp.id === formData.id ? { ...comp, ...updatedData } : comp
            )
          );
          setAlertData({
            variant: "success",
            title: "Atualizado",
            message: "Empresa atualizada com sucesso.",
          });
          setIsEditModalOpen(false);
          setEditingCompany(null);
        } else {
          setAlertData({
            variant: "error",
            title: "Erro",
            message: "Erro ao atualizar empresa.",
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

      {/* Header com título e busca */}
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex flex-col gap-2 px-5 mb-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Companies
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

        {/* Tabela de Empresas */}
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
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    Segment
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    City
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-gray-500 text-start text-theme-sm dark:text-gray-400"
                  >
                    State
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-4 py-3 font-normal text-center text-theme-sm text-gray-500 dark:text-gray-400"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {currentItems.map((company) => (
                  <TableRow
                    key={company.id}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => handleRowClick(company.id)}
                  >
                    <TableCell className="px-4 py-4">{company.id}</TableCell>
                    <TableCell className="px-4 py-4">{company.nome}</TableCell>
                    <TableCell className="px-4 py-4">
                      {company.segmento || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {company.cidade || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4">
                      {company.estado || "-"}
                    </TableCell>
                    <TableCell className="px-4 py-4 flex justify-center items-center gap-2">
                      <button
                        onClick={(e) => handleEdit(e, company)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <EditIcon width={20} height={20} />
                      </button>
                      <button
                        onClick={(e) => handleDelete(e, company)}
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
            Tem certeza de que deseja deletar a empresa{" "}
            <strong>{companyToDelete?.nome}</strong>?
          </p>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Deletar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para Edição de Empresa */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
        <div className="p-4">
          <h2 className="mb-4 text-lg font-semibold">Editar Empresa</h2>
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
              <label className="block mb-1" htmlFor="segmento">
                Segment
              </label>
              <input
                id="segmento"
                type="text"
                value={formData.segmento}
                onChange={(e) =>
                  setFormData({ ...formData, segmento: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="cidade">
                City
              </label>
              <input
                id="cidade"
                type="text"
                value={formData.cidade}
                onChange={(e) =>
                  setFormData({ ...formData, cidade: e.target.value })
                }
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="estado">
                State
              </label>
              <input
                id="estado"
                type="text"
                value={formData.estado}
                onChange={(e) =>
                  setFormData({ ...formData, estado: e.target.value })
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
