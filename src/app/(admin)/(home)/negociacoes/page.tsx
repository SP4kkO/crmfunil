"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Modal } from "@/components/ui/modal";
import { Negociacao } from "@/types/Negocios";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { CriarNegociacaoModal } from "@/components/negociacoes/ModalCadastro";
import { CriarClienteModal } from "@/components/clientes/ModalCadastroCliente";
import { CriarTarefa } from "@/components/tarefa/ModaCadastroTarefa";
// Mapeamento: chave para droppableId e valor para a etapa do funil de vendas
const stageMap: { [key: string]: string } = {
  lead_mapeado: "Lead mapeado",
  lead_retomada: "Lead com data de retomada",
  visita_reuniao: "Visita/Reunião",
  adgo_info: "Adgo info QAR",
  em_cotacao: "Em cotacao",
  proposta: "Proposta",
  reuniao_fechamento: "Reuniao de fechamento",
  assinatura_proposta: "Assinatura de proposta",
  pedido_permitido: "Pedido permitido",
  pedidos_2025: "Pedidos 2025",
  pedidos_mapeados: "Pedidos mapeados",
};

export default function PipelinePage() {
  const [negocios, setNegocios] = useState<Negociacao[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedNegocio, setSelectedNegocio] = useState<Negociacao | null>(
    null
  );
  const [tarefaValue, setTarefaValue] = useState<string>("");
  const [layoutOrientation, setLayoutOrientation] = useState<
    "columns" | "rows"
  >("columns");
  const [plusDropdownOpen, setPlusDropdownOpen] = useState<boolean>(false);
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [showCriarTarefaModal, setShowCriarTarefaModal] = useState(false);
  const [showCriarClienteModal, setShowCriarClienteModal] = useState(false);
  useEffect(() => {
    fetch("http://localhost:8080/api/negociacoes")
      .then((res) => res.json())
      .then((data) => setNegocios(data))
      .catch((err) => console.error("Erro ao buscar negociações:", err));
  }, []);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const negocioId = parseInt(draggableId, 10);
    const negocioItem = negocios.find((item) => item.id === negocioId);
    if (!negocioItem) return;

    // Atualiza a etapa do funil com base na coluna destino
    const novaEtapa = stageMap[destination.droppableId];
    try {
      const response = await fetch(
        `http://localhost:8080/negociacoes/${negocioItem.id}/funil`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ etapa_funil_vendas: novaEtapa }),
        }
      );
      if (!response.ok) throw new Error("Erro ao atualizar etapa do funil");

      // Se o endpoint não retornar a propriedade atualizada, forçamos a atualização localmente
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _ = await response.json();
      const updatedItem = { ...negocioItem, etapa_funil_vendas: novaEtapa };
      setNegocios((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
    } catch (error) {
      console.error("Erro ao atualizar etapa do funil:", error);
    }
  };

  const handleCriarTarefa = (item: Negociacao) => {
    setSelectedNegocio(item);
    setTarefaValue(item.tarefa || "");
    setShowModal(true);
  };

  const handleSalvarTarefa = async () => {
    if (!selectedNegocio) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/negociacoes/${selectedNegocio.id}/tarefa`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tarefa: tarefaValue }),
        }
      );
      if (!response.ok) throw new Error("Erro ao salvar tarefa");
      const updatedItem = await response.json();
      setNegocios((prev) =>
        prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
      );
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  return (
    <div>
      <CriarNegociacaoModal
        isOpen={showCriarModal}
        onClose={() => setShowCriarModal(false)}
        onNegociacaoCriada={(novoNegocio) => {
          // Aqui você pode atualizar a lista de negócios, se necessário.
          console.log("Negócio criado:", novoNegocio);
        }}
      />
      <CriarClienteModal
        isOpen={showCriarClienteModal}
        onClose={() => setShowCriarClienteModal(false)}
        onClienteCriado={(novoCliente) => {
          // Atualize a lista de clientes, se necessário.
          console.log("Cliente criado:", novoCliente);
        }}
      />
      <CriarTarefa
        isOpen={showCriarTarefaModal}
        onClose={() => setShowCriarTarefaModal(false)}
        // Remova onTarefaCriada se não for necessário
      />
      <div className=" flex flex-col  dark:bg-gray-900">
        {/* Header com filtros e dropdown */}
        <div className="bg-red">
          {/* Header com filtros e dropdown */}
          <div className="p-4 ">
            <div className="mx-auto flex container justify-between items-center">
              {/* Botão para alterar a orientação do layout */}
              <div className="flex space-x-4">
                <button
                  onClick={() =>
                    setLayoutOrientation(
                      layoutOrientation === "columns" ? "rows" : "columns"
                    )
                  }
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  {layoutOrientation === "columns"
                    ? "Exibir em Linhas"
                    : "Exibir em Colunas"}
                </button>
              </div>

              {/* Dropdown de ações */}
              <div className="relative">
                <button
                  onClick={() => setPlusDropdownOpen((prev) => !prev)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  +
                </button>
                {plusDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                    <button
                      onClick={() => setShowCriarModal(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Criar Negócio
                    </button>
                    <button
                      onClick={() => setShowCriarClienteModal(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Criar Cliente
                    </button>
                    <button
                      onClick={() => setShowCriarTarefaModal(true)}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Criar Tarefa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <PageBreadcrumb pageTitle="Funil de Vendas" />

        {/* Container de drag & drop */}
        <div className="overflow-x-auto container flex">
          <DragDropContext onDragEnd={onDragEnd}>
            {layoutOrientation === "columns" ? (
              <div style={{ whiteSpace: "nowrap" }}>
                {Object.entries(stageMap).map(([droppableId, stageLabel]) => {
                  // Filtra os negócios pela etapa retornada
                  const items = negocios.filter(
                    (item) => item.etapa_funil_vendas === stageLabel
                  );
                  return (
                    <Droppable droppableId={droppableId} key={droppableId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="inline-block align-top bg-white rounded-lg shadow p-4 dark:bg-gray-800 min-w-[250px] mr-4"
                        >
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                            {stageLabel}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-2 bg-gray-50 rounded dark:bg-gray-700 ${
                                      snapshot.isDragging
                                        ? "border-2 border-blue-500"
                                        : ""
                                    }`}
                                  >
                                    <p className="text-sm text-gray-800 dark:text-white">
                                      {item.nome_negociacao}
                                    </p>
                                    {item.tarefa && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.tarefa}
                                      </p>
                                    )}
                                    <button
                                      onClick={() => handleCriarTarefa(item)}
                                      className="mt-2 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                      Criar Tarefa
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            ) : (
              <div className="overflow-y-auto p-4">
                {Object.entries(stageMap).map(([droppableId, stageLabel]) => {
                  const items = negocios.filter(
                    (item) => item.etapa_funil_vendas === stageLabel
                  );
                  return (
                    <Droppable droppableId={droppableId} key={droppableId}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="block bg-white rounded-lg shadow p-4 dark:bg-gray-800 w-full mb-4"
                        >
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                            {stageLabel}
                          </h3>
                          <div className="space-y-2">
                            {items.map((item, index) => (
                              <Draggable
                                key={item.id}
                                draggableId={item.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`p-2 bg-gray-50 rounded dark:bg-gray-700 ${
                                      snapshot.isDragging
                                        ? "border-2 border-blue-500"
                                        : ""
                                    }`}
                                  >
                                    <p className="text-sm text-gray-800 dark:text-white">
                                      {item.nome_negociacao}
                                    </p>
                                    {item.tarefa && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {item.tarefa}
                                      </p>
                                    )}
                                    <button
                                      onClick={() => handleCriarTarefa(item)}
                                      className="mt-2 px-3 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                      Criar Tarefa
                                    </button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>
                  );
                })}
              </div>
            )}
          </DragDropContext>
        </div>

        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          className="max-w-lg mx-auto my-8"
        >
          {selectedNegocio && (
            <div className="p-4">
              <h2 className="text-lg font-bold mb-4">
                Editar Tarefa para {selectedNegocio.nome_negociacao}
              </h2>
              <div className="mb-4">
                <p>
                  <strong>ID:</strong> {selectedNegocio.id}
                </p>
                <p>
                  <strong>Etapa:</strong> {selectedNegocio.etapa_funil_vendas}
                </p>
              </div>
              <div>
                <label className="block mb-2 font-medium">Tarefa</label>
                <textarea
                  className="w-full p-2 border rounded"
                  value={tarefaValue}
                  onChange={(e) => setTarefaValue(e.target.value)}
                  placeholder="Digite a nova tarefa..."
                ></textarea>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="mr-2 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSalvarTarefa}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Salvar Tarefa
                </button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
