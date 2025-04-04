// types/Empresa.ts

export interface Empresa {
  id: number;                    // Chave primária
  nome: string;                  // Nome da empresa
  cnpj?: string;                 // CNPJ (cnpj_matriz), opcional
  telefone?: string;            // Telefone (telefone_matriz), opcional
  endereco?: string;            // Endereço formatado (ex: cidade + estado + cep), opcional
  email?: string;               // Email de contato, opcional (não veio no JSON, mas previsto)
  segmento?: string;            // Segmento de atuação
  url?: string;                 // Website da empresa
  resumo?: string;              // Breve descrição
  tamanho_empresa?: string;     // Tamanho da empresa (pequeno, médio, grande)
  faixa_faturamento?: string;   // Faixa de faturamento
  razao_social?: string;        // Razão social
  cep?: string;                 // CEP
  cidade?: string;              // Cidade
  estado?: string;              // Estado
  cliente_da_base?: boolean;    // Se é cliente da base
  linkedin_empresa?: string;    // URL do perfil no LinkedIn
  grupo?: string;               // Nome do grupo empresarial
  cliente_id?: number;          // ID do cliente associado
  CreatedAt?: string;           // Data de criação
  UpdatedAt?: string;           // Data de atualização
  DeletedAt?: string | null;    // Data de exclusão (soft delete)
}
