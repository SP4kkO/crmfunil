"use client";
import React, { useEffect, useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Modal } from "@/components/ui/modal";

const stages = [
  "Lead mapeado",
  "Lead com data de retomada",
  "Visita/Reunião",
  "Adgo info QAR",
  "Em cotacao",
  "Proposta",
  "Reuniao de fechamento",
  "Assinatura de proposta",
  "Pedido permitido",
  "Pedidos 2025",
  "Pedidos mapeados",
];

export default function PipelinePage() {
  const [negocios, setNegocios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedNegocio, setSelectedNegocio] = useState(null);
  const [tarefaValue, setTarefaValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:8080/api/negocios")
      .then((res) => res.json())
      .then((data) => setNegocios(data))
      .catch((err) => console.error("Erro ao buscar negócios:", err));
  }, []);

  const handleCriarTarefa = (item) => {
    setSelectedNegocio(item);
    setTarefaValue(item.tarefa || "");
    setShowModal(true);
    console.log('apertado')
  };

  const handleSalvarTarefa = async () => {
    if (!selectedNegocio) return;
    try {
      const response = await fetch(
        `http://localhost:8080/api/negocios/${selectedNegocio.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...selectedNegocio,
            tarefa: tarefaValue,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao salvar tarefa");
      }
      const updatedItem = await response.json();
      // Atualiza o estado local com o item atualizado
      setNegocios((prev) =>
        prev.map((item) =>
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <PageBreadcrumb pageTitle="Funil de Vendas" />
      {/* Área de conteúdo principal com scroll horizontal */}
      <div
        className="flex-grow overflow-x-auto overflow-y-hidden"
        style={{ whiteSpace: "nowrap" }}
      >
        {stages.map((stage, index) => {
          const items = negocios.filter(
            (item) => item.status === stage
          );
          return (
            <div
              key={index}
              className="inline-block align-top bg-white rounded-lg shadow p-4 dark:bg-gray-800 min-w-[250px] mr-4"
            >
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                {stage}
              </h3>
              <div className="space-y-2">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-gray-50 rounded dark:bg-gray-700"
                    >
                      <p className="text-sm text-gray-800 dark:text-white">
                        {item.nome_empresa}
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum item
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {/* Footer colado na parte inferior */}
      <footer className="bg-white dark:bg-gray-800 p-4">
        <div className="container mx-auto text-center text-gray-600 dark:text-gray-400">
          &copy; {new Date().getFullYear()} Meu CRM. Todos os direitos reservados.
        </div>
      </footer>
      {/* Modal para criação/edição de tarefa */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-4">
            <h2 className="text-lg font-bold mb-4">
              Criar Tarefa para {selectedNegocio?.nome_empresa}
            </h2>
            <textarea
              className="w-full p-2 border rounded"
              value={tarefaValue}
              onChange={(e) => setTarefaValue(e.target.value)}
              placeholder="Digite a tarefa..."
            ></textarea>
            <button
              onClick={handleSalvarTarefa}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar Tarefa
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
