import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { OverviewCards } from './components/OverviewCards';
import { ClientsTable } from './components/ClientsTable';
import { Drawer } from './components/Drawer';
import { useClients } from './hooks/useClients';
import { useDebouncedValue } from './hooks/useDebouncedValue';
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
  const { ctx, clients, previousPeriodActiveAlerts } = useClients();

  const [periodDays, setPeriodDays] = useState<number>(DEFAULT_PERIOD);
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);

  const filteredSorted = useMemo(() => {
    const sorted = sortByRiskAndScore(clients);
    return filterClients(sorted, {
      searchText: debouncedSearch,
      periodDays,
      today: ctx.today,
    });
  }, [clients, debouncedSearch, periodDays, ctx.today]);

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
        today={ctx.today}
        triggerEl={triggerEl}
        onClose={handleClose}
      />
    </>
  );
}

export default App;
