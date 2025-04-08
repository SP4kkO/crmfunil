import React, { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CriarTarefaModal } from "@/components/tarefa/CriarTarefaModal";

type Props = {
  id: string;
  label: string;
  tarefa?: string;
};

export default function DraggableCard({ id, label, tarefa }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style: React.CSSProperties | undefined = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
        zIndex: 50,
        position: "relative",
      }
    : undefined;

  // Estado para controlar a abertura do modal
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={`p-2 bg-gray-50 dark:bg-gray-700 rounded shadow-sm ${
          isDragging ? "border-2 border-blue-600" : ""
        }`}
      >
        <p className="text-sm text-gray-800 dark:text-white">{label}</p>
        {tarefa && (
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">{tarefa}</p>
        )}
        {/* Botão que abre o modal */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // Impede que o clique no botão inicie o drag
            setModalOpen(true);
          }}
          className="mt-2 px-2 py-1 bg-blue-600 text-white rounded text-xs"
        >
          Criar Tarefa
        </button>
      </div>

      {/* Modal que utiliza controle de estado para exibir/ocultar */}
      <CriarTarefaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
