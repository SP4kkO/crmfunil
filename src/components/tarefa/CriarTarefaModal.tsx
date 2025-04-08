"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";

type Empresa = {
  id: number;
  nome: string;
};

// Note que, no payload, mesmo que a interface do componente use "Tarefa" para o label,
// o backend espera o campo "negociacao".
type CriarTarefaPayload = {
  empresa_id: number;
  negociacao: string; // <-- Campo obrigatório que representa a tarefa/negociação
  assunto: string;
  descricao?: string;
  responsavel: string;
  tipo: string;
  data_agendamento: string; // Formato "YYYY-MM-DDT00:00:00Z"
  horario: string; // Ex: "HH:MM"
};

type CriarTarefaModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onTarefaCriada?: (tarefa: unknown) => void;
};

export default function CriarTarefaModal({
  isOpen,
  onClose,
  onTarefaCriada,
}: CriarTarefaModalProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [selectedEmpresaID, setSelectedEmpresaID] = useState<number>(0);
  const [tarefa, setTarefa] = useState<string>(""); // Aqui o usuário insere o nome da tarefa
  const [assunto, setAssunto] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [responsavel, setResponsavel] = useState<string>("");
  const [tipo, setTipo] = useState<string>("");
  const [dataAgendamento, setDataAgendamento] = useState<string>(""); // "YYYY-MM-DD"
  const [horario, setHorario] = useState<string>(""); // "HH:MM"

  // Busca as empresas via endpoint
  useEffect(() => {
    fetch("http://localhost:8080/api/empresas")
      .then((res) => res.json())
      .then((data: Empresa[]) => setEmpresas(data))
      .catch((error) => console.error("Erro ao buscar empresas:", error));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Formata a data para incluir horário padrão (T00:00:00Z)
    const dataAgendamentoFormatted = dataAgendamento
      ? `${dataAgendamento}T00:00:00Z`
      : "";

    const payload: CriarTarefaPayload = {
      empresa_id: selectedEmpresaID,
      // Observe que mapeamos o valor digitado no campo "Tarefa" para a propriedade "negociacao"
      negociacao: tarefa,
      assunto: assunto,
      descricao: descricao || undefined,
      responsavel: responsavel,
      tipo: tipo,
      data_agendamento: dataAgendamentoFormatted,
      horario: horario,
    };

    try {
      const res = await fetch("http://localhost:8080/api/tarefas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const novaTarefa = await res.json();
        if (onTarefaCriada) {
          onTarefaCriada(novaTarefa);
        }
        onClose();
      } else {
        console.error("Erro ao criar tarefa:", res.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição de criação:", error);
    }
  };

  return (
    <>
      {/* Animação slide-in da direita para a esquerda */}
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
                {/* Select para Escolher Empresa */}
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
                    <option value={0}>Selecione uma empresa</option>
                    {empresas.map((empresa) => (
                      <option key={empresa.id} value={empresa.id}>
                        {empresa.nome}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Campo Tarefa (será mapeado para "negociacao") */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Tarefa</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={tarefa}
                    onChange={(e) => setTarefa(e.target.value)}
                    required
                  />
                </div>
                {/* Campo Assunto */}
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
                {/* Campo Descrição (opcional) */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Descrição</label>
                  <textarea
                    className="w-full p-1 border rounded text-xs"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                </div>
                {/* Campo Responsável */}
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
                {/* Campo Tipo */}
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
                {/* Campo Data de Agendamento */}
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
                {/* Campo Horário */}
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
