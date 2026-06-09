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
import type { Pagina } from '../types';

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface Alerta {
  id: number;
  dataHora: string;       // LocalDateTime serializado como ISO string pelo Spring
  tipo: string;           // "QUEDA" | "PICO"
  valorDetectado: number;
  mediaHistorica: number;
  desvioPadrao: number;
  descricao: string;
}

// O back end ainda não retorna canal/afetados — quando o endpoint evoluir,
// adicione os campos aqui e remova os valores de fallback abaixo.

interface TendenciaPoint {
  data: string;
  total: number;
}

interface AlertasPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatarDataHora(iso: string): string {
  const d = new Date(iso);
  const agora = new Date();
  const diffMs = agora.getTime() - d.getTime();
  const diffH = Math.floor(diffMs / 3600000);
  if (diffH < 1) return 'Agora há pouco';
  if (diffH < 24) return `há ${diffH}h`;
  return d.toLocaleDateString('pt-BR');
}

function impactoPercentual(valorDetectado: number, media: number): number {
  if (media === 0) return 0;
  return Math.round(((valorDetectado - media) / media) * 100);
}

function tipoLabel(tipo: string): string {
  if (tipo === 'QUEDA') return 'Queda de acesso';
  if (tipo === 'PICO') return 'Pico atípico';
  return 'Comportamento atípico';
}

function tipoClasse(tipo: string): string {
  if (tipo === 'QUEDA') return 'alerta-item--queda';
  if (tipo === 'PICO') return 'alerta-item--pico';
  return 'alerta-item--atipico';
}

// ─── Componente ───────────────────────────────────────────────────────────────

export function AlertasPage({ nomeUsuario, onMenuAbrir, onNavegar }: AlertasPageProps) {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
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

    fetch(`${import.meta.env.VITE_API_URL}/monitoramento/alertas`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<Alerta[]>;
      })
      .then((data) => {
        setAlertas(data);

        // Monta pontos de tendência agrupando por data
        const porData: Record<string, number> = {};
        data.forEach((a) => {
          const dia = new Date(a.dataHora).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
          });
          porData[dia] = (porData[dia] ?? 0) + 1;
        });
        const pontos = Object.entries(porData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([data, total]) => ({ data, total }));
        setTendencia(pontos);
      })
      .catch(() => setErro('Não foi possível carregar os alertas.'))
      .finally(() => setLoading(false));
  }, []);

  // ── Métricas de resumo ────────────────────────────────────────────────────

  const totalAtivos   = alertas.length;
  const totalCriticos = alertas.filter((a) => {
    const imp = Math.abs(impactoPercentual(a.valorDetectado, a.mediaHistorica));
    return imp >= 30;
  }).length;
  const emInvestigacao = 0;   // campo futuro do back end
  const resolvidosSemana = 0; // campo futuro do back end

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
        ticks: {
          stepSize: 10,
          color: '#5A6478',
        },
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
          <div className="table-empty">Carregando alertas...</div>
        ) : erro ? (
          <div className="table-empty">{erro}</div>
        ) : (
          <>
            {/* ── Cards de resumo ────────────────────────────────────────── */}
            <section className="alertas-summary" aria-label="Resumo de alertas">

              <article className="retorno-card alertas-card--metric alertas-card--ativos">
                <div className="alertas-card__icon alertas-card__icon--red" aria-hidden="true">
                  🔔
                </div>
                <div className="alertas-card__body">
                  <h2 className="retorno-card__title">Alertas Ativos</h2>
                  <div className="retorno-card__taxa-valor">{totalAtivos}</div>
                  <p className="retorno-card__taxa-desc alertas-card__variacao alertas-card__variacao--up">
                    ▲ 8% vs período anterior
                  </p>
                </div>
              </article>

              <article className="retorno-card alertas-card--metric alertas-card--criticos">
                <div className="alertas-card__icon alertas-card__icon--orange" aria-hidden="true">
                  ⚠️
                </div>
                <div className="alertas-card__body">
                  <h2 className="retorno-card__title">Alertas Críticos</h2>
                  <div className="retorno-card__taxa-valor">{totalCriticos}</div>
                  <p className="retorno-card__taxa-desc alertas-card__variacao alertas-card__variacao--up">
                    ▲ 33% vs período anterior
                  </p>
                </div>
              </article>

              <article className="retorno-card alertas-card--metric alertas-card--investigacao">
                <div className="alertas-card__icon alertas-card__icon--yellow" aria-hidden="true">
                  🔍
                </div>
                <div className="alertas-card__body">
                  <h2 className="retorno-card__title">Em Investigação</h2>
                  <div className="retorno-card__taxa-valor">{emInvestigacao}</div>
                  <p className="retorno-card__taxa-desc alertas-card__variacao alertas-card__variacao--down">
                    ▼ 38% vs período anterior
                  </p>
                </div>
              </article>

              <article className="retorno-card alertas-card--metric alertas-card--resolvidos">
                <div className="alertas-card__icon alertas-card__icon--green" aria-hidden="true">
                  ✅
                </div>
                <div className="alertas-card__body">
                  <h2 className="retorno-card__title">Resolvidos essa semana</h2>
                  <div className="retorno-card__taxa-valor">{resolvidosSemana}</div>
                  <p className="retorno-card__taxa-desc alertas-card__variacao alertas-card__variacao--down">
                    ▼ 33% vs período anterior
                  </p>
                </div>
              </article>

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
                    {alertasExibidos.map((alerta) => {
                      const imp = impactoPercentual(alerta.valorDetectado, alerta.mediaHistorica);
                      const impNeg = imp < 0;
                      return (
                        <li key={alerta.id} className={`alerta-item ${tipoClasse(alerta.tipo)}`}>

                          <div className={`alerta-item__icone alerta-item__icone--${alerta.tipo === 'QUEDA' ? 'queda' : 'pico'}`} aria-hidden="true">
                            {alerta.tipo === 'QUEDA' ? '↓' : '↑'}
                          </div>

                          <div className="alerta-item__corpo">
                            <p className="alerta-item__titulo">{tipoLabel(alerta.tipo)}</p>
                            <p className="alerta-item__meta">
                              Canal: —&nbsp;&nbsp;·&nbsp;&nbsp;Clientes afetados: —
                            </p>
                            {/* Canal e afetados serão preenchidos quando o back end evoluir */}
                          </div>

                          <div className="alerta-item__direita">
                            <div className="alerta-item__col">
                              <span className="alerta-item__label">Impacto</span>
                              <span className={`alerta-item__impacto ${impNeg ? 'alerta-item__impacto--negativo' : 'alerta-item__impacto--positivo'}`}>
                                {imp > 0 ? '+' : ''}{imp}%
                              </span>
                            </div>
                            <div className="alerta-item__col">
                              <span className="alerta-item__label">Detectado</span>
                              <span className="alerta-item__tempo">{formatarDataHora(alerta.dataHora)}</span>
                            </div>
                          </div>

                        </li>
                      );
                    })}
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