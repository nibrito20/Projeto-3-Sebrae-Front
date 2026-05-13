import { useMemo, useState } from 'react';
import { Header } from './components/Header';
import { Filters } from './components/Filters';
import { OverviewCards } from './components/OverviewCards';
import { ClientsTable } from './components/ClientsTable';
import { Drawer } from './components/Drawer';
import { NavDrawer } from './components/NavDrawer';
import { useClients } from './hooks/useClients';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { LoginPage } from './components/LoginPage';
import { CadastroPage } from './components/CadastroPage';
import { HomePage } from "./components/HomePage";
import { UserProfile } from './components/UserProfile';
import { ServiceFunnel } from './components/ServiceFunnel';
import {
  activeAlertsCount,
  aggregateRiskCounts,
  averageHealthScore,
  filterClients,
  findClientById,
  sortByRiskAndScore,
} from './lib/data';
import type { Pagina } from './types';

const DEFAULT_PERIOD = 30;
const SEARCH_DEBOUNCE_MS = 200;

function App() {

  const { ctx, clients, servicos, previousPeriodActiveAlerts, loading } = useClients();

  const [pagina, setPagina] = useState<Pagina>('home');
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [menuAberto, setMenuAberto] = useState(false);
  const [periodDays, setPeriodDays] = useState<number>(DEFAULT_PERIOD);
  const [searchInput, setSearchInput] = useState<string>('');
  const debouncedSearch = useDebouncedValue(searchInput, SEARCH_DEBOUNCE_MS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
  const [servicoSelecionado, setServicoSelecionado] = useState<number>(0);

  const filteredSorted = useMemo(() => {
    if (!ctx) return [];
    const sorted = sortByRiskAndScore(clients);
    return filterClients(sorted, {
      searchText: debouncedSearch,
      periodDays,
      today: ctx.meta.today,
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

  const handleLogout = () => {
    setNomeUsuario('');
    setPagina('home');
  };

  if (loading || !ctx) return <div>Carregando...</div>;

  const paginasProtegidas: Pagina[] = ['dashboard', 'services', 'perfil'];

  if (paginasProtegidas.includes(pagina) && !nomeUsuario) {
    setPagina('login');
    return null;
  }

  return (
    <>
      {pagina !== 'login' && pagina !== 'cadastro' && (
        <NavDrawer
          isOpen={menuAberto}
          onClose={() => setMenuAberto(false)}
          onNavegar={setPagina}
          paginaAtiva={pagina}
        />
      )}

      {pagina === 'login' && (
        <LoginPage
          onLogin={(nome) => { setNomeUsuario(nome); setPagina('home'); }}
          onIrCadastro={() => setPagina('cadastro')}
          onNavegar={setPagina}
        />
      )}

      {pagina === 'cadastro' && (
        <CadastroPage 
          onIrLogin={() => setPagina('login')} 
          onNavegar={setPagina}
        />
      )}

      {pagina === 'home' && (
        <HomePage
          nomeUsuario={nomeUsuario}
          onNavegar={setPagina}
          onMenuAbrir={() => setMenuAberto(true)}
        />
      )}

      {pagina === 'perfil' && (
        <UserProfile 
          nomeUsuario={nomeUsuario} 
          onNavegar={setPagina} 
          onLogout={handleLogout}
        />
      )}

      {pagina === 'dashboard' && (
        <>
          <Header
            onMenuAbrir={() => setMenuAberto(true)}
            onNavegar={setPagina}
            nomeUsuario={nomeUsuario}
          />
          <main className="page">
            <div className="page-title">
              <h1>Sinais Implícitos de Valor Percebido</h1>
              <p>Comportamento dos clientes — sinalizações automáticas...</p>
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
            today={ctx.meta.today}
            triggerEl={triggerEl}
            onClose={handleClose}
          />
        </>
      )}

      {pagina === 'services' && (
        <>
          <Header
            onMenuAbrir={() => setMenuAberto(true)}
            onNavegar={setPagina}
            nomeUsuario={nomeUsuario}
          />
          <main className="page">
            <div className="page-title">
              <h1>Análise de Conclusão de Serviços</h1>
              <p>Acompanhamento de conversão e eficiência dos fluxos digitais.</p>
            </div>

            <div style={{ marginTop: '20px', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
              {servicos.length > 0 ? (
                <ServiceFunnel
                  service={servicos[servicoSelecionado]}
                  servicos={servicos}
                  onServiceChange={(s) => setServicoSelecionado(servicos.indexOf(s))}
                />
              ) : (
                <div className="table-empty">Nenhum serviço disponível para análise.</div>
              )}
            </div>
          </main>
        </>
      )}

    </>
  );
}

export default App;
