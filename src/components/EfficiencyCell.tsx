import { efficiencyLevel } from '../lib/risk';
import type { ClientEnriched, EfficiencyLevel } from '../types';

const FILL_CLASS: Record<EfficiencyLevel, string> = {
  ok: 'eff__bar-fill--ok',
  warn: 'eff__bar-fill--warn',
  alert: 'eff__bar-fill--alert',
};

export interface EfficiencyCellProps {
  client: ClientEnriched;
}

export function EfficiencyCell({ client }: EfficiencyCellProps) {
  const ratio = client.ratio;
  const level = efficiencyLevel(ratio);
  const widthPct = Math.max(8, Math.min(100, Math.round((ratio / 3) * 100)));
  const ratioLabel = ratio ? `${ratio.toFixed(1)}x` : '—';
  const taskLabel = client.worstTask.label;
  const userMin = client.userMinutes;
  const avgMin = client.platformAvgMinutes;

  return (
    <div
      className="eff"
      tabIndex={0}
      aria-label={`Eficiência em ${taskLabel}: ${userMin} minutos do cliente vs ${avgMin} minutos da plataforma`}
    >
      <div className="eff__bar">
        <div className={`eff__bar-fill ${FILL_CLASS[level]}`} style={{ width: `${widthPct}%` }} />
      </div>
      <span className="eff__ratio">{ratioLabel}</span>
      <div className="eff__tooltip" role="tooltip">
        <strong>{taskLabel}</strong>
        <br />
        Cliente: {userMin}min · Média: {avgMin}min
      </div>
    </div>
  );
}
