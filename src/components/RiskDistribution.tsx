import type { RiskLabel } from '../types';

interface DistRowConfig {
  key: RiskLabel;
  label: string;
  cls: string;
}

const ROWS: DistRowConfig[] = [
  { key: 'alto', label: 'Alto', cls: 'dist__bar-fill--high' },
  { key: 'médio', label: 'Médio', cls: 'dist__bar-fill--med' },
  { key: 'baixo', label: 'Baixo', cls: 'dist__bar-fill--low' },
];

export interface RiskDistributionProps {
  counts: Record<RiskLabel, number>;
  total: number;
}

export function RiskDistribution({ counts, total }: RiskDistributionProps) {
  return (
    <div className="dist">
      {ROWS.map((cfg) => {
        const n = counts[cfg.key] ?? 0;
        const pct = total ? Math.round((n / total) * 100) : 0;
        const width = n === 0 ? 0 : Math.max(2, pct);
        return (
          <div key={cfg.key} className="dist__row">
            <span className="dist__label">{cfg.label}</span>
            <div
              className="dist__bar"
              role="img"
              aria-label={`${n} clientes em risco ${cfg.label.toLowerCase()} (${pct}%)`}
            >
              <div className={`dist__bar-fill ${cfg.cls}`} style={{ width: `${width}%` }} />
            </div>
            <span className="dist__count">
              {n} ({pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}
