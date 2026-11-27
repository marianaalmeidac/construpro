export const CHAVE_SOLICITACOES = 'construpro:solicitacoes';

export interface ItemSolicitacao {
  material: string;
  descricao: string;
  quantidade: string;
  unidade: string;
  observacao: string;
}

export interface SolicitacaoCompra {
  id: string;
  solicitante: string;
  obra: string;
  prioridade: string;
  data: string;
  observacoes: string;
  itens: ItemSolicitacao[];
}

export type ResultadoSolicitacoes =
  | { status: 'loading' }
  | { status: 'success'; solicitacoes: SolicitacaoCompra[] }
  | { status: 'empty'; solicitacoes: [] }
  | { status: 'invalid'; message: string }
  | { status: 'error'; message: string };

function ehRegistro(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function itemValido(value: unknown): value is ItemSolicitacao {
  if (!ehRegistro(value)) return false;
  return ['material', 'descricao', 'quantidade', 'unidade', 'observacao']
    .every((campo) => typeof value[campo] === 'string');
}

function solicitacaoValida(value: unknown): value is SolicitacaoCompra {
  if (!ehRegistro(value)) return false;
  return typeof value.id === 'string'
    && typeof value.solicitante === 'string'
    && typeof value.obra === 'string'
    && typeof value.prioridade === 'string'
    && typeof value.data === 'string'
    && typeof value.observacoes === 'string'
    && Array.isArray(value.itens)
    && value.itens.every(itemValido);
}

export function lerSolicitacoes(storage?: Storage): ResultadoSolicitacoes {
  let conteudo: string | null;
  try {
    conteudo = (storage ?? window.localStorage).getItem(CHAVE_SOLICITACOES);
  } catch {
    return { status: 'error', message: 'Não foi possível ler as solicitações deste navegador.' };
  }
  if (conteudo === null) return { status: 'empty', solicitacoes: [] };

  let dados: unknown;
  try {
    dados = JSON.parse(conteudo);
  } catch {
    return { status: 'invalid', message: 'Os dados de solicitações armazenados estão em formato inválido.' };
  }
  if (!Array.isArray(dados) || !dados.every(solicitacaoValida)) {
    return { status: 'invalid', message: 'Os dados de solicitações armazenados estão em formato inválido.' };
  }
  if (dados.length === 0) return { status: 'empty', solicitacoes: [] };
  return { status: 'success', solicitacoes: dados };
}

export function contarItensSolicitados(solicitacoes: SolicitacaoCompra[]): number {
  return solicitacoes.reduce((total, solicitacao) => total + solicitacao.itens.length, 0);
}

export function contarObrasComSolicitacoes(solicitacoes: SolicitacaoCompra[]): number {
  return new Set(solicitacoes.map(({ obra }) => obra.trim()).filter(Boolean)).size;
}

export function contarSolicitacoesUltimos30Dias(
  solicitacoes: SolicitacaoCompra[],
  agora = new Date(),
): number {
  const limite = new Date(agora);
  limite.setDate(limite.getDate() - 29);
  limite.setHours(0, 0, 0, 0);
  const hoje = new Date(agora);
  hoje.setHours(23, 59, 59, 999);

  return solicitacoes.filter(({ data }) => {
    const dataSolicitacao = new Date(`${data}T00:00:00`);
    return !Number.isNaN(dataSolicitacao.getTime())
      && dataSolicitacao >= limite
      && dataSolicitacao <= hoje;
  }).length;
}

export function ordenarSolicitacoesRecentes(solicitacoes: SolicitacaoCompra[]): SolicitacaoCompra[] {
  return [...solicitacoes].sort((a, b) => b.data.localeCompare(a.data));
}

export function nomeObra(obra: string): string {
  const nomes: Record<string, string> = {
    'obra-1': 'Obra 1',
    'obra-2': 'Obra 2',
    'obra-3': 'Obra 3',
  };
  return nomes[obra] ?? obra;
}
