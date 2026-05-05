import type { RiskLabel } from '../types';
import { AlertsTotal } from './AlertsTotal';
import { RiskDistribution } from './RiskDistribution';
import { ScoreDonut } from './ScoreDonut';

export interface OverviewCardsProps {
  avgScore: number;
  counts: Record<RiskLabel, number>;
  total: number;
  currentAlerts: number;
  previousAlerts: number | null;
}

export function OverviewCards({
  avgScore,
  counts,
  total,
  currentAlerts,
  previousAlerts,
}: OverviewCardsProps) {
  return (
    <section className="cards-grid" aria-label="Visão geral">
      <article className="card">
        <div className="card__header">
          <span className="card__title">Score médio de saúde</span>
        </div>
        <div className="card__body">
          <ScoreDonut score={avgScore} />
        </div>
      </article>

      <article className="card">
        <div className="card__header">
          <span className="card__title">Distribuição de risco</span>
        </div>
        <div className="card__body">
          <RiskDistribution counts={counts} total={total} />
        </div>
      </article>

      <article className="card">
        <div className="card__header">
          <span className="card__title">Total de alertas ativos</span>
        </div>
        <div className="card__body">
          <AlertsTotal
            current={currentAlerts}
            previous={previousAlerts}
            totalClients={total}
          />
        </div>
      </article>
    </section>
  );
}
