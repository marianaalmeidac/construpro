
import { NavLink } from 'react-router';
import {
  DashboardOutlined,
  Inventory2Outlined,
  ShoppingCartOutlined,
  ReceiptLongOutlined,
  BusinessOutlined,
  HelpOutlined,
  LogoutOutlined,
} from '@mui/icons-material';
import sidebarBuilding from '../assets/sidebar-building.svg';

const menuItems = [
  { label: 'Visão geral', path: '/', icon: <DashboardOutlined /> },
  { label: 'Catálogo', path: '/catalogo', icon: <Inventory2Outlined /> },
  {
    label: 'Solicitação de compra',
    path: '/solicitacao-compra',
    icon: <ShoppingCartOutlined />,
  },
  {
    label: 'Histórico de pedidos',
    path: '/historico-pedidos',
    icon: <ReceiptLongOutlined />,
  },
  {
    label: 'Minha empresa',
    path: '/minha-empresa',
    icon: <BusinessOutlined />,
  },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink
        className="sidebar__brand"
        to="/"
        aria-label="ConstruPro, visão geral"
      >
        <svg
          className="sidebar__brand-mark"
          viewBox="0 0 48 48"
          aria-hidden="true"
        >
          <path d="M7 40V20l10-7v27M17 40V10l11-6v36M28 40V20l13 7v13M3 40h42" />
          <path d="M12 24v4m10-14v4m10 10v4" />
        </svg>
        <span className="sidebar__brand-name">
          Constru<span>Pro</span>
        </span>
        <span className="sidebar__brand-caption">
          Portal B2B de Materiais
          <br />de Construção
        </span>
      </NavLink>

      <nav className="sidebar__nav" aria-label="Navegação principal">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button type="button" className="sidebar__link">
          <HelpOutlined />
          <span>Ajuda</span>
        </button>

        <button type="button" className="sidebar__link">
          <LogoutOutlined />
          <span>Sair</span>
        </button>
      </div>

      <div className="sidebar__promo">
        <p>
          Construindo
          <br />parcerias para
          <br />grandes obras.
        </p>
        <span className="sidebar__promo-accent" aria-hidden="true" />
        <img src={sidebarBuilding} alt="" aria-hidden="true" />
      </div>
    </aside>
  );
}

export default Sidebar;
