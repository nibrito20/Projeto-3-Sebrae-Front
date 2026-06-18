import { useEffect, useState } from 'react';
import {
  CategoryScale,
  Chart,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Header } from '../components/Header';
import { LoadingScreen } from '../components/LoadingScreen';
import type { Pagina } from '../types';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface TipoAlerta {
  tipo: string;
  quantidade: number;
  comparacao: string;
}

interface AlertaItem {
  tipo: string;
  canal: string;
  clientesAfetados: number;
  impactoPercentual: number;
  detectadoEm: string;
  descricao: string;
}

interface TendenciaPoint {
  data: string;
  total: number;
}

interface AlertasResponse {
  tiposDeAlertas: TipoAlerta[];
  listaDeAlertas: AlertaItem[];
  tendencia: TendenciaPoint[];
}

interface AlertasPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function tipoClasse(tipo: string): string {
  if (tipo === 'QUEDA') return 'alerta-item--queda';
  if (tipo === 'PICO') return 'alerta-item--pico';
  return 'alerta-item--atipico';
}

function iconeCard(tipo: string): string {
  if (tipo === 'Alertas Ativos') return '🔔';
  if (tipo === 'Alertas Críticos') return '⚠️';
  if (tipo === 'Em Investigação') return '🔍';
  return '✅';
}

function corIconeCard(tipo: string): string {
  if (tipo === 'Alertas Ativos') return 'alertas-card__icon--red';
  if (tipo === 'Alertas Críticos') return 'alertas-card__icon--orange';
  if (tipo === 'Em Investigação') return 'alertas-card__icon--yellow';
  return 'alertas-card__icon--green';
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function AlertasPage({ nomeUsuario, onMenuAbrir, onNavegar }: AlertasPageProps) {
  const [tiposAlertas, setTiposAlertas] = useState<TipoAlerta[]>([]);
  const [alertas, setAlertas] = useState<AlertaItem[]>([]);
  const [tendencia, setTendencia] = useState<TendenciaPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<string>('todos');
  const [mostrarTodos, setMostrarTodos] = useState(false);

  useEffect(() => {
    document.title = 'SEBRAE - Alerta de Comportamento Atípico';
  }, []);

  useEffect(() => {
    setLoading(true);
    setErro(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/alertas-comportamento`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<AlertasResponse>;
      })
      .then((data) => {
        setTiposAlertas(data.tiposDeAlertas);
        setAlertas(data.listaDeAlertas);
        setTendencia(data.tendencia);
      })
      .catch(() => setErro('Não foi possível carregar os alertas.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Filtro e paginação ────────────────────────────────────────────────────

  const alertasFiltrados = alertas.filter((a) => {
    if (filtro === 'todos') return true;
    return a.tipo === filtro.toUpperCase();
  });

  const alertasExibidos = mostrarTodos
    ? alertasFiltrados
    : alertasFiltrados.slice(0, 3);

  // ── Gráfico ───────────────────────────────────────────────────────────────

  const chartData = {
    labels: tendencia.map((p) => p.data),
    datasets: [
      {
        label: 'Alertas detectados',
        data: tendencia.map((p) => p.total),
        borderColor: '#004587',
        backgroundColor: 'rgba(0, 69, 135, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        pointBackgroundColor: '#004587',
        pointBorderColor: '#fff',
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
      },
    ],
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.parsed.y} alertas`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 10, color: '#5A6478' },
        grid: { color: '#E1E5EB' },
      },
      x: {
        ticks: { color: '#5A6478', maxRotation: 0 },
        grid: { display: false },
      },
    },
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />

      <main className="page alertas-page">

        {/* Cabeçalho */}
        <div className="page-title alertas-page__title">
          <div>
            <h1>Alerta de Comportamento Atípico</h1>
            <p>Monitoramento automático de quedas de engajamento e riscos de churn.</p>
          </div>
          <div className="retorno-page__toolbar" style={{ marginBottom: 0 }}>
            <button type="button" className="retorno-page__filtros">
              Filtros <span aria-hidden="true">▾</span>
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingScreen message="Carregando alertas..." />
        ) : erro ? (
          <div className="table-empty">{erro}</div>
        ) : (
          <>
            {/* ── Cards de resumo ────────────────────────────────────────── */}
            <section className="alertas-summary" aria-label="Resumo de alertas">
              {tiposAlertas.map((t) => (
                <article key={t.tipo} className="retorno-card alertas-card--metric">
                  <div className={`alertas-card__icon ${corIconeCard(t.tipo)}`} aria-hidden="true">
                    {iconeCard(t.tipo)}
                  </div>
                  <div className="alertas-card__body">
                    <h2 className="retorno-card__title">{t.tipo}</h2>
                    <div className="retorno-card__taxa-valor">{t.quantidade}</div>
                    <p className="retorno-card__taxa-desc alertas-card__variacao">
                      {t.comparacao}
                    </p>
                  </div>
                </article>
              ))}
            </section>

            {/* ── Gráfico de tendência ───────────────────────────────────── */}
            <section className="alertas-chart-section" aria-label="Tendência de alertas">
              <article className="retorno-card alertas-card--chart">
                <h2 className="retorno-card__title" style={{ textAlign: 'left', marginBottom: '1rem' }}>
                  Tendência de Alertas
                </h2>
                {tendencia.length > 0 ? (
                  <div style={{ height: 220 }}>
                    <Line
                      data={chartData}
                      options={chartOptions}
                      aria-label="Gráfico de tendência de alertas ao longo do tempo"
                    />
                  </div>
                ) : (
                  <div className="table-empty">Sem dados suficientes para o gráfico.</div>
                )}
              </article>
            </section>

            {/* ── Lista de alertas ───────────────────────────────────────── */}
            <section className="alertas-list-section" aria-label="Lista de alertas">
              <article className="retorno-card">

                <header className="alertas-list__header">
                  <h2 className="retorno-card__title">Lista de Alertas</h2>
                  <div className="alertas-list__filtros">
                    {['todos', 'queda', 'pico'].map((f) => (
                      <button
                        key={f}
                        type="button"
                        className={`alertas-filtro-btn${filtro === f ? ' alertas-filtro-btn--ativo' : ''}`}
                        onClick={() => { setFiltro(f); setMostrarTodos(false); }}
                      >
                        {f === 'todos' ? 'Todos' : f === 'queda' ? 'Queda' : 'Pico'}
                      </button>
                    ))}
                  </div>
                </header>

                {alertasExibidos.length === 0 ? (
                  <div className="table-empty">Nenhum alerta encontrado.</div>
                ) : (
                  <ul className="alertas-list" role="list">
                    {alertasExibidos.map((alerta, index) => (
                      <li key={index} className={`alerta-item ${tipoClasse(alerta.tipo)}`}>

                        <div className={`alerta-item__icone alerta-item__icone--${alerta.tipo === 'QUEDA' ? 'queda' : 'pico'}`} aria-hidden="true">
                          {alerta.tipo === 'QUEDA' ? '↓' : '↑'}
                        </div>

                        <div className="alerta-item__corpo">
                          <p className="alerta-item__titulo">{alerta.descricao}</p>
                          <p className="alerta-item__meta">
                            Canal: {alerta.canal}&nbsp;&nbsp;·&nbsp;&nbsp;Clientes afetados: {alerta.clientesAfetados}
                          </p>
                        </div>

                        <div className="alerta-item__direita">
                          <div className="alerta-item__col">
                            <span className="alerta-item__label">Impacto</span>
                            <span className={`alerta-item__impacto ${alerta.impactoPercentual < 0 ? 'alerta-item__impacto--negativo' : 'alerta-item__impacto--positivo'}`}>
                              {alerta.impactoPercentual > 0 ? '+' : ''}{alerta.impactoPercentual}%
                            </span>
                          </div>
                          <div className="alerta-item__col">
                            <span className="alerta-item__label">Detectado</span>
                            <span className="alerta-item__tempo">{alerta.detectadoEm}</span>
                          </div>
                        </div>

                      </li>
                    ))}
                  </ul>
                )}

                {alertasFiltrados.length > 3 && (
                  <div className="alertas-list__ver-todos">
                    <button
                      type="button"
                      className="alertas-ver-todos-btn"
                      onClick={() => setMostrarTodos((v) => !v)}
                    >
                      {mostrarTodos
                        ? 'Ver menos'
                        : `Ver todos os alertas (${alertasFiltrados.length}) →`}
                    </button>
                  </div>
                )}

              </article>
            </section>
          </>
        )}
      </main>
    </>
  );
}