"use client";

import React, { useState, useEffect, FormEvent } from "react";
import { Modal } from "@/components/ui/modal";

type Empresa = {
  id: number;
  nome: string;
};

type Negociacao = {
  id: number;
  nome_negociacao: string;  // corresponde ao JSON "nome_negociacao"
};

type CriarTarefaPayload = {
  negociacao_id: number;
  empresa_id: number;
  negociacao: string;
  assunto: string;
  descricao?: string;
  responsavel: string;
  tipo: string;
  data_agendamento: string; // "YYYY-MM-DDT00:00:00Z"
  horario: string;          // "HH:MM"
  concluida: boolean;
};

type CriarTarefaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTarefaCriada?: (tarefa: any) => void;
};

export default function CriarTarefaModal({
  isOpen,
  onClose,
  onTarefaCriada,
}: CriarTarefaModalProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [negociacoes, setNegociacoes] = useState<Negociacao[]>([]);
  const [selectedEmpresaID, setSelectedEmpresaID] = useState<number>(0);
  const [selectedNegociacaoID, setSelectedNegociacaoID] = useState<number>(0);
  const [assunto, setAssunto] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [responsavel, setResponsavel] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [dataAgendamento, setDataAgendamento] = useState<string>("");
  const [horario, setHorario] = useState<string>("");

  // ─── Carrega lista de empresas ───────────────────────────────
  useEffect(() => {
    fetch("http://localhost:8080/api/empresas")
      .then((res) => res.json())
      .then((data: Empresa[]) => setEmpresas(data))
      .catch((err) => console.error("Erro ao buscar empresas:", err));
  }, []);

  // ─── Carrega lista de negociações ────────────────────────────
  useEffect(() => {
    fetch("http://localhost:8080/api/negociacoes")
      .then((res) => res.json())
      .then((data: Negociacao[]) => setNegociacoes(data))
      .catch((err) => console.error("Erro ao buscar negociações:", err));
  }, []);

  // ─── Envio do formulário ─────────────────────────────────────
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // encontra o nome da negociação selecionada
    const negociacaoSelecionada = negociacoes.find(
      (n) => n.id === selectedNegociacaoID
    );

    const payload: CriarTarefaPayload = {
      negociacao_id: selectedNegociacaoID,
      empresa_id: selectedEmpresaID,
      negociacao: negociacaoSelecionada
        ? negociacaoSelecionada.nome_negociacao
        : "",
      assunto,
      descricao: descricao || undefined,
      responsavel,
      tipo,
      data_agendamento: dataAgendamento
        ? `${dataAgendamento}T00:00:00Z`
        : "",
      horario,
      concluida: false, // sempre começar como não concluída
    };

    try {
      const res = await fetch("http://localhost:8080/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(res.statusText);
      const novaTarefa = await res.json();
      onTarefaCriada?.(novaTarefa);
      onClose();
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  };

  return (
    <>
      {/* Animação slide-in */}
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
          <div className="h-full w-80 overflow-y-auto text-xs slide-in bg-white bg-opacity-80 backdrop-blur-sm">
            <div className="p-2">
              <h2 className="text-base font-bold mb-2">Criar Tarefa</h2>
              <form onSubmit={handleSubmit}>
                {/* Empresa */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Empresa</label>
                  <select
                    className="w-full p-1 border rounded text-xs"
                    value={selectedEmpresaID}
                    onChange={(e) =>
                      setSelectedEmpresaID(Number(e.target.value))
                    }
                    required
                  >
                    <option value={0} disabled>
                      Selecione uma empresa
                    </option>
                    {empresas.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Negociação */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Negociação</label>
                  <select
                    className="w-full p-1 border rounded text-xs"
                    value={selectedNegociacaoID}
                    onChange={(e) =>
                      setSelectedNegociacaoID(Number(e.target.value))
                    }
                    required
                  >
                    <option value={0} disabled>
                      Selecione uma negociação
                    </option>
                    {negociacoes.map((neg) => (
                      <option key={neg.id} value={neg.id}>
                        {neg.nome_negociacao}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Assunto */}
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

                {/* Descrição */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Descrição
                  </label>
                  <textarea
                    className="w-full p-1 border rounded text-xs"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>

                {/* Responsável */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Responsável
                  </label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={responsavel}
                    onChange={(e) => setResponsavel(e.target.value)}
                    required
                  />
                </div>

                {/* Tipo */}
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

                {/* Data de Agendamento */}
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

                {/* Horário */}
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

                {/* Botões */}
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
                    Criar Tarefa
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
