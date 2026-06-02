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

interface FluxoAbandono {
  paginaFluxo: string;
  totalEntradas: number;
  totalAbandonos: number;
  periodo: string;
  tipoUsuario: string;
  canal: string;
  taxaAbandonoPercentual: number;
  indicadorVisual: string;
}

interface AbandonoPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
}

function indicadorClass(indicador: string): string {
  const val = indicador?.toUpperCase();
  if (val === 'CRITICO') return 'abandono-badge--critico';
  if (val === 'ALERTA')  return 'abandono-badge--alerta';
  return 'abandono-badge--normal';
}

function barColor(taxa: number): string {
  if (taxa >= 50) return 'var(--risk-high-fg)';
  if (taxa >= 30) return 'var(--risk-med-fg)';
  return 'var(--risk-low-fg)';
}

export function AbandonoPage({ nomeUsuario, onMenuAbrir, onNavegar }: AbandonoPageProps) {
  const [dados, setDados] = useState<FluxoAbandono[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'SEBRAE - Detector de Abandono Inteligente';
  }, []);

  useEffect(() => {
    setLoading(true);
    setErro(null);

    fetch(`${import.meta.env.VITE_API_URL}/api/detector-abandono`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<FluxoAbandono[]>;
      })
      .then((data) => {
        const ordenado = [...data].sort(
          (a, b) => b.taxaAbandonoPercentual - a.taxaAbandonoPercentual,
        );
        setDados(ordenado);
      })
      .catch(() => {
        setErro('Não foi possível carregar os dados de abandono.');
      })
      .finally(() => setLoading(false));
  }, []);

  const totalEntradas = dados.reduce((s, d) => s + d.totalEntradas, 0);
  const totalAbandonos = dados.reduce((s, d) => s + d.totalAbandonos, 0);
  const taxaGeral =
    totalEntradas > 0 ? Math.round((totalAbandonos / totalEntradas) * 100) : 0;
  const paginaCritica = dados[0]?.paginaFluxo ?? '—';

  const chartData = {
    labels: dados.map((d) => d.paginaFluxo),
    datasets: [
      {
        label: 'Taxa de Abandono (%)',
        data: dados.map((d) => Math.round(d.taxaAbandonoPercentual)),
        borderColor: '#004587',
        backgroundColor: 'rgba(0, 69, 135, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        pointBackgroundColor: dados.map((d) =>
          d.taxaAbandonoPercentual >= 50
            ? 'var(--risk-high-fg)'
            : d.taxaAbandonoPercentual >= 30
              ? 'var(--risk-med-fg)'
              : 'var(--risk-low-fg)',
        ),
        pointBorderColor: '#004587',
        pointRadius: 5,
        pointHoverRadius: 7,
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
          label: (ctx) => `${ctx.parsed.y}% de abandono`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          callback: (v) => `${v}%`,
          color: '#5A6478',
        },
        grid: { color: '#E1E5EB' },
      },
      x: {
        ticks: { color: '#5A6478', maxRotation: 20 },
        grid: { display: false },
      },
    },
  };

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />

      <main className="page abandono-page">

        {/* Cabeçalho da página — mesmo padrão de RetornoPage */}
        <div className="page-title abandono-page__title">
          <h1>Detector de Abandono Inteligente</h1>
          <p>Identifica onde os usuários estão saindo da plataforma e monitora quedas abruptas de retenção.</p>
        </div>

        {/* Toolbar com período e filtro — mesmo padrão de RetornoPage */}
        <div className="retorno-page__toolbar">
          <span className="retorno-page__periodo">
            {dados[0]?.periodo ?? 'Carregando...'}
          </span>
          <button type="button" className="retorno-page__filtros">
            Filtros <span aria-hidden="true">▾</span>
          </button>
        </div>

        {/* ---- Conteúdo condicional ---- */}
        {loading ? (
          <div className="table-empty">Carregando dados de abandono...</div>
        ) : erro ? (
          <div className="table-empty">{erro}</div>
        ) : (
          <>
            {/* ====================================================
                CARDS DE RESUMO — 4 métricas principais
                (mesmo estilo de retorno-card com border azul)
                ==================================================== */}
            <section className="abandono-summary" aria-label="Métricas de abandono">

              {/* Card 1: Taxa geral */}
              <article className="retorno-card abandono-card--metric">
                <h2 className="retorno-card__title">Taxa Geral de Abandono</h2>
                <div className="retorno-card__taxa-valor">{taxaGeral}%</div>
                <p className="retorno-card__taxa-desc">
                  dos usuários saem<br />sem completar a jornada
                </p>
              </article>

              {/* Card 2: Total de entradas */}
              <article className="retorno-card abandono-card--metric">
                <h2 className="retorno-card__title">Total de Entradas</h2>
                <div className="retorno-card__taxa-valor">{totalEntradas.toLocaleString('pt-BR')}</div>
                <p className="retorno-card__taxa-desc">
                  acessos registrados<br />no período
                </p>
              </article>

              {/* Card 3: Total de abandonos */}
              <article className="retorno-card abandono-card--metric">
                <h2 className="retorno-card__title">Total de Abandonos</h2>
                <div className="retorno-card__taxa-valor abandono-card__valor--critico">
                  {totalAbandonos.toLocaleString('pt-BR')}
                </div>
                <p className="retorno-card__taxa-desc">
                  saídas sem conclusão<br />da ação esperada
                </p>
              </article>

              {/* Card 4: Página mais crítica */}
              <article className="retorno-card abandono-card--metric">
                <h2 className="retorno-card__title">Página Mais Crítica</h2>
                <div className="abandono-card__pagina-critica">{paginaCritica}</div>
                <p className="retorno-card__taxa-desc">
                  maior taxa de abandono<br />do período
                </p>
              </article>
            </section>

            {/* ====================================================
                GRÁFICO DE TENDÊNCIA — linha com taxa por página
                ==================================================== */}
            <section className="abandono-chart-section" aria-label="Tendência de abandono por página">
              <article className="retorno-card abandono-card--chart">
                <header className="retorno-card__chart-header">
                  <h2 className="retorno-card__title" style={{ textAlign: 'left' }}>
                    Tendência de Abandono por Página
                  </h2>
                </header>
                <div className="retorno-card__chart-wrap" style={{ height: 260 }}>
                  <Line
                    data={chartData}
                    options={chartOptions}
                    aria-label="Gráfico de taxa de abandono por página"
                  />
                </div>
              </article>
            </section>

            {/* ====================================================
                LAYOUT INFERIOR: Funil + Ranking
                ==================================================== */}
            <section className="abandono-bottom" aria-label="Funil e ranking de abandono">

              {/* --- Funil de Entrada → Saída --- */}
              <article className="retorno-card abandono-funnel">
                <h2 className="retorno-card__title" style={{ textAlign: 'left', marginBottom: 'var(--sp-3)' }}>
                  Visualização em Funil (Entrada → Saída)
                </h2>

                {dados.map((item, idx) => {
                  const retencao = 100 - Math.round(item.taxaAbandonoPercentual);
                  // Funil: a largura da barra de entrada é proporcional ao total geral
                  const larguraEntrada = totalEntradas > 0
                    ? Math.round((item.totalEntradas / totalEntradas) * 100)
                    : 100;
                  const larguraSaida = totalEntradas > 0
                    ? Math.round((item.totalAbandonos / totalEntradas) * 100)
                    : 0;

                  return (
                    <div key={`funil-${idx}`} className="abandono-funnel__step">
                      <div className="abandono-funnel__label">
                        <span className="abandono-funnel__page">{item.paginaFluxo}</span>
                        <span className="abandono-funnel__meta">
                          {item.tipoUsuario} · {item.canal}
                        </span>
                      </div>

                      {/* Barra de entrada (azul) */}
                      <div className="abandono-funnel__bars">
                        <div className="abandono-funnel__bar-row">
                          <span className="abandono-funnel__bar-lbl">Entradas</span>
                          <div className="abandono-funnel__bar-track">
                            <div
                              className="abandono-funnel__bar-fill abandono-funnel__bar-fill--entrada"
                              style={{ width: `${larguraEntrada}%` }}
                            />
                          </div>
                          <span className="abandono-funnel__bar-val">
                            {item.totalEntradas.toLocaleString('pt-BR')}
                          </span>
                        </div>

                        {/* Barra de saída (colorida por criticidade) */}
                        <div className="abandono-funnel__bar-row">
                          <span className="abandono-funnel__bar-lbl">Saídas</span>
                          <div className="abandono-funnel__bar-track">
                            <div
                              className="abandono-funnel__bar-fill"
                              style={{
                                width: `${larguraSaida}%`,
                                background: barColor(item.taxaAbandonoPercentual),
                              }}
                            />
                          </div>
                          <span className="abandono-funnel__bar-val">
                            {item.totalAbandonos.toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>

                      {/* Indicador de retenção */}
                      <div className="abandono-funnel__retention">
                        Retenção: <strong>{retencao}%</strong>
                      </div>
                    </div>
                  );
                })}
              </article>

              {/* --- Ranking de Páginas Críticas --- */}
              <article className="retorno-card abandono-ranking">
                <h2 className="retorno-card__title" style={{ textAlign: 'left', marginBottom: 'var(--sp-3)' }}>
                  Ranking de Páginas Críticas
                </h2>

                <ul className="abandono-ranking__list" role="list">
                  {dados.map((item, idx) => (
                    <li key={`rank-${idx}`} className="abandono-ranking__item">
                      {/* Posição */}
                      <div
                        className="abandono-ranking__pos"
                        aria-label={`Posição ${idx + 1}`}
                      >
                        {idx + 1}
                      </div>

                      {/* Info */}
                      <div className="abandono-ranking__info">
                        <div className="abandono-ranking__page">{item.paginaFluxo}</div>
                        <div className="abandono-ranking__sub">
                          {item.tipoUsuario} · {item.canal} · {item.periodo}
                        </div>

                        {/* Barra de taxa */}
                        <div className="abandono-ranking__bar-track">
                          <div
                            className="abandono-ranking__bar-fill"
                            style={{
                              width: `${Math.round(item.taxaAbandonoPercentual)}%`,
                              background: barColor(item.taxaAbandonoPercentual),
                            }}
                          />
                        </div>
                      </div>

                      {/* Taxa + Badge */}
                      <div className="abandono-ranking__right">
                        <span className="abandono-ranking__taxa">
                          {Math.round(item.taxaAbandonoPercentual)}%
                        </span>
                        <span
                          className={`abandono-badge ${indicadorClass(item.indicadorVisual)}`}
                          aria-label={`Indicador: ${item.indicadorVisual}`}
                        >
                          {item.indicadorVisual}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Legenda dos alertas */}
                <div className="abandono-ranking__legend" aria-label="Legenda de indicadores">
                  <span className="abandono-badge abandono-badge--critico">CRÍTICO ≥ 50%</span>
                  <span className="abandono-badge abandono-badge--alerta">ALERTA ≥ 30%</span>
                  <span className="abandono-badge abandono-badge--normal">NORMAL &lt; 30%</span>
                </div>
              </article>
            </section>
          </>
        )}
      </main>
    </>
  );
}
