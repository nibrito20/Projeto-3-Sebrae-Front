export interface AlertsTotalProps {
  current: number;
  previous: number | null;
  totalClients: number;
}

interface DeltaInfo {
  className: string;
  text: string;
}

function buildDelta(current: number, previous: number | null): DeltaInfo {
  if (previous === null || previous <= 0) {
    return { className: 'card__delta card__delta--flat', text: 'sem comparativo de período' };
  }
  const diff = current - previous;
  const pctDelta = Math.round((diff / previous) * 100);
  if (diff > 0) {
    return {
      className: 'card__delta card__delta--up',
      text: `↑ +${pctDelta}% vs período anterior`,
    };
  }
  if (diff < 0) {
    return {
      className: 'card__delta card__delta--down',
      text: `↓ ${pctDelta}% vs período anterior`,
    };
  }
  return { className: 'card__delta card__delta--flat', text: '→ estável vs período anterior' };
}

export function AlertsTotal({ current, previous, totalClients }: AlertsTotalProps) {
  const pct = totalClients ? Math.round((current / totalClients) * 100) : 0;
  const detail =
    current === 1
      ? `1 cliente com alerta ativo (${pct}% da carteira)`
      : `${current} clientes com alerta ativo (${pct}% da carteira)`;
  const delta = buildDelta(current, previous);

  return (
    <div className="card__alerts-stack">
      <span className="card__metric">{current}</span>
      <span className="card__metric-label">{detail}</span>
      <span className={delta.className}>{delta.text}</span>
    </div>
  );
}
