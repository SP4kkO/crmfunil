// types/Empresa.ts

export interface Empresa {
  id: number;
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
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  anotacoes?: unknown[]; // Pode ajustar conforme a necessidade
}
