export interface Contato {
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