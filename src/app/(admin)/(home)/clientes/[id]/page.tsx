"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Interface para Empresa (simplificada) - ajuste conforme necessário
interface Empresa {
  id: number;
  nome: string;
  // Outros campos da empresa podem ser adicionados aqui
}

// Interface que reflete o modelo de Cliente em Go
interface Cliente {
  id: number;
  nome: string;
  cnpj: string;
  endereco: string;
  contato: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  empresas?: Empresa[];
}

export default function PerfilCliente() {
  const params = useParams();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/clientes/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar cliente");
        }
        return res.json();
      })
      .then((data: Cliente) => setCliente(data))
      .catch((err) => console.error("Erro ao buscar cliente:", err));
  }, [params.id]);

  if (!cliente)
    return <p className="text-center mt-10">Carregando cliente...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      {/* Cabeçalho com nome e CNPJ */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {cliente.nome}
          </h1>
          <p className="text-gray-500 dark:text-gray-300">{cliente.cnpj}</p>
        </div>
      </div>

      {/* Botão para alternar a exibição dos detalhes */}
      <div className="mt-6">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-blue-600 underline text-sm"
        >
          {showDetails ? "Ocultar detalhes" : "Ver detalhes do cliente"}
        </button>

        {showDetails && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
            <p>
              <strong>Endereço:</strong> {cliente.endereco || "-"}
            </p>
            <p>
              <strong>Contato:</strong> {cliente.contato || "-"}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(cliente.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(cliente.updated_at).toLocaleDateString()}
            </p>
            {cliente.empresas && cliente.empresas.length > 0 && (
              <div className="col-span-1 sm:col-span-2">
                <strong>Empresas Associadas:</strong>
                <ul className="mt-2 list-disc list-inside">
                  {cliente.empresas.map((empresa) => (
                    <li key={empresa.id}>{empresa.nome}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
