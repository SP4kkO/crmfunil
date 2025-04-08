"use client";

import React, { useEffect, useState } from "react";
import { Empresa } from "@/types/Empresa";
import { Tooltip } from "@/components/ui/tooltip/Tooltip";
import { FaThumbsUp, FaThumbsDown, FaPause, FaTrash } from "react-icons/fa";
import EmpresaActionsTabs from "@/components/empresa/EmpresaTab";
import AnotacoesTab from "@/components/anotacao/AnotacaoTabas"; // Importa a nova aba de anotações

export default function PerfilEmpresa({ params }: { params: { id: string } }) {
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  console.log(params.id,'hello')
  useEffect(() => {
    fetch(`http://localhost:8080/api/empresas/${params.id}`)
      .then((res) => res.json())
      .then((data) =>
        setEmpresa({
          ...data,
          cnpj: data.cnpj_matriz,
          telefone: data.telefone_matriz,
          endereco: `${data.cidade} - ${data.estado}, ${data.cep}`,
        })
      );
  }, [params.id]);

  if (!empresa) return <p className="text-center mt-10">Carregando empresa...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {empresa.nome}
          </h1>
          <p className="text-gray-500 dark:text-gray-300">{empresa.cnpj}</p>
        </div>

        {/* Botões de ação com Tooltip */}
        <div className="flex items-center gap-3">
          <Tooltip content="Marcar como ganho" position="top">
            <button className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200">
              <FaThumbsUp />
            </button>
          </Tooltip>

          <Tooltip content="Marcar como perda" position="top">
            <button className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
              <FaThumbsDown />
            </button>
          </Tooltip>

          <Tooltip content="Pausar negociação" position="top">
            <button className="p-2 bg-yellow-100 text-yellow-600 rounded-full hover:bg-yellow-200">
              <FaPause />
            </button>
          </Tooltip>

          <Tooltip content="Excluir negociação" position="top">
            <button className="p-2 bg-gray-200 text-gray-600 rounded-full hover:bg-gray-300">
              <FaTrash />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Accordion de detalhes */}
      <div className="mt-6">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-blue-600 underline text-sm"
        >
          {showDetails ? "Ocultar detalhes" : "Ver detalhes da empresa"}
        </button>

        {showDetails && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
            <p>
              <strong>Razão Social:</strong> {empresa.razao_social}
            </p>
            <p>
              <strong>Segmento:</strong> {empresa.segmento}
            </p>
            <p>
              <strong>Grupo:</strong> {empresa.grupo}
            </p>
            <p>
              <strong>Tamanho:</strong> {empresa.tamanho_empresa}
            </p>
            <p>
              <strong>Faturamento:</strong> {empresa.faixa_faturamento}
            </p>
            <p>
              <strong>Telefone:</strong> {empresa.telefone}
            </p>
            <p>
              <strong>Localização:</strong> {empresa.endereco}
            </p>
            <p>
              <strong>Cliente da base?</strong>{" "}
              {empresa.cliente_da_base ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={empresa.url}
                target="_blank"
                className="text-blue-500 underline"
              >
                {empresa.url}
              </a>
            </p>
            <p className="col-span-1 sm:col-span-2">
              <strong>LinkedIn:</strong>{" "}
              <a
                href={empresa.linkedin_empresa}
                target="_blank"
                className="text-blue-500 underline"
              >
                Perfil
              </a>
            </p>
            <p className="col-span-1 sm:col-span-2">
              <strong>Resumo:</strong> {empresa.resumo}
            </p>
          </div>
        )}
      </div>

      {/* Abas de ações */}
      <EmpresaActionsTabs />

      {/* Aba de Anotações */}
      <AnotacoesTab companyId={params.id} />
    </div>
  );
}
