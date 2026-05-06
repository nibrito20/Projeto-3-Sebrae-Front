import { SearchIcon } from './icons/SearchIcon';
import { UserIcon } from './icons/UserIcon';
import { MenuIcon } from './icons/MenuIcon';
import type { Pagina } from '../types';

interface HeaderProps {
  onMenuAbrir?: () => void;
  onNavegar: (pagina: Pagina) => void;
  nomeUsuario: string;
}

export function Header({onMenuAbrir, onNavegar, nomeUsuario}: HeaderProps) {

  const handleProfileClick = () => {
    if (nomeUsuario) {
      onNavegar('perfil');
    } else {
      onNavegar('login');
    }
  };

  return (
    <header className="app-header" role="banner">
      <div className="app-header__inner">
        <div className="app-header__brand" aria-label="Sebrae">
          <svg viewBox="0 0 32 32" fill="none" aria-hidden="true">
            <rect className="app-header__logo-bg" x="0" y="0" width="32" height="32" rx="6" />
            <path
              className="app-header__logo-stroke"
              d="M8 11h12c2 0 3 1 3 3v0c0 2-1 3-3 3h-7c-2 0-3 1-3 3v0c0 2 1 3 3 3h12"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          <span>Sebrae</span>
        </div>

        <nav className="app-header__nav" aria-label="Ações do cabeçalho">
          <button type="button" className="app-header__icon-btn" aria-label="Buscar">
            <SearchIcon />
          </button>
          <button type="button" className="app-header__icon-btn" aria-label="Perfil" onClick={handleProfileClick}>
            <UserIcon />
          </button>
          <button type="button" className="app-header__icon-btn" aria-label="Menu" onClick={onMenuAbrir}>
            <MenuIcon />
          </button>
        </nav>
      </div>
    </header>
  );
}
