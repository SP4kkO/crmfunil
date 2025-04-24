"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";

interface Cliente {
  id: number;
  nome: string;
}

interface Empresa {
  nome: string;
  segmento: string;
  url: string;
  resumo: string;
  tamanho_empresa: string;
  faixa_faturamento: string;
  cnpj_matriz: string;
  razao_social: string;
  telefone_matriz: string;
  cep: string;
  cidade: string;
  estado: string;
  cliente_da_base: boolean;
  cliente_id: number;
  linkedin_empresa: string;
  grupo: string;
  anotacoes: string[];
}

interface CriarEmpresaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEmpresaCriada?: (empresa: Empresa) => void;
}

export const CriarEmpresaModal: React.FC<CriarEmpresaModalProps> = ({
  isOpen,
  onClose,
  onEmpresaCriada,
}) => {
  const [empresa, setEmpresa] = useState<Empresa>({
    nome: "",
    segmento: "",
    url: "",
    resumo: "",
    tamanho_empresa: "",
    faixa_faturamento: "",
    cnpj_matriz: "",
    razao_social: "",
    telefone_matriz: "",
    cep: "",
    cidade: "",
    estado: "",
    cliente_da_base: false,
    cliente_id: 0,
    linkedin_empresa: "",
    grupo: "",
    
  });

  const [clientes, setClientes] = useState<Cliente[]>([]);

  // Busca os clientes para popular o select
  useEffect(() => {
    async function fetchClientes() {
      try {
        const res = await fetch("http://localhost:8080/api/clientes");
        if (res.ok) {
          const data = await res.json();
          setClientes(data);
        }
      } catch (error) {
        console.error("Erro ao buscar clientes:", error);
      }
    }
    fetchClientes();
  }, []);

  // Atualiza os inputs (checkbox será tratado separadamente)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let newValue: any = value;
    if (type === "checkbox") {
      newValue = (e.target as HTMLInputElement).checked;
    } else if (name === "cliente_id") {
      newValue = parseInt(value, 10);
    }
    setEmpresa((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };
  
  

  // Trata a textarea de anotações (uma anotação por linha)
  const handleAnotacoesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split("\n");
    setEmpresa((prev) => ({
      ...prev,
      anotacoes: lines,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:8080/api/empresas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(empresa),
      });
      if (!res.ok) {
        throw new Error("Erro ao criar empresa");
      }
      const novaEmpresa = await res.json();
      if (onEmpresaCriada) {
        onEmpresaCriada(novaEmpresa);
      }
      // Limpa o formulário e fecha o modal
      setEmpresa({
        nome: "",
        segmento: "",
        url: "",
        resumo: "",
        tamanho_empresa: "",
        faixa_faturamento: "",
        cnpj_matriz: "",
        razao_social: "",
        telefone_matriz: "",
        cep: "",
        cidade: "",
        estado: "",
        cliente_da_base: false,
        cliente_id: 0,
        linkedin_empresa: "",
        grupo: "",
        anotacoes: [],
      });
      onClose();
    } catch (error) {
      console.error("Erro ao criar empresa:", error);
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
              <h2 className="text-base font-bold mb-2">Criar Empresa</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Nome</label>
                  <input
                    type="text"
                    name="nome"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.nome}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Segmento</label>
                  <input
                    type="text"
                    name="segmento"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.segmento}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">URL</label>
                  <input
                    type="text"
                    name="url"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.url}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Resumo</label>
                  <textarea
                    name="resumo"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.resumo}
                    onChange={handleChange}
                  ></textarea>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Tamanho da Empresa
                  </label>
                  <input
                    type="text"
                    name="tamanho_empresa"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.tamanho_empresa}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Faixa de Faturamento
                  </label>
                  <input
                    type="text"
                    name="faixa_faturamento"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.faixa_faturamento}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">CNPJ Matriz</label>
                  <input
                    type="text"
                    name="cnpj_matriz"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.cnpj_matriz}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    name="razao_social"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.razao_social}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Telefone Matriz
                  </label>
                  <input
                    type="text"
                    name="telefone_matriz"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.telefone_matriz}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.cep}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.cidade}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Estado</label>
                  <input
                    type="text"
                    name="estado"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.estado}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    name="cliente_da_base"
                    className="mr-2"
                    checked={empresa.cliente_da_base}
                    onChange={handleChange}
                  />
                  <label className="font-medium">Cliente da Base</label>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Cliente ID
                  </label>
                  <select
                    name="cliente_id"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.cliente_id}
                    onChange={handleChange}
                    required
                  >
                    <option value={0}>Selecione um cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome} (ID: {cliente.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Linkedin Empresa
                  </label>
                  <input
                    type="text"
                    name="linkedin_empresa"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.linkedin_empresa}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Grupo</label>
                  <input
                    type="text"
                    name="grupo"
                    className="w-full p-1 border rounded text-xs"
                    value={empresa.grupo}
                    onChange={handleChange}
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
                    Criar Empresa
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
