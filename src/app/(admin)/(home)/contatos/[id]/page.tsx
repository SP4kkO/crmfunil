"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

// Interface que reflete o modelo de Contato em Go
interface Contato {
  id: number;
  nome: string;
  cargo?: string;
  telefones?: string[]; // Considera que a API retorna um array de strings
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

export default function PerfilContato() {
  const params = useParams();
  const [contato, setContato] = useState<Contato | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/api/contatos/${params.id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Erro ao buscar contato");
        }
        return res.json();
      })
      .then((data: Contato) => setContato(data))
      .catch((err) => console.error("Erro ao buscar contato:", err));
  }, [params.id]);

  if (!contato)
    return <p className="text-center mt-10">Carregando contato...</p>;

  return (
    <div className="p-8 max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      {/* Cabeçalho com nome e cargo */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            {contato.nome}
          </h1>
          <p className="text-gray-500 dark:text-gray-300">
            {contato.cargo || "Sem Cargo"}
          </p>
        </div>
      </div>

      {/* Botão para exibir ou ocultar detalhes */}
      <div className="mt-6">
        <button
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-blue-600 underline text-sm"
        >
          {showDetails ? "Ocultar detalhes" : "Ver detalhes do contato"}
        </button>

        {showDetails && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700 dark:text-gray-200">
            <p>
              <strong>Email:</strong> {contato.email || "-"}
            </p>
            <p>
              <strong>Telefones:</strong>{" "}
              {contato.telefones && Array.isArray(contato.telefones)
                ? contato.telefones.join(", ")
                : "-"}
            </p>
            <p>
              <strong>Empresa:</strong> {contato.empresa || "-"}
            </p>
            <p>
              <strong>Informações Adicionais:</strong>{" "}
              {contato.informacoes_adicionais || "-"}
            </p>
            <p>
              <strong>LinkedIn:</strong>{" "}
              {contato.linkedin ? (
                <a
                  href={contato.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Perfil
                </a>
              ) : (
                "-"
              )}
            </p>
            <p>
              <strong>E Decisor:</strong>{" "}
              {contato.e_decisor ? "Sim" : "Não"}
            </p>
            <p>
              <strong>Criado em:</strong>{" "}
              {new Date(contato.created_at).toLocaleDateString()}
            </p>
            <p>
              <strong>Atualizado em:</strong>{" "}
              {new Date(contato.updated_at).toLocaleDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
