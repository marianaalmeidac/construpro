export type PerfilUsuario = 'Administrador' | 'Editor' | 'Visualizador';

export interface UsuarioEmpresa {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  perfil: PerfilUsuario;
}

export interface CondicoesComerciais {
  prazoPagamento: string;
  descontoPadrao: number; // em %
  prazoEntrega: string;
  limiteCredito: number;
  freteGratisAcimaDe: number;
}

/** Dados cadastrais guardados no portal (razão social e CNPJ não são editáveis). */
export interface DadosCadastrais {
  razaoSocial: string;
  nomeFantasia: string;
  cnpj: string; // somente dígitos
  inscricaoEstadual: string;
  atividade: string;
  porte: string;
  inicioAtividade: string; // AAAA-MM-DD
  email: string;
  telefone: string;
  situacao: string;
}

/** Empresa cadastrada no portal. */
export interface Empresa {
  id: string;
  ativa: boolean;
  dados: DadosCadastrais;
  localEntrega: string;
  cepEntrega: string; // somente dígitos
  numeroEntrega: string;
  complementoEntrega?: string;
  condicoes: CondicoesComerciais;
  usuarios: UsuarioEmpresa[];
}

/** Resposta de GET /cnpj/v1/{cnpj} (campos que usamos). */
export interface CnpjData {
  cnpj: string;
  razao_social: string;
  nome_fantasia: string | null;
  descricao_situacao_cadastral: string | null;
  data_inicio_atividade: string | null;
  cnae_fiscal_descricao: string | null;
  natureza_juridica: string | null;
  porte: string | null;
  capital_social: number | null;
  ddd_telefone_1: string | null;
  email: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  municipio: string | null;
  uf: string | null;
  cep: string | null;
}

/** Resposta de GET /cep/v2/{cep}. */
export interface CepData {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
}

export interface EnderecoEntrega {
  local: string;
  cep: string;
  rua: string;
  bairro: string;
  cidade: string;
  uf: string;
  numero: string;
  complemento: string;
}