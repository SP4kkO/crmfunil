// types/Negociacao.ts
import { Empresa } from "./Empresa";

// Defina o type para Contato, conforme os dados que sua aplicação utiliza
export interface Contato {
  id: number;
  nome: string;
  // Adicione outros campos que forem necessários
}

export interface Negociacao {
  id: number;
  empresa_id: number;
  // Os dados completos da empresa podem ser retornados opcionalmente
  empresa?: Empresa;
  contato_id: number;
  // Os dados completos do contato também podem ser retornados opcionalmente
  contato?: Contato;
  nome_negociacao: string;
  funil_vendas: string;
  etapa_funil_vendas: string;
  fonte: string;
  campanha: string;
  seguradora_atual: string;
  // Converter o time.Time para string (normalmente no formato ISO)
  data_vencimento_apolice: string;
  tarefa: string;
  // Campos de controle de data (geralmente retornados como strings em ISO)
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
