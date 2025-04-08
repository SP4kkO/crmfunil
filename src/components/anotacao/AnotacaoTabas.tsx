"use client";

import React, { useEffect, useState } from "react";

type Anotacao = {
  id: number;
  data: string; // Data no formato ISO
  assunto: string;
  anotacao: string;
  empresa_id: number;
};

type AnotacoesTabProps = {
  companyId: string;
};

export default function AnotacoesTab({ companyId }: AnotacoesTabProps) {
  const [anotacoes, setAnotacoes] = useState<Anotacao[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    // Supondo que o endpoint suporte filtragem por query parameter
    fetch(`http://localhost:8080/api/anotacoes?empresa_id=${companyId}`)
      .then((res) => res.json())
      .then((data: Anotacao[]) => {
        // Caso o endpoint não filtre, você pode filtrar aqui:
        const filtered = data.filter(
          (a) => a.empresa_id.toString() === companyId
        );
        setAnotacoes(filtered);
      })
      .catch((err) => console.error("Erro ao buscar anotações:", err));
  }, [companyId]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Anotações</h2>
      <div className="max-h-64 overflow-y-auto border rounded p-2">
        {anotacoes.length === 0 ? (
          <p className="text-gray-500">Nenhuma anotação encontrada.</p>
        ) : (
          anotacoes.map((item) => (
            <div key={item.id} className="mb-2 border-b pb-2">
              <button
                className="w-full text-left font-medium"
                onClick={() =>
                  setExpanded(expanded === item.id ? null : item.id)
                }
              >
                {item.assunto} -{" "}
                {new Date(item.data).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </button>
              {expanded === item.id && (
                <div className="mt-1 text-gray-700">{item.anotacao}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
