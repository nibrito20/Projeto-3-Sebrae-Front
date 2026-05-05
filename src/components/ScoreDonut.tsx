import { useMemo } from 'react';
import { ArcElement, Chart, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip);

function readToken(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function colorForScore(score: number): string {
  if (score >= 70) return readToken('--risk-low-fg');
  if (score >= 40) return readToken('--risk-med-fg');
  return readToken('--risk-high-fg');
}

export interface ScoreDonutProps {
  score: number;
}

export function ScoreDonut({ score }: ScoreDonutProps) {
  const safeScore = Number.isFinite(score) ? score : 0;
  const arcColor = colorForScore(safeScore);
  const trackColor = readToken('--color-bg');

  const data = useMemo(
    () => ({
      labels: ['Score', 'Restante'],
      datasets: [
        {
          data: [safeScore, Math.max(0, 100 - safeScore)],
          backgroundColor: [arcColor, trackColor],
          hoverBackgroundColor: [arcColor, trackColor],
          borderWidth: 0,
        },
      ],
    }),
    [safeScore, arcColor, trackColor],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: '72%',
      plugins: {
        legend: { display: false },
        tooltip: { enabled: false },
      },
      animation: { duration: 600 },
    }),
    [],
  );

  return (
    <div className="donut" aria-live="polite">
      <div className="donut__canvas-wrap">
        <Doughnut data={data} options={options} aria-label="Score médio de saúde" />
      </div>
      <div className="donut__center">
        <span className="donut__value">{Number.isFinite(score) ? score : '—'}</span>
        <span className="donut__label">de 100</span>
      </div>
    </div>
  );
}
