"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface Tarefa {
  id: number;
  empresa_id: number;
  assunto: string;
  descricao: string;
  responsavel: string;
  tipo: string;
  data_agendamento: string;
  horario: string;
  concluida: boolean;
}

interface CriarTarefaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTarefaCriada?: (tarefa: Tarefa) => void;
  // Valores pré-definidos da empresa
  empresaID: number;
  empresaNome: string;
}

export const CriarTarefaModal: React.FC<CriarTarefaModalProps> = ({
  isOpen,
  onClose,
  onTarefaCriada,
  empresaID,
  empresaNome,
}) => {
  const [assunto, setAssunto] = useState("");
  const [descricao, setDescricao] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [tipo, setTipo] = useState("");
  const [dataAgendamento, setDataAgendamento] = useState("");
  const [horario, setHorario] = useState("");
  const [concluida, setConcluida] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      empresa_id: empresaID, // valor pré-definido e não editável
      assunto,
      descricao,
      responsavel,
      tipo,
      data_agendamento: dataAgendamento,
      horario,
      concluida,
    };

    try {
      const response = await fetch("http://localhost:8080/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar tarefa");
      }

      const novaTarefa = await response.json();

      if (onTarefaCriada) {
        onTarefaCriada(novaTarefa);
      }

      onClose();

      // Limpa os campos do formulário
      setAssunto("");
      setDescricao("");
      setResponsavel("");
      setTipo("");
      setDataAgendamento("");
      setHorario("");
      setConcluida(false);
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
    }
  };

  return (
    <>
      {/* Estilos para animação de slide */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .slide-in {
          animation: slideInRight 0.5s ease-out;
        }
      `}</style>
      <Modal isOpen={isOpen} onClose={onClose} className="p-0">
        <div className="fixed inset-0 flex justify-center bg-opacity-5">
          <div className="max-w-lg w-full bg-white bg-opacity-90 backdrop-blur-sm slide-in p-4">
            <h2 className="text-lg font-bold mb-4">
              Criar Tarefa para: {empresaNome} (ID: {empresaID})
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  value={assunto}
                  onChange={(e) => setAssunto(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Descrição
                </label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Responsável
                </label>
                <input
                  type="text"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Tipo
                </label>
                <input
                  type="text"
                  value={tipo}
                  onChange={(e) => setTipo(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Data de Agendamento
                  </label>
                  <input
                    type="date"
                    value={dataAgendamento}
                    onChange={(e) => setDataAgendamento(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Horário
                  </label>
                  <input
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  type="checkbox"
                  checked={concluida}
                  onChange={(e) => setConcluida(e.target.checked)}
                  className="mr-2"
                />
                <label className="text-sm font-medium">Concluída</label>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
