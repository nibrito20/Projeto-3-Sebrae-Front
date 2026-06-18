import { useEffect, useRef } from 'react';
import { CloseIcon } from './icons/CloseIcon';
import homeIcon from '../assets/homepageicon.png';
import analysisIcon from '../assets/Análise de Conclusão de Serviços.png';
import returnRateIcon from '../assets/Taxa de Retorno do Usuário.png';
import abandonmentIcon from '../assets/Detector de abandono inteligente.png';
import conversationIcon from '../assets/Na Conversa.png';
import heatmapIcon from '../assets/Mapa de Calor de Interações.png';
import scoreIcon from '../assets/Score de Engajamento.png';
import alertsIcon from '../assets/Alertas de Comportamento Atípico.png';
import signalsIcon from '../assets/Sinais Implícitos de Valor Percebido.png';
import type { Pagina } from '../types';

const navItems = [
  { id: 'home' as Pagina, label: 'Início', icon: homeIcon },
  { id: 'engajamento' as Pagina, label: 'Score de Engajamento', icon: scoreIcon },
  { id: 'services' as Pagina, label: 'Análise de Conclusão de Serviços', icon: analysisIcon },
  { id: 'dashboard' as Pagina, label: 'Sinais Implícitos de Valor Percebido', icon: signalsIcon },
  { id: 'heatmap' as Pagina, label: 'Mapa de Calor de Interações', icon: heatmapIcon },
  { id: 'retorno' as Pagina, label: 'Taxa de Retorno do Usuário', icon: returnRateIcon },
  { id: 'alertas' as Pagina, label: 'Alertas de Comportamento Atípico', icon: alertsIcon },
  { id: 'abandono' as Pagina, label: 'Detector de Abandono Inteligente', icon: abandonmentIcon },
  { id: 'conversa' as Pagina, label: 'Na Conversa', icon: conversationIcon },
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
              {item.icon ? (
                <span className="nav-drawer__item-icon">
                  <img src={item.icon} alt="" aria-hidden="true" />
                </span>
              ) : null}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}