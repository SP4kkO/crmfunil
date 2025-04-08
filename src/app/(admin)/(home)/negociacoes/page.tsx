"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import type { DragEndEvent } from "@dnd-kit/core";
import { Negociacao } from "@/types/Negocios";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import CriarNegociacaoModal from "@/components/negociacoes/ModalCadastro";
import { CriarClienteModal } from "@/components/clientes/ModalCadastroCliente";
import CriarTarefaModal from "@/components/tarefa/CriarTarefaModal";
import DroppableColumn from "@/components/funil/DroppableColumn";
import DraggableCard from "@/components/funil/DraggableCard";
import { CriarEmpresaModal } from "@/components/empresa/ModalCriaEmpresa";

import { CadastroModalContato } from "@/components/contato/CriarContatoModal";
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
  const [layoutOrientation, setLayoutOrientation] = useState<
    "columns" | "rows"
  >("columns");
  const [showContatoModal, setShowContatoModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showCriarModal, setShowCriarModal] = useState(false);
  const [showCriarTarefaModal, setShowCriarTarefaModal] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [plusDropdownOpen, setPlusDropdownOpen] = useState(false);

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    fetch("http://localhost:8080/api/negociacoes")
      .then((res) => res.json())
      .then((data) => {
        console.log("Negociações recebidas:", data);
        setNegocios(data);
      })
      .catch((err) => console.error("Erro ao buscar negociações:", err));
  }, []);
  

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const dragged = negocios.find((n) => n.id.toString() === active.id);
    const newEtapa = stageMap[over.id];
    if (!dragged || !newEtapa || dragged.etapa_funil_vendas === newEtapa)
      return;

    try {
      await fetch(`http://localhost:8080/api/negociacoes/${dragged.id}/funil`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ etapa_funil_vendas: newEtapa }),
      });

      setNegocios((prev) =>
        prev.map((n) =>
          n.id === dragged.id ? { ...n, etapa_funil_vendas: newEtapa } : n
        )
      );
    } catch (err) {
      console.error("Erro ao mover negócio:", err);
    }
  };

  return (
    <div className="dark:bg-gray-900 ">
      <PageBreadcrumb pageTitle="Funil de Vendas" />

      <div className="flex justify-between items-center p-4 container">
        {/* Botão de layout com ícone */}
        <button
          onClick={() =>
            setLayoutOrientation((prev) =>
              prev === "columns" ? "rows" : "columns"
            )
          }
          className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          title="Alternar visualização"
        >
          {layoutOrientation === "columns" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg> // ícone de linhas
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 4v16M12 4v16M18 4v16"
              />
            </svg> // ícone de colunas
          )}
        </button>

        {/* Dropdown de opções "+" */}
        <div className="relative">
          <button
            onClick={() => setPlusDropdownOpen((prev) => !prev)}
            className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            title="Ações rápidas"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
          </button>
          {plusDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">
              <button
                onClick={() => {
                  setShowClienteModal(true);
                  setPlusDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Criar Cliente
              </button>
              <button
                onClick={() => {
                  setShowContatoModal(true);
                  setPlusDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Criar Contato
              </button>
              <button
                onClick={() => {
                  setModalOpen(true);
                  setPlusDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Criar Empresa
              </button>
              <button
                onClick={() => {
                  setShowCriarModal(true);
                  setPlusDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Criar Negociação
              </button>
              <button
                onClick={() => {
                  setShowCriarTarefaModal(true);
                  setPlusDropdownOpen(false);
                }}
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Criar Tarefa
              </button>
            </div>
          )}
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        {/* CONTAINER EXTERNO: limita largura da tela e aplica scroll */}
        <div
          className={`w-full ${
            layoutOrientation === "columns"
              ? "overflow-x-auto"
              : "overflow-y-auto"
          }`}
        >
          {/* CONTAINER INTERNO: colunas expansíveis apenas em modo 'columns' */}
          <div
            className={`gap-4 px-4 flex ${
              layoutOrientation === "columns"
                ? "flex-row w-fit"
                : "flex-col w-full"
            }`}
          >
            {Object.entries(stageMap).map(([droppableId, stageLabel]) => {
              const items = negocios.filter(
                (n) => n.etapa_funil_vendas === stageLabel
              );
              return (
                <DroppableColumn
                  key={droppableId}
                  id={droppableId}
                  label={stageLabel}
                >
                  <SortableContext
                    items={items.map((i) => i.id.toString())}
                    strategy={verticalListSortingStrategy}
                  >
                    {items.map((item) => (
                      <div key={item.id} className="relative">
                        <DraggableCard
                          id={item.id.toString()}
                          label={item.nome_negociacao}
                          tarefa={item.tarefa}
                        />
                        {/* Botão posicionado apenas no canto inferior direito */}

                      </div>
                    ))}
                  </SortableContext>
                </DroppableColumn>
              );
            })}
          </div>
        </div>
      </DndContext>

      <CriarNegociacaoModal
        isOpen={showCriarModal}
        onClose={() => setShowCriarModal(false)}
        onNegociacaoCriada={() => {}}
      />
      <CriarClienteModal
        isOpen={showClienteModal}
        onClose={() => setShowClienteModal(false)}
        onClienteCriado={() => {}}
      />
      <CriarTarefaModal
        isOpen={showCriarTarefaModal}
        onClose={() => setShowCriarTarefaModal(false)}
      />
      <CriarEmpresaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onEmpresaCriada={(empresa) => console.log("Empresa criada:", empresa)}
      />

      <CadastroModalContato
        isOpen={showContatoModal}
        onClose={() => setShowContatoModal(false)}
        onContatoCriado={(contato) => console.log("Contato criado:", contato)}
      />
    </div>
  );
}
