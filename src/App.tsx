import { useMemo, useState, type ReactNode } from 'react';
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { NavDrawer } from './components/NavDrawer';
import { useClients } from './hooks/useClients';
import { useDebouncedValue } from './hooks/useDebouncedValue';
import { HomePage, LoginPage, CadastroPage, DashboardPage, ServicesPage, ProfilePage, EngajamentoPage } from './pages';
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

const PAGE_ROUTES = {
  home: '/',
  login: '/login',
  cadastro: '/cadastro',
  dashboard: '/dashboard',
  services: '/services',
  perfil: '/perfil',
  engajamento: '/engajamento',
} as Record<Pagina, string>;

const PATH_TO_PAGE = {
  '/': 'home',
  '/login': 'login',
  '/cadastro': 'cadastro',
  '/dashboard': 'dashboard',
  '/services': 'services',
  '/perfil': 'perfil',
  '/engajamento': 'engajamento',
} as Record<string, Pagina>;

function getPageFromPath(pathname: string): Pagina {
  return PATH_TO_PAGE[pathname] ?? 'home';
}

function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = getPageFromPath(location.pathname);
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/cadastro';

  const { ctx, clients, servicos, previousPeriodActiveAlerts, loading } = useClients();
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
    navigate('/');
  };

  const handleNavigate = (pagina: Pagina) => {
    setMenuAberto(false);
    navigate(PAGE_ROUTES[pagina]);
  };

  const requireAuth = (element: ReactNode) => {
    return nomeUsuario ? element : <Navigate to="/login" replace />;
  };

  if (loading || !ctx) return <div>Carregando...</div>;

  return (
    <>
      {!isAuthRoute && (
        <NavDrawer
          isOpen={menuAberto}
          onClose={() => setMenuAberto(false)}
          onNavegar={handleNavigate}
          paginaAtiva={currentPage}
        />
      )}

      <Routes>
        <Route
          path="/"
          element={
            <HomePage
              nomeUsuario={nomeUsuario}
              onNavegar={handleNavigate}
              onMenuAbrir={() => setMenuAberto(true)}
            />
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={(nome) => {
                setNomeUsuario(nome);
                navigate('/dashboard');
              }}
              onIrCadastro={() => navigate('/cadastro')}
              onNavegar={handleNavigate}
            />
          }
        />
        <Route
          path="/cadastro"
          element={
            <CadastroPage
              onIrLogin={() => navigate('/login')}
              onNavegar={handleNavigate}
            />
          }
        />
        <Route
          path="/dashboard"
          element={
            requireAuth(
              <DashboardPage
                nomeUsuario={nomeUsuario}
                onMenuAbrir={() => setMenuAberto(true)}
                onNavegar={handleNavigate}
                periodDays={periodDays}
                searchInput={searchInput}
                onPeriodChange={setPeriodDays}
                onSearchInputChange={setSearchInput}
                avgScore={avgScore}
                counts={counts}
                currentAlerts={currentAlerts}
                previousAlerts={previousPeriodActiveAlerts}
                clients={filteredSorted}
                onSelect={handleSelect}
                selectedClient={selectedClient}
                today={ctx.meta.today}
                triggerEl={triggerEl}
                onDrawerClose={handleClose}
              />,
            )
          }
        />
        <Route
          path="/engajamento"
          element={
            requireAuth(
              <EngajamentoPage
                nomeUsuario={nomeUsuario}
                onMenuAbrir={() => setMenuAberto(true)}
                onNavegar={handleNavigate}
                clients={clients}
              />,
            )
          }
        />
        <Route
          path="/services"
          element={
            requireAuth(
              <ServicesPage
                nomeUsuario={nomeUsuario}
                onMenuAbrir={() => setMenuAberto(true)}
                onNavegar={handleNavigate}
                servicos={servicos}
                servicoSelecionado={servicoSelecionado}
                onServiceChange={(service) => setServicoSelecionado(servicos.indexOf(service))}
              />,
            )
          }
        />
        <Route
          path="/perfil"
          element={
            requireAuth(
              <ProfilePage
                nomeUsuario={nomeUsuario}
                onNavegar={handleNavigate}
                onLogout={handleLogout}
                onMenuAbrir={() => setMenuAberto(true)}
              />,
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
