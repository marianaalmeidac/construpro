import { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';

const corRoxa = '#673DE6';
const botaoPrincipal = {
  backgroundColor: corRoxa,
  '&:hover': { backgroundColor: '#512BC4' },
};
const botaoSecundario = { color: corRoxa, borderColor: corRoxa };

type ItemCompra = {
  material: string;
  quantidade: string;
  unidade: string;
  descricao?: string;
  observacao?: string;
};

type StatusPedido = keyof typeof coresStatus;

type Solicitacao = {
  id: string;
  data: string;
  solicitante: string;
  obra: string;
  prioridade: string;
  observacoes?: string;
  itens: ItemCompra[];
  status?: StatusPedido;
};

type Pedido = Solicitacao & {
  numero: string;
  status: StatusPedido;
};

function temCamposTexto(valor: unknown, campos: string[]): boolean {
  if (typeof valor !== 'object' || valor === null) return false;

  const registro = valor as Record<string, unknown>;
  return campos.every((campo) => typeof registro[campo] === 'string');
}

function solicitacaoValida(valor: unknown): valor is Solicitacao {
  if (!temCamposTexto(valor, ['id', 'data', 'solicitante', 'obra', 'prioridade'])) {
    return false;
  }

  const { itens, status } = valor as { itens?: unknown; status?: unknown };
  if (status !== undefined &&
    !Object.keys(coresStatus).some((opcao) => opcao === status)) {
    return false;
  }

  return Array.isArray(itens) &&
    itens.every((item: unknown) => temCamposTexto(item, ['material', 'quantidade', 'unidade']));
}

const chaveSolicitacoes = 'construpro:solicitacoes';

function lerSolicitacoes(): Solicitacao[] {
  const dados: unknown = JSON.parse(localStorage.getItem(chaveSolicitacoes) ?? '[]');
  if (!Array.isArray(dados) || !dados.every(solicitacaoValida)) {
    throw new Error('Solicitações inválidas');
  }

  return dados;
}

function montarPedidos(solicitacoes: Solicitacao[]): Pedido[] {
  return solicitacoes.map((solicitacao, indice) => ({
    ...solicitacao,
    numero: 'PED-' + String(indice + 1).padStart(3, '0'),
    status: solicitacao.status ?? 'Pendente',
  }));
}

function lerPedidos(): { pedidos: Pedido[]; erro: boolean } {
  try {
    return { pedidos: montarPedidos(lerSolicitacoes()), erro: false };
  } catch {
    return { pedidos: [], erro: true };
  }
}

const coresStatus = {
  Pendente: 'warning',
  Aprovado: 'success',
  Cancelado: 'error',
} as const;

function formatarData(data: string) {
  return data.split('-').reverse().join('/');
}

const nomesObras: Record<string, string> = {
  'obra-1': 'Obra 1',
  'obra-2': 'Obra 2',
  'obra-3': 'Obra 3',
};

const nomesPrioridades: Record<string, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};

function HistoricoPedidosPage() {
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');
  const [busca, setBusca] = useState('');
  const [idSelecionado, setIdSelecionado] = useState<string | null>(null);
  const [{ pedidos, erro }, setHistorico] = useState(lerPedidos);
  const [erroStatus, setErroStatus] = useState(false);

  const pedidoSelecionado = pedidos.find((pedido) => pedido.id === idSelecionado);
  const buscaNormalizada = busca.trim().toLowerCase();
  const pedidosVisiveis = pedidos.filter((pedido) => {
    const correspondeAoStatus =
      statusSelecionado === 'Todos' || pedido.status === statusSelecionado;
    const correspondeABusca = pedido.numero.toLowerCase().includes(buscaNormalizada);

    return correspondeAoStatus && correspondeABusca;
  });

  function fecharDetalhes() {
    setIdSelecionado(null);
    setErroStatus(false);
  }

  function atualizarStatus(pedido: Pedido, status: 'Aprovado' | 'Cancelado') {
    const acao = status === 'Aprovado' ? 'Aprovar' : 'Cancelar';
    if (!window.confirm(acao + ' o pedido ' + pedido.numero + '?')) return;

    try {
      const solicitacoes = lerSolicitacoes();
      if (!solicitacoes.some((solicitacao) => solicitacao.id === pedido.id)) {
        throw new Error('Solicitação não encontrada');
      }

      const atualizadas = solicitacoes.map((solicitacao): Solicitacao =>
        solicitacao.id === pedido.id ? { ...solicitacao, status } : solicitacao,
      );

      localStorage.setItem(chaveSolicitacoes, JSON.stringify(atualizadas));
      setHistorico({ pedidos: montarPedidos(atualizadas), erro: false });
      setErroStatus(false);
    } catch {
      setErroStatus(true);
    }
  }

  return (
    <Box component="section" sx={{ p: { xs: 2, md: 4 } }}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        Histórico de pedidos
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Consulte suas solicitações anteriores.
      </Typography>

      {erro && (
        <Alert severity="error">Não foi possível ler as solicitações salvas neste navegador.</Alert>
      )}

      <Box className="filtro-status" sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 1, my: 2 }}>
        <TextField
          id="busca-pedidos"
          label="Buscar por número do pedido"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
          size="small"
        />
        <TextField
          id="filtro-status"
          select
          label="Filtrar por status"
          value={statusSelecionado}
          onChange={(evento) => setStatusSelecionado(evento.target.value)}
          size="small"
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="Todos">Todos</MenuItem>
          {Object.keys(coresStatus).map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table
          className="tabela-pedidos"
          size="small"
          aria-label="Histórico de pedidos"
          sx={{ '& th, & td': { p: 1.5, borderBottomColor: 'divider' } }}
        >
          <TableHead>
            <TableRow>
              <TableCell scope="col">Pedido</TableCell>
              <TableCell scope="col">Data</TableCell>
              <TableCell scope="col">Status</TableCell>
              <TableCell scope="col">Ações</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!erro && pedidosVisiveis.length === 0 && (
              <TableRow>
                <TableCell colSpan={4}>
                  {pedidos.length === 0 ? 'Nenhuma solicitação salva.' : 'Nenhum pedido encontrado.'}
                </TableCell>
              </TableRow>
            )}

            {pedidosVisiveis.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.numero}</TableCell>
                <TableCell>{formatarData(pedido.data)}</TableCell>
                <TableCell>
                  <Chip
                    label={pedido.status}
                    color={coresStatus[pedido.status]}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    variant="outlined"
                    sx={botaoSecundario}
                    onClick={() => setIdSelecionado(pedido.id)}
                  >
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={Boolean(pedidoSelecionado)}
        onClose={fecharDetalhes}
        aria-labelledby="titulo-detalhes"
        fullWidth
        maxWidth="sm"
      >
        {pedidoSelecionado && (
          <>
            <DialogTitle id="titulo-detalhes">Pedido {pedidoSelecionado.numero}</DialogTitle>
            <DialogContent dividers>
              {erroStatus && <Alert severity="error">Não foi possível atualizar o status do pedido.</Alert>}
              <p>Solicitante: {pedidoSelecionado.solicitante}</p>
              <p>Obra: {nomesObras[pedidoSelecionado.obra] ?? pedidoSelecionado.obra}</p>
              <p>Data: {formatarData(pedidoSelecionado.data)}</p>
              <p>Prioridade: {nomesPrioridades[pedidoSelecionado.prioridade] ?? pedidoSelecionado.prioridade}</p>
              <p>Status: {pedidoSelecionado.status}</p>
              {typeof pedidoSelecionado.observacoes === 'string' && pedidoSelecionado.observacoes && (
                <p>Observações: {pedidoSelecionado.observacoes}</p>
              )}
              <h3>Itens da compra</h3>
              <ul>
                {pedidoSelecionado.itens.map((item, indice) => (
                  <li key={indice}>
                    {item.material} · {item.quantidade} {item.unidade}
                    {typeof item.descricao === 'string' && item.descricao && <div>{item.descricao}</div>}
                    {typeof item.observacao === 'string' && item.observacao && <div>{item.observacao}</div>}
                  </li>
                ))}
              </ul>
            </DialogContent>
            <DialogActions>
              {pedidoSelecionado.status === 'Pendente' && (
                <Button
                  variant="contained"
                  sx={{ ...botaoPrincipal, mr: 'auto' }}
                  onClick={() => atualizarStatus(pedidoSelecionado, 'Aprovado')}
                >
                  Aprovar pedido
                </Button>
              )}
              {pedidoSelecionado.status !== 'Cancelado' && (
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => atualizarStatus(pedidoSelecionado, 'Cancelado')}
                >
                  Cancelar pedido
                </Button>
              )}
              <Button onClick={fecharDetalhes}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
}

export default HistoricoPedidosPage;
