import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import LogoSebrae from '../assets/Logo.png';
import { SearchIcon } from './icons/SearchIcon';
import { UserIcon } from './icons/UserIcon';
import { MenuIcon } from './icons/MenuIcon';
import { FEATURE_ITEMS } from '../lib/features';
import type { Pagina } from '../types';

const SEARCHABLE_FEATURES = FEATURE_ITEMS.filter(
  (item) => item.id !== 'login' && item.id !== 'cadastro' && item.id !== 'perfil',
);

interface HeaderProps {
  onMenuAbrir?: () => void;
  onNavegar: (pagina: Pagina) => void;
  nomeUsuario: string;
}

export function Header({ onMenuAbrir, onNavegar, nomeUsuario }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (searchOpen) {
      searchInputRef.current?.focus();
    }
  }, [searchOpen]);

  const searchResults = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    if (!query) return [];
    return SEARCHABLE_FEATURES.filter((item) => item.label.toLowerCase().includes(query));
  }, [searchText]);

  const handleProfileClick = () => {
    if (nomeUsuario) {
      onNavegar('perfil');
    } else {
      onNavegar('login');
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchText.trim();
    if (!trimmed) return;

    const exactMatch = SEARCHABLE_FEATURES.find(
      (item) => item.label.toLowerCase() === trimmed.toLowerCase(),
    );
    const target = exactMatch ?? searchResults[0];
    if (target) {
      setSearchOpen(false);
      setSearchText('');
      onNavegar(target.id);
    }
  };

  const handleSelectFeature = (pagina: Pagina) => {
    setSearchOpen(false);
    setSearchText('');
    onNavegar(pagina);
  };

  return (
    <header className="app-header" role="banner">
      <div className="app-header__inner">
        <div className="app-header__brand" aria-label="Sebrae">
          <img src={LogoSebrae} alt="Sebrae Logo" />
        </div>

        <nav className="app-header__nav" aria-label="Ações do cabeçalho">
          <div className={`app-header__search${searchOpen ? ' is-open' : ''}`}>
            <form className="app-header__search-form" onSubmit={handleSearchSubmit}>
              <input
                ref={searchInputRef}
                className="app-header__search-input"
                type="search"
                placeholder="Buscar recurso"
                aria-label="Buscar recurso"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
              />
            </form>
            {searchOpen && searchResults.length > 0 && (
              <div className="app-header__search-suggestions" role="listbox">
                {searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="app-header__search-suggestion"
                    onClick={() => handleSelectFeature(item.id)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="app-header__icon-btn"
            aria-label={searchOpen ? 'Fechar busca' : 'Buscar'}
            onClick={() => {
              setSearchOpen((current) => !current);
              if (searchOpen) {
                setSearchText('');
              }
            }}
            aria-expanded={searchOpen}
          >
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