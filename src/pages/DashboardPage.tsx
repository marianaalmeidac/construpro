import { Box, Card, CardContent, Typography } from '@mui/material';

const fonte = "'Inter', 'Segoe UI', Roboto, sans-serif";
const corTitulo = '#1e1b4b';

function Icone({ children, cor }: { children: React.ReactNode; cor: string }) {
  return (
    <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cor, flexShrink: 0 }}>
      {children}
    </Box>
  );
}

function DashboardPage() {
  return (
    <Box sx={{ p: 3, bgcolor: '#f5f5f7', fontFamily: fonte }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <Box>
          <Typography variant="h4" sx={{ fontFamily: fonte, fontWeight: 700, fontSize: 28, color: corTitulo }}>
            Olá, Mariana
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: fonte, fontSize: 14, color: '#6b7280', mt: 0.5 }}>
            Aqui está o resumo das suas compras.
          </Typography>
        </Box>
        <Box sx={{ bgcolor: 'white', borderRadius: 2, px: 2, py: 1 }}>
          <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: '#6b7280' }}>
            EMPRESA ATIVA
          </Typography>
          <Typography variant="body2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 600, color: corTitulo }}>
            Construtora Horizonte
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'stretch' }}>
        <Card sx={{ minWidth: 180, flex: 1, bgcolor: '#ede9fe' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icone cor="#7c3aed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 8l-9-5-9 5v8l9 5 9-5V8z" /><path d="M3 8l9 5 9-5" /><path d="M12 13v8" /></svg>
              </Icone>
              <Typography variant="subtitle2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 500, color: '#374151' }}>Total de pedidos</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontFamily: fonte, fontSize: 32, fontWeight: 700, color: corTitulo }}>4</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, fontWeight: 600, color: '#16a34a' }}>↗ +33%</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, color: '#6b7280', display: 'block' }}>em relação ao último mês</Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 180, flex: 1, bgcolor: '#fef3c7' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icone cor="#d97706">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
              </Icone>
              <Typography variant="subtitle2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 500, color: '#374151' }}>Pedidos em andamento</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontFamily: fonte, fontSize: 32, fontWeight: 700, color: corTitulo }}>2</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, color: '#6b7280' }}>50% do total</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, color: '#6b7280', display: 'block' }}>&nbsp;</Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 180, flex: 1, bgcolor: '#dcfce7' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icone cor="#16a34a">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
              </Icone>
              <Typography variant="subtitle2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 500, color: '#374151' }}>Pedidos concluídos</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontFamily: fonte, fontSize: 32, fontWeight: 700, color: corTitulo }}>2</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, fontWeight: 600, color: '#16a34a' }}>↗ +20%</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, color: '#6b7280', display: 'block' }}>em relação ao último mês</Typography>
          </CardContent>
        </Card>

        <Card sx={{ minWidth: 180, flex: 1, bgcolor: '#ede9fe' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Icone cor="#7c3aed">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
              </Icone>
              <Typography variant="subtitle2" sx={{ fontFamily: fonte, fontSize: 14, fontWeight: 500, color: '#374151' }}>Valor total em compras</Typography>
            </Box>
            <Typography variant="h4" sx={{ fontFamily: fonte, fontSize: 32, fontWeight: 700, color: corTitulo }}>R$ 1.451,10</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, fontWeight: 600, color: '#16a34a' }}>↗ +18%</Typography>
            <Typography variant="caption" sx={{ fontFamily: fonte, fontSize: 12, color: '#6b7280', display: 'block' }}>em relação ao último mês</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}

export default DashboardPage;
