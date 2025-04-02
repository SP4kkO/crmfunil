"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Negociacao } from "@/types/Negocios";

interface CriarTarefaProps {
  isOpen: boolean;
  onClose: () => void;
  onNegociacaoCriada?: (negociacao: Negociacao) => void;
  // Caso a EmpresaID seja definida externamente, você pode recebê-la via props
  empresaID?: number;
}

export const CriarTarefa: React.FC<CriarTarefaProps> = ({
  isOpen,
  onClose,
  onNegociacaoCriada,
  empresaID,
}) => {
  const [empresaNegociacao, setEmpresaNegociacao] = useState("");
  const [negociacao, setNegociacao] = useState("");
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
      // ID e NegociacaoID são gerados automaticamente
      empresa_id: empresaID,
      empresa_negociacao: empresaNegociacao,
      negociacao: negociacao,
      assunto: assunto,
      descricao: descricao,
      responsavel: responsavel,
      tipo: tipo,
      data_agendamento: dataAgendamento,
      horario: horario,
      concluida: concluida,
    };

    try {
      const response = await fetch("http://localhost:8080/api/negociacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar negociação");
      }

      const novaNegociacao = await response.json();

      if (onNegociacaoCriada) {
        onNegociacaoCriada(novaNegociacao);
      }

      onClose();

      // Limpa os campos após o sucesso
      setEmpresaNegociacao("");
      setNegociacao("");
      setAssunto("");
      setDescricao("");
      setResponsavel("");
      setTipo("");
      setDataAgendamento("");
      setHorario("");
      setConcluida(false);
    } catch (error) {
      console.error("Erro ao criar negociação:", error);
    }
  };

  return (
    <>
      {/* Animação de slide da direita para a esquerda */}
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
        <div className="fixed inset-0 flex bg-opacity-5 justify-end">
          <div className="h-full w-64 overflow-y-auto text-xs slide-in bg-white bg-opacity-80 backdrop-blur-sm">
            <div className="p-2">
              <h2 className="text-base font-bold mb-2">Criar Negociação</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Empresa Negociação
                  </label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={empresaNegociacao}
                    onChange={(e) => setEmpresaNegociacao(e.target.value)}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Negociação</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={negociacao}
                    onChange={(e) => setNegociacao(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Assunto</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={assunto}
                    onChange={(e) => setAssunto(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Descrição</label>
                  <textarea
                    className="w-full p-1 border rounded text-xs"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  ></textarea>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Responsável</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Tipo</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Data de Agendamento
                  </label>
                  <input
                    type="date"
                    className="w-full p-1 border rounded text-xs"
                    value={dataAgendamento}
                    onChange={(e) => setDataAgendamento(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Horário</label>
                  <input
                    type="time"
                    className="w-full p-1 border rounded text-xs"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    id="concluida"
                    className="mr-2"
                    checked={concluida}
                    onChange={(e) => setConcluida(e.target.checked)}
                  />
                  <label htmlFor="concluida" className="font-medium">
                    Concluída
                  </label>
                </div>
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="mr-2 px-2 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-xs"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
                  >
                    Criar Negociação
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
