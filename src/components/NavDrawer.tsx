import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import type { Pagina } from '../types';

const navItems = [
  { id: 'home' as Pagina, label: 'Início', icon: '⊙' },
  { id: 'engajamento' as Pagina, label: 'Score de Engajamento', icon: '⊙' },
  { id: 'services' as Pagina, label: 'Análise de Conclusão de Serviços', icon: '⊙' },
  { id: 'dashboard' as Pagina, label: 'Sinais Implícitos de Valor Percebido', icon: '⊙' },
   { id: 'heatmap' as Pagina, label: 'Mapa de Calor de Interações', icon: '⊙' },
//   { id: '' as Pagina, label: 'Taxa de Retorno do Usuário', icon: '⊙' },
//   { id: '' as Pagina, label: 'Alertas de Comportamento Atípico', icon: '⊙' },
//   { id: '' as Pagina, label: 'Detector de Abandono Inteligente', icon: '⊙' },
];

interface NavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavegar: (pagina: Pagina) => void;
  paginaAtiva: Pagina;
}

export function NavDrawer({ isOpen, onClose, onNavegar, paginaAtiva }: NavDrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => {
      closeBtnRef.current?.focus();
    }, 50);
    return () => window.clearTimeout(id);
  }, [isOpen]);

  return (
    <>
      <div
        className={`drawer-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
        tabIndex={-1}
      />
      <aside
        className={`nav-drawer${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!isOpen}
      >
        <header className="nav-drawer__header">
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
          <button
            ref={closeBtnRef}
            type="button"
            className="drawer__close"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            <CloseIcon />
          </button>
        </header>

        <nav className="nav-drawer__nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`nav-drawer__item${paginaAtiva === item.id ? ' is-active' : ''}`}
              onClick={() => { onNavegar(item.id); onClose(); }}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}