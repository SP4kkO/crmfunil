"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";

interface Contato {
  id?: number;
  cliente_id: number;
  nome: string;
  cargo?: string;
  telefones?: string[];
  email?: string;
  empresa?: string;
  informacoesAdicionais?: string;
  linkedin?: string;
  camposPersonalizados?: string;
  e_decisor: boolean;
}

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
  const [clienteID, setClienteID] = useState<number>(0);
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

    // Converte a string de telefones em array (um telefone por linha)
    const telefonesArray = telefones
      .split("\n")
      .map((tel) => tel.trim())
      .filter((tel) => tel !== "");

    const payload: Contato = {
      cliente_id: clienteID,
      nome,
      cargo,
      telefones: telefonesArray,
      email,
      empresa,
      informacoesAdicionais,
      linkedin,
      camposPersonalizados,
      e_decisor: eDecisor,
    };

    try {
      const response = await fetch("http://localhost:8080/api/contatos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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

      // Limpa os campos
      setClienteID(0);
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
      <Modal isOpen={isOpen} onClose={onClose} className="p-0">
        <div className="fixed inset-0 flex items-center justify-center">
          <div className="max-w-lg w-full bg-white p-4 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">Criar Contato</h2>
            <form onSubmit={handleSubmit}>
              {/* Cliente ID */}

              {/* Nome */}
              <div className="mb-2">
                <label className="block mb-1 font-medium">Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Telefones */}
              <div className="mb-2">
                <label className="block mb-1 font-medium">Telefones</label>
                <textarea
                  value={telefones}
                  onChange={(e) => setTelefones(e.target.value)}
                  placeholder='Digite um telefone por linha, ex: "+5511999998888"'
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Email */}
              <div className="mb-2">
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* Empresa */}
              <div className="mb-2">
                <label className="block mb-1 font-medium">Empresa</label>
                <input
                  type="text"
                  value={empresa}
                  onChange={(e) => setEmpresa(e.target.value)}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
                />
              </div>
              {/* LinkedIn */}
              <div className="mb-2">
                <label className="block mb-1 font-medium">LinkedIn</label>
                <input
                  type="text"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Criar Contato
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};
