import { useEffect, useRef } from 'react';
import { sortTimelineDesc } from '../lib/data';
import type { ClientEnriched } from '../types';
import { CloseIcon } from './icons/CloseIcon';
import { RiskBadge } from './RiskBadge';
import { Timeline } from './Timeline';

export interface DrawerProps {
  client: ClientEnriched | null;
  today: string;
  triggerEl: HTMLElement | null;
  onClose: () => void;
}

function buildSummary(client: ClientEnriched): string {
  const days = client.daysSinceLastAccess;
  let inactivityPart: string;
  if (days === 0) inactivityPart = 'Acessou hoje.';
  else if (days === 1) inactivityPart = 'Último acesso ontem.';
  else if (days < 15) inactivityPart = `Último acesso há ${days} dias.`;
  else inactivityPart = `Inativo há ${days} dias — alerta ativo.`;

  let taskPart = '';
  if (client.platformAvgMinutes && client.ratio > 2) {
    taskPart = ` Pior tarefa: ${client.worstTask.label} (${client.userMinutes}min vs ${client.platformAvgMinutes}min de média).`;
  }
  return inactivityPart + taskPart;
}

export function Drawer({ client, today, triggerEl, onClose }: DrawerProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const isOpen = client !== null;

  useEffect(() => {
    document.title = 'SEBRAE - Sinais Implícitos'
  }, [])  

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
  }, [isOpen, client?.id]);

  useEffect(() => {
    if (isOpen) return;
    if (triggerEl && typeof triggerEl.focus === 'function') {
      triggerEl.focus();
    }
  }, [isOpen, triggerEl]);

  const events = client ? sortTimelineDesc(client.timeline) : [];
  const summary = client ? buildSummary(client) : '';

  return (
    <>
      <div
        className={`drawer-backdrop${isOpen ? ' is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
        tabIndex={-1}
      />
      <aside
        className={`drawer${isOpen ? ' is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-client-name"
        aria-hidden={!isOpen}
      >
        {client ? (
          <>
            <header className="drawer__header">
              <div className="drawer__top-row">
                <div>
                  <div id="drawer-client-name" className="drawer__client-name">
                    {client.nome}
                  </div>
                  <div className="drawer__client-cnpj">{client.cnpj}</div>
                </div>
                <button
                  ref={closeBtnRef}
                  type="button"
                  className="drawer__close"
                  onClick={onClose}
                  aria-label="Fechar painel"
                >
                  <CloseIcon />
                </button>
              </div>
              <div className="drawer__meta">
                <span className="drawer__score">
                  Score: <strong>{client.healthScore}</strong>/100
                </span>
                <RiskBadge risk={client.risk} />
              </div>
              <div className="drawer__summary">{summary}</div>
            </header>
            <div className="drawer__body">
              <div className="drawer__section-title">Linha do tempo do comportamento</div>
              <Timeline events={events} today={today} />
            </div>
          </>
        ) : null}
      </aside>
    </>
  );
}
