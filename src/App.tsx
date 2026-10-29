
import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import DashboardPage from './pages/DashboardPage';
import CatalogoPage from './pages/CatalogoPage';
import SolicitacaoCompraPage from './pages/SolicitacaoCompraPage';
import HistoricoPedidosPage from './pages/HistoricoPedidosPage';
import MinhaEmpresaPage from './pages/MinhaEmpresaPage';
import MainLayout from './layouts/MainLayout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route
            path="/solicitacao-compra"
            element={<SolicitacaoCompraPage />}
          />
          <Route
            path="/historico-pedidos"
            element={<HistoricoPedidosPage />}
          />
          <Route path="/minha-empresa" element={<MinhaEmpresaPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
