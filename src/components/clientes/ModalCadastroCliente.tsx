"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Cliente } from "@/types/Clientes";

interface CriarClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClienteCriado?: (cliente: Cliente) => void;
}

export const CriarClienteModal: React.FC<CriarClienteModalProps> = ({
  isOpen,
  onClose,
  onClienteCriado,
}) => {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [contato, setContato] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome: nome,
      cnpj: cnpj,
      endereco: endereco,
      contato: contato,
      // Os arrays "empresas" e "contatos" ficarão vazios para representar as FKs
      empresas: [],
      contatos: [],
    };

    try {
      const response = await fetch("http://localhost:8080/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar cliente");
      }

      const novoCliente = await response.json();
      if (onClienteCriado) {
        onClienteCriado(novoCliente);
      }
      onClose();

      // Limpa os campos após criação com sucesso
      setNome("");
      setCnpj("");
      setEndereco("");
      setContato("");
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
    }
  };

  return (
    <>
      {/* Modal com animação de slide da direita para a esquerda */}
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
              <h2 className="text-base font-bold mb-2">Criar Novo Cliente</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Nome</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">CNPJ</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Endereço</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={endereco}
                    onChange={(e) => setEndereco(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Contato</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={contato}
                    onChange={(e) => setContato(e.target.value)}
                    required
                  />
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
                    Criar Cliente
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
