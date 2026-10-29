
import { NotificationsOutlined, SearchOutlined } from '@mui/icons-material';

function Header() {
  return (
    <header className="header">
      <div className="header__title">
        <span>Portal de compras</span>
      </div>

      <div className="header__actions">
        <button
          type="button"
          className="header__icon-button"
          aria-label="Pesquisar"
        >
          <SearchOutlined />
        </button>

        <button
          type="button"
          className="header__icon-button"
          aria-label="Notificações"
        >
          <NotificationsOutlined />
        </button>

        <div className="header__user">
          <div className="header__avatar">M</div>
          <div>
            <strong>Mariana Almeida</strong>
            <span>Compras</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
