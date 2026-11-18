import { useEffect, useState } from 'react';
import { Box, Card, CardContent, CircularProgress, Typography } from '@mui/material';

type StatusPedido = 'Entregue' | 'Em separação' | 'Aguardando pagamento';

type Pedido = {
  id: number;
  cliente: string;
  itens: string;
  total: number;
  status: StatusPedido;
};

const pedidosSimulados: Pedido[] = [
  { id: 1042, cliente: 'Construtora Horizonte', itens: '200 kg cimento · 500 un tijolo', total: 501.0, status: 'Entregue' },
  { id: 1043, cliente: 'Reforma & Cia', itens: '100 un telha · 50 m vergalhão', total: 360.5, status: 'Em separação' },
  { id: 1044, cliente: 'Obra Viva Materiais', itens: '300 kg cimento', total: 264.0, status: 'Aguardando pagamento' },
  { id: 1045, cliente: 'Construtora Horizonte', itens: '80 m vergalhão', total: 325.6, status: 'Entregue' },
];

function DashboardPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPedidos(pedidosSimulados);
      setCarregando(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const totalPedidos = pedidos.length;
  const valorTotal = pedidos.reduce((soma, p) => soma + p.total, 0);

  const porStatus: Record<StatusPedido, number> = {
    Entregue: 0,
    'Em separação': 0,
    'Aguardando pagamento': 0,
  };
  pedidos.forEach((p) => {
    porStatus[p.status] += 1;
  });

  if (carregando) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Visão geral
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Total de pedidos
            </Typography>
            <Typography variant="h4">{totalPedidos}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Valor total
            </Typography>
            <Typography variant="h4">
              {valorTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 200, flex: 1 }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary">
              Pedidos por status
            </Typography>
            <Typography variant="body1">Entregue: {porStatus.Entregue}</Typography>
            <Typography variant="body1">Em separação: {porStatus['Em separação']}</Typography>
            <Typography variant="body1">Aguardando pagamento: {porStatus['Aguardando pagamento']}</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DashboardPage;
