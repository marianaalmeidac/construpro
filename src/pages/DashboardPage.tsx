import { type ReactNode, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import ConstructionOutlinedIcon from '@mui/icons-material/ConstructionOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
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

const indicadores = [
  {
    titulo: 'Solicitações registradas',
    descricao: 'Total de solicitações salvas.',
    icone: AssignmentOutlinedIcon,
    cor: '#6c3de8',
    fundo: '#FFF',
    fundoIcone: '#E9E9EF',
  },
  {
    titulo: 'Itens solicitados',
    descricao: 'Linhas de materiais nas solicitações.',
    icone: Inventory2OutlinedIcon,
    cor: '#6c3de8',
    fundo: '#FFF',
    fundoIcone: '#E9E9EF',
  },
  {
    titulo: 'Obras atendidas',
    descricao: 'Obras com ao menos uma solicitação.',
    icone: ConstructionOutlinedIcon,
    cor: '#6c3de8',
    fundo: '#FFF',
    fundoIcone: '#E9E9EF',
  },
  {
    titulo: 'Nos últimos 30 dias',
    descricao: 'Solicitações dentro dos últimos 30 dias.',
    icone: CalendarMonthOutlinedIcon,
    cor: '#6c3de8',
    fundo: '#FFF',
    fundoIcone: '#E9E9EF',
  },
];

const prioridades = [
  { valor: 'urgente', titulo: 'Urgente', cor: '#D32F2F' },
  { valor: 'alta', titulo: 'Alta', cor: '#F57C00' },
  { valor: 'media', titulo: 'Média', cor: '#F9A825' },
  { valor: 'baixa', titulo: 'Baixa', cor: '#2E7D32' },
];

const acessosRapidos = [
  { titulo: 'Nova solicitação', destino: '/solicitacao-compra', icone: AddShoppingCartOutlinedIcon },
  { titulo: 'Histórico de pedidos', destino: '/historico-pedidos', icone: ReceiptLongOutlinedIcon },
  { titulo: 'Minha Empresa', destino: '/minha-empresa', icone: BusinessOutlinedIcon },
  { titulo: 'Catálogo', destino: '/catalogo', icone: Inventory2OutlinedIcon },
];

function CabecalhoSecao({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao?: string;
  acao?: ReactNode;
}) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1}
      sx={{
        px: { xs: 1.75, sm: 2.5 },
        py: { xs: 1.5, sm: 1.75 },
        justifyContent: 'space-between',
        alignItems: { xs: 'stretch', sm: 'center' },
        bgcolor: 'background.paper',
        borderBottom: '1px solid #e5e7ef',
      }}
    >
      <Box sx={{ pl: 1.5, borderLeft: '3px solid var(--primary)' }}>
        <Typography variant="h6" sx={{ color: '#303245', fontSize: { xs: 17, sm: 19 }, fontWeight: 750, lineHeight: 1.35 }}>
          {titulo}
        </Typography>
        {descricao && (
          <Typography variant="body2" sx={{ mt: 0.35, color: 'text.secondary', fontSize: { xs: 12, sm: 13 } }}>
            {descricao}
          </Typography>
        )}
      </Box>
      {acao}
    </Stack>
  );
}

function formatarData(data: string): string {
  const valor = new Date(`${data}T00:00:00`);
  return Number.isNaN(valor.getTime()) ? data : new Intl.DateTimeFormat('pt-BR').format(valor);
}

function rotuloPrioridade(prioridade: string): string {
  const rotulos: Record<string, string> = {
    baixa: 'Baixa',
    media: 'Média',
    alta: 'Alta',
    urgente: 'Urgente',
  };
  return rotulos[prioridade.toLowerCase()] ?? prioridade;
}

function CartaoIndicadorDashboard({
  titulo,
  descricao,
  valor,
  icone: Icone,
  cor,
  fundo,
  fundoIcone,
}: {
  titulo: string;
  descricao: string;
  valor: number | null;
  icone: typeof AssignmentOutlinedIcon;
  cor: string;
  fundo: string;
  fundoIcone: string;
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        flex: '1 1 220px',
        minWidth: 0,
        height: '100%',
        borderColor: 'rgba(30, 27, 75, 0.08)',
        borderRadius: 3,
        bgcolor: fundo,
        boxShadow: '0 1px 4px rgba(25, 31, 48, 0.035)',
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          minHeight: { xs: 116, sm: 132 },
          p: { xs: 2, sm: 2.5 },
          '&:last-child': { pb: { xs: 2, sm: 2.5 } },
        }}
      >
        <Stack direction="row" spacing={{ xs: 1.5, sm: 2 }} sx={{ width: '100%', alignItems: 'flex-start' }}>
          <Box sx={{ width: { xs: 46, sm: 54 }, height: { xs: 46, sm: 54 }, display: 'grid', placeItems: 'center', flexShrink: 0, alignSelf: 'flex-start', borderRadius: 2, color: cor, bgcolor: fundoIcone }}>
            <Icone sx={{ fontSize: { xs: 25, sm: 28 } }} />
          </Box>
          <Stack spacing={0.25} sx={{ minWidth: 0, alignItems: 'flex-start' }}>
            <Typography variant="subtitle2" sx={{ color: '#34384b', fontSize: { xs: 13, sm: 14 }, fontWeight: 750, lineHeight: 1.35 }}>
              {titulo}
            </Typography>
            <Box sx={{ minHeight: { xs: 38, sm: 42 }, display: 'flex', alignItems: 'center' }}>
              {valor === null ? (
                <CircularProgress size={23} sx={{ color: cor }} />
              ) : (
                <Typography component="p" sx={{ color: '#20243a', fontSize: { xs: 30, sm: 35 }, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.055em' }}>
                  {valor}
                </Typography>
              )}
            </Box>
            <Typography variant="body2" sx={{ color: '#55596b', fontSize: { xs: 11, sm: 12 }, lineHeight: 1.4 }}>
              {descricao}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CartaoSolicitacao({ solicitacao }: { solicitacao: SolicitacaoCompra }) {
  const nomesItens = solicitacao.itens.slice(0, 2).map(({ material }) => material).filter(Boolean);
  const itensRestantes = solicitacao.itens.length - nomesItens.length;
  const cor = prioridades.find(({ valor }) => valor === solicitacao.prioridade.toLowerCase())?.cor;

  return (
    <Box sx={{ px: { xs: 1.75, sm: 2.5 }, py: { xs: 1.75, sm: 2 }, borderBottom: 1, borderColor: 'divider', '&:last-child': { borderBottom: 0 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1.25, sm: 1.5 }}
        sx={{ alignItems: { xs: 'stretch', sm: 'center' }, justifyContent: 'space-between' }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontWeight: 650, fontSize: { xs: 14, sm: 15 } }}>{solicitacao.solicitante || 'Solicitante não informado'}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35, fontSize: { xs: 12, sm: 14 } }}>
            {nomeObra(solicitacao.obra)} <Box component="span" sx={{ mx: 0.5 }}>·</Box> {formatarData(solicitacao.data)}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.65, fontSize: { xs: 12, sm: 14 }, overflowWrap: 'anywhere' }}>
            {nomesItens.length ? nomesItens.join(', ') : `${solicitacao.itens.length} ${solicitacao.itens.length === 1 ? 'item' : 'itens'}`}
            {itensRestantes > 0 ? ` e mais ${itensRestantes}` : ''}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Stack direction="row" spacing={0.75} sx={{ alignItems: 'center' }}>
            <Box component="span" aria-hidden="true" sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: cor ?? 'text.disabled' }} />
            <Typography variant="body2" sx={{ color: cor ?? 'text.secondary', fontWeight: 600 }}>
              {rotuloPrioridade(solicitacao.prioridade)}
            </Typography>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            {solicitacao.itens.length} {solicitacao.itens.length === 1 ? 'item' : 'itens'}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}

function EstadoLista({ resultado }: { resultado: ResultadoSolicitacoes }) {
  if (resultado.status === 'loading') {
    return <Stack sx={{ py: 5, alignItems: 'center' }}><CircularProgress size={28} /></Stack>;
  }
  if (resultado.status === 'invalid' || resultado.status === 'error') {
    return <Alert severity="error" sx={{ m: 2 }}>{resultado.message}</Alert>;
  }
  return (
    <Box sx={{ px: 3, py: 5, textAlign: 'center' }}>
      <Typography sx={{ fontWeight: 650 }}>Nenhuma solicitação registrada</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 2, fontSize: { xs: 13, sm: 14 } }}>
        As solicitações salvas aparecerão aqui.
      </Typography>
      <Button
        component={Link}
        to="/solicitacao-compra"
        variant="outlined"
        size="small"
        startIcon={<AddShoppingCartOutlinedIcon />}
        sx={{ minHeight: 40, color: '#673DE6', borderColor: '#673DE6', '&:hover': { borderColor: '#512BC4', bgcolor: '#f5f1ff' } }}
      >
        Criar solicitação
      </Button>
    </Box>
  );
}

function CartaoPrioridades({
  resultado,
  solicitacoes,
}: {
  resultado: ResultadoSolicitacoes;
  solicitacoes: SolicitacaoCompra[];
}) {
  if (resultado.status === 'loading') {
    return <Stack sx={{ py: 4, alignItems: 'center' }}><CircularProgress size={26} /></Stack>;
  }
  if (resultado.status === 'invalid' || resultado.status === 'error') {
    return <Alert severity="error">{resultado.message}</Alert>;
  }

  const total = solicitacoes.length;
  return (
    <Stack spacing={{ xs: 1.75, sm: 2.25 }}>
      {prioridades.map(({ valor, titulo, cor }) => {
        const quantidade = solicitacoes.filter(
          (solicitacao) => solicitacao.prioridade.toLowerCase() === valor,
        ).length;
        const percentual = total > 0 ? (quantidade / total) * 100 : 0;

        return (
          <Box key={valor}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', mb: 0.75 }}>
              <Typography variant="body2" sx={{ fontWeight: 550 }}>{titulo}</Typography>
              <Typography variant="body2" color="text.secondary">{quantidade}</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={percentual}
              aria-label={`${quantidade} solicitações com prioridade ${titulo.toLowerCase()}`}
              sx={{ height: { xs: 8, sm: 7 }, borderRadius: 99, bgcolor: '#eef0f4', '& .MuiLinearProgress-bar': { bgcolor: cor, borderRadius: 99 } }}
            />
          </Box>
        );
      })}
    </Stack>
  );
}

function CartaoAcessosRapidos() {
  return (
    <List disablePadding>
      {acessosRapidos.map(({ titulo, destino, icone: Icone }) => (
        <ListItemButton
          key={destino}
          component={Link}
          to={destino}
          sx={{
            minHeight: { xs: 46, sm: 48 },
            px: { xs: 1, sm: 1.25 },
            borderRadius: 1.5,
            color: 'text.primary',
            '&:hover, &.Mui-focusVisible': { bgcolor: '#f5f1ff' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 38, color: '#673DE6' }}><Icone fontSize="small" /></ListItemIcon>
          <ListItemText primary={<Typography variant="body2" sx={{ fontWeight: 600 }}>{titulo}</Typography>} />
          <ArrowForwardOutlinedIcon sx={{ fontSize: 17, color: 'text.disabled' }} />
        </ListItemButton>
      ))}
    </List>
  );
}

function DashboardPage() {
  const [resultado, setResultado] = useState<ResultadoSolicitacoes>({ status: 'loading' });
  const atualizar = useCallback(() => setResultado(lerSolicitacoes()), []);

  useEffect(() => {
    atualizar();
    window.addEventListener('focus', atualizar);
    window.addEventListener('storage', atualizar);
    return () => {
      window.removeEventListener('focus', atualizar);
      window.removeEventListener('storage', atualizar);
    };
  }, [atualizar]);

  const disponivel = resultado.status === 'success' || resultado.status === 'empty';
  const solicitacoes = resultado.status === 'success' ? resultado.solicitacoes : [];
  const recentes = ordenarSolicitacoesRecentes(solicitacoes).slice(0, 5);
  const valores = [
    disponivel ? solicitacoes.length : null,
    disponivel ? contarItensSolicitados(solicitacoes) : null,
    disponivel ? contarObrasComSolicitacoes(solicitacoes) : null,
    disponivel ? contarSolicitacoesUltimos30Dias(solicitacoes) : null,
  ];

  return (
    <Box sx={{ p: { xs: 1.25, sm: 2, md: 4 }, pb: { xs: 3, sm: 5 } }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: { xs: 2.5, sm: 3.5 }, justifyContent: 'space-between', alignItems: { xs: 'stretch', sm: 'center' } }}
      >
        <Box>
          <Typography component="h1" variant="h4" sx={{ fontSize: { xs: 27, sm: 34 }, fontWeight: 750, letterSpacing: '-0.04em', lineHeight: 1.15 }}>
            Visão geral
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, fontSize: { xs: 13, sm: 16 }, lineHeight: 1.5 }}>
            Olá! Acompanhe aqui as solicitações de compra registradas.
          </Typography>
        </Box>
        <Button
          component={Link}
          to="/solicitacao-compra"
          variant="contained"
          startIcon={<AddShoppingCartOutlinedIcon />}
          sx={{
            minHeight: 44,
            fontWeight: 700,
            alignSelf: { xs: 'stretch', sm: 'auto' },
            bgcolor: '#673DE6',
            '&:hover': { bgcolor: '#512BC4' },
          }}
        >
          Nova solicitação
        </Button>
      </Stack>

      {(resultado.status === 'invalid' || resultado.status === 'error') && (
        <Alert severity="error" sx={{ mb: 2 }}>{resultado.message}</Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: { xs: 1.25, sm: 2 } }}>
        {indicadores.map((indicador, indice) => (
          <CartaoIndicadorDashboard key={indicador.titulo} {...indicador} valor={valores[indice]} />
        ))}
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'minmax(0, 1fr)', lg: 'minmax(0, 1.65fr) minmax(280px, 0.85fr)' }, gap: { xs: 1.75, sm: 2.5 }, mt: { xs: 2, sm: 3 } }}>
        <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', alignSelf: 'start', bgcolor: 'background.paper', boxShadow: '0 1px 4px rgba(25, 31, 48, 0.035)' }}>
          <CabecalhoSecao
            titulo="Solicitações recentes"
            descricao="Até cinco registros mais recentes."
            acao={(
              <Button
                component={Link}
                to="/historico-pedidos"
                size="small"
                endIcon={<ArrowForwardOutlinedIcon />}
                sx={{
                  alignSelf: { xs: 'flex-start', sm: 'auto' },
                  minHeight: 40,
                  color: '#673DE6',
                  '&:hover': { bgcolor: '#f5f1ff' },
                }}
              >
                Ver histórico
              </Button>
            )}
          />
          <Box>
            {resultado.status === 'success' && recentes.length > 0
              ? recentes.map((solicitacao) => <CartaoSolicitacao key={solicitacao.id} solicitacao={solicitacao} />)
              : <EstadoLista resultado={resultado} />}
          </Box>
        </Card>

        <Stack spacing={{ xs: 1.75, sm: 2.5 }}>
          <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: '0 1px 4px rgba(25, 31, 48, 0.035)' }}>
            <CabecalhoSecao titulo="Solicitações por prioridade" descricao="Distribuição dos registros salvos." />
            <CardContent sx={{ p: { xs: 1.75, sm: 2.5 }, '&:last-child': { pb: { xs: 1.75, sm: 2.5 } } }}>
              <CartaoPrioridades resultado={resultado} solicitacoes={solicitacoes} />
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden', bgcolor: 'background.paper', boxShadow: '0 1px 4px rgba(25, 31, 48, 0.035)' }}>
            <CabecalhoSecao titulo="Acessos rápidos" />
            <CardContent sx={{ p: { xs: 1.25, sm: 1.5 }, '&:last-child': { pb: { xs: 1.25, sm: 1.5 } } }}>
              <CartaoAcessosRapidos />
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </Box>
  );
}

export default DashboardPage;
