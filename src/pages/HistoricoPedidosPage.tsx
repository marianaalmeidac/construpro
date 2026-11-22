import { useState } from 'react';
import './HistoricoPedidosPage.css';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

type Pedido = {
  id: string;
  data: string;
  status: 'Pendente' | 'Aprovado';
};

const pedidos: Pedido[] = [
  { id: 'PED-001', data: '20/11/2026', status: 'Pendente' },
  { id: 'PED-002', data: '18/11/2026', status: 'Aprovado' },
  { id: 'PED-003', data: '15/11/2026', status: 'Pendente' }
];

function HistoricoPedidosPage() {
  const [statusSelecionado, setStatusSelecionado] = useState('Todos');
    const pedidosVisiveis =
      statusSelecionado === 'Todos'
        ? pedidos
        : pedidos.filter((pedido) => pedido.status === statusSelecionado);
  return (
    <section>
      <h1>Histórico de pedidos</h1>
      <p>Consulte suas solicitações anteriores.</p>
      <div className="filtro-status">
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
          <MenuItem value="Pendente">Pendente</MenuItem>
          <MenuItem value="Aprovado">Aprovado</MenuItem>
        </TextField>
      </div>
      <TableContainer component={Paper} variant="outlined">
        <Table className="tabela-pedidos" size="small" aria-label="Histórico de pedidos">
          <TableHead>
            <TableRow>
              <TableCell scope="col">Pedido</TableCell>
              <TableCell scope="col">Data</TableCell>
              <TableCell scope="col">Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {pedidosVisiveis.length === 0 && (
              <TableRow>
                <TableCell colSpan={3}>Nenhum pedido encontrado.</TableCell>
              </TableRow>
            )}

            {pedidosVisiveis.map((pedido) => (
              <TableRow key={pedido.id}>
                <TableCell>{pedido.id}</TableCell>
                <TableCell>{pedido.data}</TableCell>
                <TableCell>
                  <Chip
                    label={pedido.status}
                    color={pedido.status === 'Aprovado' ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </section>
  );
}

export default HistoricoPedidosPage;
