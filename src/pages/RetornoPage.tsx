import { useEffect, useMemo, useState } from 'react';
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

interface RetornoPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
}

type Frequencia = 'semana' | 'mes';

const DIAS_SEMANA = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const DIAS_ACESSADOS = [true, true, true, true, true, false, false];
const STREAK_ATUAL = 5;
const META_BADGE = 7;

const DADOS_FREQUENCIA: Record<Frequencia, { labels: string[]; valores: number[] }> = {
  semana: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4', 'Sem 5', 'Sem 6', 'Sem 7', 'Sem 8'],
    valores: [50, 72, 50, 82, 90, 82, 58, 72],
  },
  mes: {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    valores: [55, 65, 72, 80, 78, 82],
  },
};

export function RetornoPage({ nomeUsuario, onMenuAbrir, onNavegar }: RetornoPageProps) {
  const [frequencia, setFrequencia] = useState<Frequencia>('semana');

  useEffect(() => {
    document.title = 'SEBRAE - Taxa de Retorno do Usuário';
  }, []);

  const chartData = useMemo(() => {
    const dados = DADOS_FREQUENCIA[frequencia];
    return {
      labels: dados.labels,
      datasets: [
        {
          label: 'Frequência de retorno',
          data: dados.valores,
          borderColor: '#1A1F2B',
          backgroundColor: 'rgba(0, 69, 135, 0.08)',
          borderWidth: 2,
          tension: 0.35,
          pointBackgroundColor: '#1A1F2B',
          pointBorderColor: '#1A1F2B',
          pointRadius: 4,
          pointHoverRadius: 6,
          fill: true,
        },
      ],
    };
  }, [frequencia]);

  const chartOptions = useMemo<ChartOptions<'line'>>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (ctx) => `${ctx.parsed.y}%`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 25,
            callback: (value) => `${value}%`,
            color: '#5A6478',
          },
          grid: { color: '#E1E5EB' },
        },
        x: {
          ticks: { color: '#5A6478' },
          grid: { display: false },
        },
      },
    }),
    [],
  );

  const faltamParaBadge = Math.max(0, META_BADGE - STREAK_ATUAL);

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="page retorno-page">
        <div className="page-title retorno-page__title">
          <h1>Taxa de Retorno do Usuário</h1>
        </div>

        <div className="retorno-page__toolbar">
          <span className="retorno-page__periodo">01/05/2026 - 31/05/2026</span>
        </div>

        <section className="retorno-grid">
          <article className="retorno-card retorno-card--taxa">
            <h2 className="retorno-card__title">Taxa de retorno geral</h2>
            <div className="retorno-card__taxa-valor">72%</div>
            <p className="retorno-card__taxa-desc">
              dos usuários retornaram
              <br />
              neste período
            </p>
            <hr className="retorno-card__divider" />
            <div className="retorno-card__delta">↑ 12%</div>
            <p className="retorno-card__delta-desc">vs período anterior (60%)</p>
          </article>

          <article className="retorno-card retorno-card--chart">
            <header className="retorno-card__chart-header">
              <h2 className="retorno-card__title">Frequência de retorno</h2>
              <div className="retorno-select">
                <select
                  value={frequencia}
                  onChange={(e) => setFrequencia(e.target.value as Frequencia)}
                  aria-label="Selecionar frequência"
                >
                  <option value="semana">Por semana</option>
                  <option value="mes">Por mês</option>
                </select>
              </div>
            </header>
            <div className="retorno-card__chart-wrap">
              <Line data={chartData} options={chartOptions} aria-label="Gráfico de frequência de retorno" />
            </div>
          </article>
        </section>

        <section className="retorno-bottom">
          <article className="retorno-streak">
            <h2 className="retorno-streak__title">Streak de uso</h2>
            <div className="retorno-streak__content">
              <div className="retorno-streak__count">
                <span className="retorno-streak__fire" aria-hidden="true">🔥</span>
                <div className="retorno-streak__count-info">
                  <span className="retorno-streak__number">{STREAK_ATUAL}</span>
                  <span className="retorno-streak__label">acessos consecutivos</span>
                  <span className="retorno-streak__record">☆ Seu recorde atual!</span>
                </div>
              </div>
              <div className="retorno-streak__week" role="list" aria-label="Acessos da semana">
                {DIAS_SEMANA.map((dia, i) => (
                  <div key={dia} className="retorno-streak__day" role="listitem">
                    <span className="retorno-streak__day-label">{dia}</span>
                    <span
                      className={`retorno-streak__day-mark${DIAS_ACESSADOS[i] ? ' is-done' : ''}`}
                      aria-label={DIAS_ACESSADOS[i] ? 'Acessou' : 'Não acessou'}
                    >
                      {DIAS_ACESSADOS[i] ? '✓' : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </article>

          <article className="retorno-badge">
            <h2 className="retorno-badge__title">Badge</h2>
            <div className="retorno-badge__medal" aria-hidden="true">
              <svg viewBox="0 0 80 96" width="80" height="96">
                <path
                  d="M20 6 L30 6 L40 30 L20 30 Z M60 6 L50 6 L40 30 L60 30 Z"
                  fill="#1A1F2B"
                />
                <circle cx="40" cy="58" r="26" fill="none" stroke="#1A1F2B" strokeWidth="3" />
                <circle cx="40" cy="58" r="20" fill="none" stroke="#1A1F2B" strokeWidth="2" />
                <polygon
                  points="40,46 43,55 52,55 45,60 48,69 40,64 32,69 35,60 28,55 37,55"
                  fill="#1A1F2B"
                />
              </svg>
            </div>
            <p className="retorno-badge__msg">
              <strong>Continue assim!</strong>
              <br />
              Faltam {faltamParaBadge} acessos para
              <br />
              sua próxima conquista.
            </p>
          </article>
        </section>
      </main>
    </>
  );
}
