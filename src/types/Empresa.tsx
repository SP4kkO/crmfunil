// types/Empresa.ts

export interface Empresa {
    id: number;              // Chave primária
    nome: string;            // Nome da empresa
    cnpj?: string;           // CNPJ, opcional
    telefone?: string;       // Telefone de contato, opcional
    endereco?: string;       // Endereço, opcional
    email?: string;          // Email, opcional
  }
  