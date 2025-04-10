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

// Definição da interface para Contato conforme o modelo em Go
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

  useEffect(() => {
    fetch("http://localhost:8080/api/contatos")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar contatos");
        }
        return response.json();
      })
      .then((data: Contato[]) => setContatos(data))
      .catch((err) =>
        console.error("Erro ao buscar contatos:", err)
      );
  }, []);

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

  return (
    <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Cabeçalho com título e busca */}
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
                  <TableCell className="px-4 py-4">{contato.cargo || "-"}</TableCell>
                  <TableCell className="px-4 py-4">
                    {contato.telefones && Array.isArray(contato.telefones)
                      ? contato.telefones.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell className="px-4 py-4">{contato.email || "-"}</TableCell>
                  <TableCell className="px-4 py-4">{contato.empresa || "-"}</TableCell>
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
  );
}
