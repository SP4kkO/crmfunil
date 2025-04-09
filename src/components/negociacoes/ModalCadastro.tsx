"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/modal";

type NegociacaoPayload = {
  empresa_id: number;
  contato_id: number;
  nome_negociacao: string;
  funil_vendas: string;
  etapa_funil_vendas: string;
  fonte: string;
  campanha: string;
  seguradora_atual: string;
  data_vencimento_apolice: string; // formato: YYYY-MM-DD
};

type Empresa = {
  id: number;
  nome: string;
};

type Contato = {
  id: number;
  nome: string;
};

type CriarNegociacaoModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onNegociacaoCriada?: (negociacao: unknown) => void;
};

// Mapeamento de opções para Etapa Funil Vendas
const etapasOptions: { [key: string]: string } = {
  "Lead mapeado": "Lead mapeado",
  "Lead com data de retomada": "Lead com data de retomada",
  "Visita/Reunião": "Visita/Reunião",
  "Adgo info QAR": "Adgo info QAR",
  "Em cotacao": "Em cotacao",
  "Proposta": "Proposta",
  "Reuniao de fechamento": "Reuniao de fechamento",
  "Assinatura de proposta": "Assinatura de proposta",
  "Pedido permitido": "Pedido permitido",
  "Pedidos 2025": "Pedidos 2025",
  "Pedidos mapeados": "Pedidos mapeados",
};

export default function CriarNegociacaoModal({
  isOpen,
  onClose,
  onNegociacaoCriada,
}: CriarNegociacaoModalProps) {
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [selectedEmpresaID, setSelectedEmpresaID] = useState<number>(0);
  const [selectedContatoID, setSelectedContatoID] = useState<number>(0);

  const [nomeNegociacao, setNomeNegociacao] = useState<string>("");
  // Inicializa funilVendas com "GS" como padrão
  const [funilVendas, setFunilVendas] = useState<string>("GS");
  // Alterado para receber o valor do select
  const [etapaFunilVendas, setEtapaFunilVendas] = useState<string>("");
  const [fonte, setFonte] = useState<string>("");
  const [campanha, setCampanha] = useState<string>("");
  const [seguradoraAtual, setSeguradoraAtual] = useState<string>("");
  const [dataVencimentoApolice, setDataVencimentoApolice] =
    useState<string>("");

  // Busca empresas e contatos ao montar o componente
  useEffect(() => {
    fetch("http://localhost:8080/api/empresas")
      .then((res) => res.json())
      .then((data: Empresa[]) => setEmpresas(data))
      .catch((error) => console.error("Erro ao buscar empresas: ", error));

    fetch("http://localhost:8080/api/contatos")
      .then((res) => res.json())
      .then((data: Contato[]) => setContatos(data))
      .catch((error) => console.error("Erro ao buscar contatos: ", error));
  }, []);

  const formatDateTime = (value: string) => {
    // Se o valor for "2025-08-02T14:30", retorna "2025-08-02T14:30:00Z"
    return value ? `${value}:00Z` : "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload: NegociacaoPayload = {
      empresa_id: selectedEmpresaID,
      contato_id: selectedContatoID,
      nome_negociacao: nomeNegociacao,
      funil_vendas: funilVendas,
      etapa_funil_vendas: etapaFunilVendas,
      fonte: fonte,
      campanha: campanha,
      seguradora_atual: seguradoraAtual,
      data_vencimento_apolice: formatDateTime(dataVencimentoApolice),
    };

    try {
      const res = await fetch("http://localhost:8080/api/negociacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const negociacao = await res.json();
        if (onNegociacaoCriada) {
          onNegociacaoCriada(negociacao);
        }
        onClose();
      } else {
        console.error("Erro ao criar negociação", res.statusText);
      }
    } catch (error) {
      console.error("Erro na requisição: ", error);
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
          <div className="h-full w-80 overflow-y-auto text-xs slide-in bg-white bg-opacity-80 backdrop-blur-sm">
            <div className="p-2">
              <h2 className="text-base font-bold mb-2">Criar Negociação</h2>
              <form onSubmit={handleSubmit}>
                {/* Select de Empresa */}
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
                {/* Select de Contato */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Contato</label>
                  <select
                    className="w-full p-1 border rounded text-xs"
                    value={selectedContatoID}
                    onChange={(e) =>
                      setSelectedContatoID(Number(e.target.value))
                    }
                    required
                  >
                    <option value={0}>Selecione um contato</option>
                    {contatos.map((contato) => (
                      <option key={contato.id} value={contato.id}>
                        {contato.nome}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Nome da Negociação */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Nome da Negociação
                  </label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={nomeNegociacao}
                    onChange={(e) => setNomeNegociacao(e.target.value)}
                    required
                  />
                </div>
                {/* Funil Vendas com valor padrão "GS" */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Funil Vendas</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={funilVendas}
                    onChange={(e) => setFunilVendas(e.target.value)}
                    required
                  />
                </div>
                {/* Etapa Funil Vendas como select */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Etapa Funil Vendas
                  </label>
                  <select
                    className="w-full p-1 border rounded text-xs"
                    value={etapaFunilVendas}
                    onChange={(e) => setEtapaFunilVendas(e.target.value)}
                    required
                  >
                    <option value="">Selecione uma etapa</option>
                    {Object.entries(etapasOptions).map(([key, label]) => (
                      <option key={key} value={key}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Fonte */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Fonte</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={fonte}
                    onChange={(e) => setFonte(e.target.value)}
                    required
                  />
                </div>
                {/* Campanha */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">Campanha</label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={campanha}
                    onChange={(e) => setCampanha(e.target.value)}
                    required
                  />
                </div>
                {/* Seguradora Atual */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Seguradora Atual
                  </label>
                  <input
                    type="text"
                    className="w-full p-1 border rounded text-xs"
                    value={seguradoraAtual}
                    onChange={(e) => setSeguradoraAtual(e.target.value)}
                    required
                  />
                </div>
                {/* Data Vencimento Apólice */}
                <div className="mb-2">
                  <label className="block mb-1 font-medium">
                    Data de Vencimento da Apólice
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full p-1 border rounded text-xs"
                    value={dataVencimentoApolice}
                    onChange={(e) =>
                      setDataVencimentoApolice(e.target.value)
                    }
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
                    Criar Negociação
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
