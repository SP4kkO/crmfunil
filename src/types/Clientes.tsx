// types/Cliente.ts

export interface Empresa {
    id: number;
    nome: string;
    // Adicione outros campos que forem necessários para Empresa
  }
  
  export interface Contato {
    id: number;
    nome: string;
    // Adicione outros campos que forem necessários para Contato
  }
  
  export interface Cliente {
    id: number;
    nome: string;
    cnpj: string;
    endereco: string;
    contato: string;
    empresas: Empresa[];
    contatos: Contato[];
    CreatedAt: string; // ou Date, se preferir converter para objeto Date
    UpdatedAt: string;
    DeletedAt: string | null;
  }
  