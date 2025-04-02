// types/Tarefa.ts

import { Empresa } from "./Empresa"; // Certifique-se de ter esse type ou adapte conforme necessário

export interface Tarefa {
  id: number;
  negociacao_id: number;
  empresa_id: number;
  empresa?: Empresa; // Relacionamento opcional com a entidade Empresa
  empresa_negociacao?: string; // Campo opcional para informações da empresa
  negociacao: string; // Campo obrigatório que representa a negociação
  assunto: string; // Campo obrigatório
  descricao?: string; // Campo opcional
  responsavel: string; // Campo obrigatório
  tipo: string; // Campo obrigatório
  data_agendamento: string; // Data em formato ISO ou string, conforme o retorno da API
  horario: string; // Formato "HH:MM"
  concluida: boolean; // Indica se a tarefa está concluída
}
