"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

interface HistoricoEtapa {
  id: number;
  negociacao_id: number;
  etapa_anterior: string;
  etapa_atual: string;
  alterado_por: string;
  observacao?: string;
  data_alteracao: string;
}

export default function HistoricoEtapasTab() {
  const params = useParams();
  const empresaId = Number(params?.id);
  const [historico, setHistorico] = useState<HistoricoEtapa[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/negociacoes/${empresaId}/historico-etapas`
        );
        const data = await res.json();
        setHistorico(data);
      } catch (err) {
        console.error("Erro ao buscar histórico de etapas:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, [empresaId]);

  if (loading) return <p>Carregando  histórico...</p>;

  if (!historico.length)
    return (
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          Nenhuma alteração de etapa registrada.
        </div>
      );
      
      

  return (
    <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
      <table className="min-w-full text-sm text-left text-gray-700 dark:text-gray-200">
        <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase text-gray-600 dark:text-gray-300">
          <tr>
            <th className="px-4 py-3">Etapa Anterior</th>
            <th className="px-4 py-3">Etapa Atual</th>
            <th className="px-4 py-3">Alterado Por</th>
            <th className="px-4 py-3">Data de Alteração</th>
            <th className="px-4 py-3">Observação</th>
          </tr>
        </thead>
        <tbody>
          {historico.map((item) => (
            <tr key={item.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-4 py-3">{item.etapa_anterior}</td>
              <td className="px-4 py-3">{item.etapa_atual}</td>
              <td className="px-4 py-3">{item.alterado_por}</td>
              <td className="px-4 py-3">
                {new Date(item.data_alteracao).toLocaleString("pt-BR")}
              </td>
              <td className="px-4 py-3 italic">
                {item.observacao ? item.observacao : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
