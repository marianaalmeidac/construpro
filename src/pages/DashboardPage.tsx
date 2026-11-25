import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';
import {
  contarItensSolicitados,
  contarObrasComSolicitacoes,
  contarSolicitacoesUltimos30Dias,
  lerSolicitacoes,
  nomeObra,
  ordenarSolicitacoesRecentes,
  type ResultadoSolicitacoes,
  type SolicitacaoCompra,
} from '../data/solicitacoes';

const fonte = "'Inter', 'Segoe UI', Roboto, sans-serif";
const corTitulo = '#1e1b4b';

function Icone({ children, cor }: { children: React.ReactNode; cor: string }) {
  return (
    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cor, flexShrink: 0 }}>
      {children}
    </Box>
  );
}

function formatarData(data: string): string {
  const valor = new Date(`${data}T00:00:00`);
  return Number.isNaN(valor.getTime())
    ? data
    : new Intl.DateTimeFormat('pt-BR').format(valor);
}

function estadoTexto(resultado: ResultadoSolicitacoes): string {
  return resultado.status === 'invalid' || resultado.status === 'error'
    ? resultado.message
    : 'Nenhuma solicitação registrada ainda.';
}

function CartaoIndicador({
  titulo,
  valor,
  corFundo,
  corIcone,
  icone,
  carregando,
}: {
  titulo: string;
  valor: number | null;
  corFundo: string;
  corIcone: string;
  icone: React.ReactNode;
  carregando: boolean;
}) {
  return (
    <Card sx={{ minWidth: 180, flex: 1, bgcolor: corFundo, borderRadius: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <Icone cor={corIcone}>{icone}</Icone>
          <Typography variant="subtitle2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 500, color: '#374151' }}>{titulo}</Typography>
        </Box>
        {carregando ? <CircularProgress size={28} sx={{ color: corTitulo, my: 0.5 }} /> : (
          <Typography variant="h4" sx={{ fontFamily: fonte, fontSize: 32, fontWeight: 700, color: corTitulo }}>
            {valor === null ? '—' : valor}
          </Typography>
        )}
        <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, color: '#6b7280', display: 'block', mt: 0.5 }}>
          {carregando ? 'Carregando dados…' : valor === null ? 'Dados indisponíveis' : 'Com base nas solicitações registradas'}
        </Typography>
      </CardContent>
    </Card>
  );
}

function EstadoVazio({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ py: 4, px: 2, textAlign: 'center', bgcolor: '#fafafa', borderRadius: 2, border: '1px dashed #d1d5db' }}>
      <Typography variant="body2" sx={{ color: '#6b7280' }}>{children}</Typography>
    </Box>
  );
}

function SolicitacoesRecentes({
  solicitacoes,
  resultado,
}: {
  solicitacoes: SolicitacaoCompra[];
  resultado: ResultadoSolicitacoes;
}) {
  if (resultado.status === 'loading') return <EstadoVazio>Carregando solicitações…</EstadoVazio>;
  if (resultado.status !== 'success') return <EstadoVazio>{estadoTexto(resultado)}</EstadoVazio>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {solicitacoes.slice(0, 5).map((solicitacao) => (
        <Box key={solicitacao.id} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap', p: 2, border: '1px solid #e5e7eb', borderRadius: 2 }}>
          <Box sx={{ minWidth: 150, flex: 1 }}>
            <Typography sx={{ fontWeight: 600, color: corTitulo }}>{solicitacao.solicitante || 'Solicitante não informado'}</Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>{nomeObra(solicitacao.obra)} · {formatarData(solicitacao.data)}</Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Box sx={{ px: 1.25, py: 0.5, bgcolor: '#f3f4f6', color: '#374151', borderRadius: 5, fontSize: 12, textTransform: 'capitalize' }}>
              Prioridade: {solicitacao.prioridade}
            </Box>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>{solicitacao.itens.length} {solicitacao.itens.length === 1 ? 'item' : 'itens'}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

// O catálogo poderá fornecer os produtos consultados por integração, sem criar
// um segundo histórico de visualizações dentro do Dashboard.
function ProdutosConsultados({ produtos = [] }: { produtos?: React.ReactNode[] }) {
  return produtos.length > 0
    ? <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 2 }}>{produtos}</Box>
    : <EstadoVazio>Os produtos consultados aparecerão aqui quando o Catálogo disponibilizar esse histórico.</EstadoVazio>;
}

function DashboardPage() {
  const [resultado, setResultado] = useState<ResultadoSolicitacoes>({ status: 'loading' });

  useEffect(() => {
    setResultado(lerSolicitacoes());
  }, []);

  const carregando = resultado.status === 'loading';
  const dadosDisponiveis = resultado.status === 'success' || resultado.status === 'empty';
  const solicitacoes = resultado.status === 'success' ? ordenarSolicitacoesRecentes(resultado.solicitacoes) : [];
  const listaParaCalculo = resultado.status === 'success' ? resultado.solicitacoes : [];

  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f7', fontFamily: fonte, minHeight: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: fonte, fontWeight: 700, fontSize: 28, color: corTitulo }}>Visão geral</Typography>
          <Typography variant="body2" sx={{ fontFamily: fonte, fontSize: 14, color: '#6b7280', mt: 0.5 }}>Resumo das solicitações de compra registradas.</Typography>
        </Box>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, px: 2, py: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: '#6b7280' }}>EMPRESA ATIVA</Typography>
          <Typography variant="body2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 600, color: corTitulo }}>Informação não disponível</Typography>
        </Box>
      </Box>

      {resultado.status === 'invalid' || resultado.status === 'error' ? (
        <Box role="alert" sx={{ mb: 2, p: 1.5, bgcolor: '#fef2f2', color: '#b91c1c', borderRadius: 2 }}>{resultado.message}</Box>
      ) : null}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
        <CartaoIndicador titulo="Total de solicitações" valor={dadosDisponiveis ? listaParaCalculo.length : null} corFundo="#ede9fe" corIcone="#7c3aed" carregando={carregando} icone={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></svg>} />
        <CartaoIndicador titulo="Itens solicitados" valor={dadosDisponiveis ? contarItensSolicitados(listaParaCalculo) : null} corFundo="#fef3c7" corIcone="#d97706" carregando={carregando} icone={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>} />
        <CartaoIndicador titulo="Obras com solicitações" valor={dadosDisponiveis ? contarObrasComSolicitacoes(listaParaCalculo) : null} corFundo="#dcfce7" corIcone="#16a34a" carregando={carregando} icone={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21V8l9-5 9 5v13" /><path d="M9 21v-8h6v8M3 12h4m10 0h4" /></svg>} />
        <CartaoIndicador titulo="Últimos 30 dias" valor={dadosDisponiveis ? contarSolicitacoesUltimos30Dias(listaParaCalculo) : null} corFundo="#ede9fe" corIcone="#7c3aed" carregando={carregando} icone={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>} />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.4fr) minmax(280px, 0.9fr)' }, gap: 2, mt: 3 }}>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, color: corTitulo, mb: 2 }}>Solicitações recentes</Typography>
            <SolicitacoesRecentes solicitacoes={solicitacoes} resultado={resultado} />
          </CardContent>
        </Card>
        <Card sx={{ borderRadius: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, color: corTitulo, mb: 2 }}>Produtos consultados</Typography>
            <ProdutosConsultados />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DashboardPage;
