export interface Negociacao {
  id: number;
  nome_negociacao: string;
  funil_vendas: string;
  etapa_funil_vendas: string;
  fonte: string;
  campanha: string;
  informacoes_empresa: string;
  informacoes_contato: string;
  seguradora_atual: string;
  data_vencimento_apolice: string; // Pode ser convertido para Date, se necessário
  tarefa: string;
}
