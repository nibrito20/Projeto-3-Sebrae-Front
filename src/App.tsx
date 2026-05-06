import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { OverviewCards } from './components/OverviewCards';
import { ClientsTable } from './components/ClientsTable';
import { Drawer } from './components/Drawer';
import { useClients } from './hooks/useClients';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { LoginPage } from './components/LoginPage';
import { CadastroPage } from './components/CadastroPage';
import {
  activeAlertsCount,
  aggregateRiskCounts,
  averageHealthScore,
  filterClients,
  findClientById,
  sortByRiskAndScore,
} from './lib/data';

const DEFAULT_PERIOD = 30;
const SEARCH_DEBOUNCE_MS = 200;

function App() {

  const { ctx, clients, previousPeriodActiveAlerts, loading } = useClients();

  const [pagina, setPagina] = useState<'login' | 'cadastro' | 'dashboard'>('login');
  const [, setNomeUsuario] = useState('');

  const [periodDays, setPeriodDays] = useState<number>(DEFAULT_PERIOD);
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  const filteredSorted = useMemo(() => {
    if (!ctx) return [];
    const sorted = sortByRiskAndScore(clients);
    return filterClients(sorted, {
      searchText: debouncedSearch,
      periodDays,
      today: ctx.today,
    });
  }, [clients, debouncedSearch, periodDays, ctx]);

  const counts = useMemo(() => aggregateRiskCounts(filteredSorted), [filteredSorted]);
  const avgScore = useMemo(() => averageHealthScore(filteredSorted), [filteredSorted]);
  const currentAlerts = useMemo(() => activeAlertsCount(filteredSorted), [filteredSorted]);

  const selectedClient = useMemo(
    () => findClientById(clients, selectedId),
    [clients, selectedId],
  );

  const handleSelect = (id: string, trigger: HTMLElement) => {
    setSelectedId(id);
    setTriggerEl(trigger);
  };

  const handleClose = () => {
    setSelectedId(null);
  };

  if (pagina === 'login') return (
    <LoginPage
      onLogin={(nome) => { setNomeUsuario(nome); setPagina('dashboard'); }}
      onIrCadastro={() => setPagina('cadastro')}
    />
  );

  if (pagina === 'cadastro') return (
    <CadastroPage onIrLogin={() => setPagina('login')} />
  );

  if (loading || !ctx) return <div>Carregando...</div>;

  return (
    <>
      <Header />
      <main className="page">
        <div className="page-title">
          <h1>Sinais Implícitos de Valor Percebido</h1>
          <p>
            Comportamento dos clientes — sinalizações automáticas de risco a partir de
            inatividade, eficiência e engajamento.
          </p>
        </div>

        <Filters
          periodDays={periodDays}
          searchInput={searchInput}
          onPeriodChange={setPeriodDays}
          onSearchInputChange={setSearchInput}
        />

        <OverviewCards
          avgScore={avgScore}
          counts={counts}
          total={filteredSorted.length}
          currentAlerts={currentAlerts}
          previousAlerts={previousPeriodActiveAlerts}
        />

        <ClientsTable clients={filteredSorted} onSelect={handleSelect} />
      </main>

      <Drawer
        client={selectedClient}
        today={ctx?.today ?? ''}
        triggerEl={triggerEl}
        onClose={handleClose}
      />
    </>
  );
}

export default App;
