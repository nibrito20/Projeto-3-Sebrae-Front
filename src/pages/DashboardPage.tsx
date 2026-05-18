import { useEffect } from 'react';
import { Header } from '../components/Header';
import { Filters } from '../components/Filters';
import { OverviewCards } from '../components/OverviewCards';
import { ClientsTable } from '../components/ClientsTable';
import { Drawer } from '../components/Drawer';
import type { ClientEnriched, Pagina, RiskLabel } from '../types';

interface DashboardPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
  periodDays: number;
  searchInput: string;
  onPeriodChange: (days: number) => void;
  onSearchInputChange: (value: string) => void;
  avgScore: number;
  counts: Record<RiskLabel, number>;
  currentAlerts: number;
  previousAlerts: number;
  clients: ClientEnriched[];
  onSelect: (id: string, trigger: HTMLElement) => void;
  selectedClient: ClientEnriched | null;
  today: string;
  triggerEl: HTMLElement | null;
  onDrawerClose: () => void;
}

export function DashboardPage({
  nomeUsuario,
  onMenuAbrir,
  onNavegar,
  periodDays,
  searchInput,
  onPeriodChange,
  onSearchInputChange,
  avgScore,
  counts,
  currentAlerts,
  previousAlerts,
  clients,
  onSelect,
  selectedClient,
  today,
  triggerEl,
  onDrawerClose,
}: DashboardPageProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Dashboard';
  }, []);

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="page">
        <div className="page-title">
          <h1>Sinais Implícitos de Valor Percebido</h1>
          <p>Comportamento dos clientes — sinalizações automáticas.</p>
        </div>

        <Filters
          periodDays={periodDays}
          searchInput={searchInput}
          onPeriodChange={onPeriodChange}
          onSearchInputChange={onSearchInputChange}
        />

        <OverviewCards
          avgScore={avgScore}
          counts={counts}
          total={clients.length}
          currentAlerts={currentAlerts}
          previousAlerts={previousAlerts}
        />

        <ClientsTable clients={clients} onSelect={onSelect} />
      </main>

      <Drawer client={selectedClient} today={today} triggerEl={triggerEl} onClose={onDrawerClose} />
    </>
  );
}

