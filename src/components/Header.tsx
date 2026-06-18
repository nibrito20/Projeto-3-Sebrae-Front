import LogoSebrae from '../assets/Logo.png';
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
          <img src={LogoSebrae} alt="Sebrae Logo" />
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