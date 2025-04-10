"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Contato } from "@/types/Contatos"; // Certifique-se de que esse tipo está definido conforme seu modelo

interface CriarContatoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContatoCriado?: (contato: Contato) => void;
}

export const CadastroModalContato: React.FC<CriarContatoModalProps> = ({
  isOpen,
  onClose,
  onContatoCriado,
}) => {
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [telefones, setTelefones] = useState("");
  const [email, setEmail] = useState("");
  const [empresa, setEmpresa] = useState("");
  const [informacoesAdicionais, setInformacoesAdicionais] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [camposPersonalizados, setCamposPersonalizados] = useState("");
  const [eDecisor, setEDecisor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      nome,
      cargo,
      telefones,
      email,
      empresa,
      informacoes_adicionais: informacoesAdicionais,
      linkedin,
      campos_personalizados: camposPersonalizados,
      e_decisor: eDecisor,
    };

    try {
      const response = await fetch("http://localhost:8080/api/contatos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar contato");
      }

      const novoContato = await response.json();
      if (onContatoCriado) {
        onContatoCriado(novoContato);
      }
      onClose();
      window.location.reload();

      // Limpa os campos após criação com sucesso
      setNome("");
      setCargo("");
      setTelefones("");
      setEmail("");
      setEmpresa("");
      setInformacoesAdicionais("");
      setLinkedin("");
      setCamposPersonalizados("");
      setEDecisor(false);
    } catch (error) {
      console.error("Erro ao criar contato:", error);
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
              <h2 className="text-base font-bold mb-2">Criar Contato</h2>
              <form onSubmit={handleSubmit}>
                {/* Nome */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                    required
                  />
                </div>
                {/* Cargo */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Cargo</label>
                  <input
                    type="text"
                    value={cargo}
                    onChange={(e) => setCargo(e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* Telefones */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Telefones</label>
                  <textarea
                    value={telefones}
                    onChange={(e) => setTelefones(e.target.value)}
                    placeholder='Digite um telefone por linha, ex: "+5511999998888"'
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* Email */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* Empresa */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Empresa</label>
                  <input
                    type="text"
                    value={empresa}
                    onChange={(e) => setEmpresa(e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* Informações Adicionais */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Informações Adicionais
                  </label>
                  <textarea
                    value={informacoesAdicionais}
                    onChange={(e) => setInformacoesAdicionais(e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* LinkedIn */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">LinkedIn</label>
                  <input
                    type="text"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* Campos Personalizados */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Campos Personalizados
                  </label>
                  <textarea
                    value={camposPersonalizados}
                    onChange={(e) => setCamposPersonalizados(e.target.value)}
                    placeholder="Digite dados personalizados no formato JSON, se necessário"
                    className="w-full p-1 border rounded text-xs"
                  />
                </div>
                {/* É Decisor */}
                <div className="mb-2 flex items-center">
                  <input
                    type="checkbox"
                    checked={eDecisor}
                    onChange={(e) => setEDecisor(e.target.checked)}
                    className="mr-2"
                  />
                  <label className="font-medium">É Decisor?</label>
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
                    Criar Contato
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
