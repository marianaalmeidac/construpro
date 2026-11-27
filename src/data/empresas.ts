import type { CondicoesComerciais, Empresa } from '../types/empresa';

export const CONDICOES_PADRAO: CondicoesComerciais = {
  prazoPagamento: '28 dias',
  descontoPadrao: 5,
  prazoEntrega: '3 a 7 dias úteis',
  limiteCredito: 50000,
  freteGratisAcimaDe: 5000,
};

/**
 * Empresas, CNPJs, contatos, condições e usuários FICTÍCIOS (projeto acadêmico).
 * Os CEPs de entrega são reais: a BrasilAPI preenche rua, bairro e cidade.
 */
export const EMPRESAS_INICIAIS: Empresa[] = [
  {
    id: 'horizonte',
    ativa: true,
    dados: {
      razaoSocial: 'Construtora Horizonte Ltda',
      nomeFantasia: 'Construtora Horizonte',
      cnpj: '12345678000190',
      inscricaoEstadual: '123.456.789',
      atividade: 'Construção de edifícios',
      porte: 'Médio porte',
      inicioAtividade: '2012-03-15',
      email: 'compras@horizonte.com.br',
      telefone: '(83) 3200-1000',
      situacao: 'Ativa',
    },
    localEntrega: 'Obra Residencial Bessa',
    cepEntrega: '58037010',
    numeroEntrega: '500',
    condicoes: { prazoPagamento: '28 dias', descontoPadrao: 5, prazoEntrega: '3 a 7 dias úteis', limiteCredito: 150000, freteGratisAcimaDe: 5000 },
    usuarios: [
      { id: 'u1', nome: 'Mariana Almeida', email: 'compras@horizonte.com.br', telefone: '(83) 99999-0000', perfil: 'Administrador' },
      { id: 'u2', nome: 'João Ferreira', email: 'joao@horizonte.com.br', telefone: '(83) 99999-1111', perfil: 'Editor' },
    ],
  },
  {
    id: 'boa-vista',
    ativa: true,
    dados: {
      razaoSocial: 'Engenharia Boa Vista Ltda',
      nomeFantasia: 'Engenharia Boa Vista',
      cnpj: '98765432000110',
      inscricaoEstadual: '987.654.321',
      atividade: 'Obras de engenharia civil',
      porte: 'Grande porte',
      inicioAtividade: '2008-09-01',
      email: 'suprimentos@boavista.com.br',
      telefone: '(61) 3300-2000',
      situacao: 'Ativa',
    },
    localEntrega: 'Canteiro Central',
    cepEntrega: '70040010',
    numeroEntrega: '100',
    condicoes: { prazoPagamento: '30 dias', descontoPadrao: 7, prazoEntrega: '5 a 10 dias úteis', limiteCredito: 250000, freteGratisAcimaDe: 8000 },
    usuarios: [
      { id: 'u3', nome: 'Carlos Menezes', email: 'carlos@boavista.com.br', telefone: '(61) 98888-2222', perfil: 'Administrador' },
    ],
  },
  {
    id: 'obras-projetos',
    ativa: true,
    dados: {
      razaoSocial: 'Obras e Projetos Ltda',
      nomeFantasia: 'Obras e Projetos',
      cnpj: '45678123000155',
      inscricaoEstadual: '456.781.230',
      atividade: 'Reformas e acabamentos',
      porte: 'Pequeno porte',
      inicioAtividade: '2018-06-20',
      email: 'contato@obrasprojetos.com.br',
      telefone: '(21) 3100-3000',
      situacao: 'Ativa',
    },
    localEntrega: 'Obra Centro',
    cepEntrega: '20031170',
    numeroEntrega: '65',
    condicoes: { prazoPagamento: '21 dias', descontoPadrao: 3, prazoEntrega: '2 a 5 dias úteis', limiteCredito: 80000, freteGratisAcimaDe: 3000 },
    usuarios: [
      { id: 'u4', nome: 'Ana Souza', email: 'ana@obrasprojetos.com.br', telefone: '(21) 97777-3333', perfil: 'Visualizador' },
    ],
  },
  {
    id: 'alianca',
    ativa: false,
    dados: {
      razaoSocial: 'Construtora Aliança S.A.',
      nomeFantasia: 'Construtora Aliança',
      cnpj: '11222333000144',
      inscricaoEstadual: '112.223.331',
      atividade: 'Incorporação de empreendimentos',
      porte: 'Grande porte',
      inicioAtividade: '2005-11-10',
      email: 'compras@alianca.com.br',
      telefone: '(83) 3400-4000',
      situacao: 'Ativa',
    },
    localEntrega: 'Galpão Logístico',
    cepEntrega: '58037010',
    numeroEntrega: '1500',
    condicoes: { prazoPagamento: '45 dias', descontoPadrao: 10, prazoEntrega: '7 a 12 dias úteis', limiteCredito: 400000, freteGratisAcimaDe: 10000 },
    usuarios: [],
  },
];