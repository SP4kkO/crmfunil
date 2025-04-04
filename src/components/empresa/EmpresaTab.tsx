"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { TabButton } from "@/components/ui/tabs/TabWithUnderline";
import Alert from "@/components/ui/alert/Alert"; // Ajuste o caminho conforme necessário

interface Tab {
  id: string;
  label: string;
}

const tabs: Tab[] = [
  { id: "negociacao", label: "Criar Negociação" },
  { id: "tarefa", label: "Criar Tarefa" },
];

interface AlertType {
  variant: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export default function EmpresaActionsTabs() {
  const params = useParams();
  const empresaId = Number(params?.id); // Pegar o ID da empresa
  const [activeTab, setActiveTab] = useState("negociacao");

  const [negociacao, setNegociacao] = useState("");
  const [tarefa, setTarefa] = useState({
    negociacao: "",
    assunto: "",
    descricao: "",
    responsavel: "",
    tipo: "",
    data_agendamento: "",
    horario: "",
  });

  const [alert, setAlert] = useState<AlertType | null>(null);

  // Enviar anotação (negociação)
  const handleNegociacaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:8080/api/empresas/${empresaId}/anotacoes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anotacao: negociacao,
        }),
      });
      if (!res.ok) {
        throw new Error("Erro ao criar anotação");
      }
      setAlert({
        variant: "success",
        title: "Sucesso",
        message: "Negociação (anotação) criada!",
      });
      setNegociacao("");
    } catch (error: any) {
      setAlert({
        variant: "error",
        title: "Erro",
        message: error.message || "Erro desconhecido",
      });
    }
  };

  // Enviar tarefa
  const handleTarefaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...tarefa,
          empresa_id: empresaId,
        }),
      });
      if (!res.ok) {
        throw new Error("Erro ao criar tarefa");
      }
      setAlert({
        variant: "success",
        title: "Sucesso",
        message: "Tarefa criada!",
      });
      setTarefa({
        negociacao: "",
        assunto: "",
        descricao: "",
        responsavel: "",
        tipo: "",
        data_agendamento: "",
        horario: "",
      });
    } catch (error: any) {
      setAlert({
        variant: "error",
        title: "Erro",
        message: error.message || "Erro desconhecido",
      });
    }
  };

  return (
    <div className="p-6 border border-gray-200 rounded-xl dark:border-gray-800 mt-6">
      {/* Exibe o alerta se existir */}
      {alert && (
        <div className="mb-4">
          <Alert variant={alert.variant} title={alert.title} message={alert.message} />
        </div>
      )}

      <div className="border-b border-gray-200 dark:border-gray-800 mb-4">
        <nav className="flex space-x-4">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
            />
          ))}
        </nav>
      </div>

      {/* Aba: Criar Negociação */}
      {activeTab === "negociacao" && (
        <form onSubmit={handleNegociacaoSubmit} className="space-y-4">
          <textarea
            value={negociacao}
            onChange={(e) => setNegociacao(e.target.value)}
            className="w-full rounded-lg border border-gray-300 p-3 dark:bg-gray-800 dark:text-white"
            placeholder="Anotação sobre a negociação..."
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Enviar Anotação
          </button>
        </form>
      )}

      {/* Aba: Criar Tarefa */}
      {activeTab === "tarefa" && (
        <form onSubmit={handleTarefaSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Negociação"
            value={tarefa.negociacao}
            onChange={(e) => setTarefa({ ...tarefa, negociacao: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Assunto"
            value={tarefa.assunto}
            onChange={(e) => setTarefa({ ...tarefa, assunto: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Responsável"
            value={tarefa.responsavel}
            onChange={(e) => setTarefa({ ...tarefa, responsavel: e.target.value })}
            required
            className="input"
          />
          <input
            type="text"
            placeholder="Tipo"
            value={tarefa.tipo}
            onChange={(e) => setTarefa({ ...tarefa, tipo: e.target.value })}
            required
            className="input"
          />
          <input
            type="date"
            value={tarefa.data_agendamento}
            onChange={(e) => setTarefa({ ...tarefa, data_agendamento: e.target.value })}
            required
            className="input"
          />
          <input
            type="time"
            value={tarefa.horario}
            onChange={(e) => setTarefa({ ...tarefa, horario: e.target.value })}
            required
            className="input"
          />
          <textarea
            placeholder="Descrição (opcional)"
            value={tarefa.descricao}
            onChange={(e) => setTarefa({ ...tarefa, descricao: e.target.value })}
            className="col-span-1 sm:col-span-2 input"
          />
          <button
            type="submit"
            className="col-span-1 sm:col-span-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Criar Tarefa
          </button>
        </form>
      )}
    </div>
  );
}
