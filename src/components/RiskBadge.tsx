import type { RiskLabel } from '../types';

const BADGE_CLASS: Record<RiskLabel, string> = {
  alto: 'badge--high',
  'médio': 'badge--med',
  baixo: 'badge--low',
};

const BADGE_LABEL: Record<RiskLabel, string> = {
  alto: 'Alto',
  'médio': 'Médio',
  baixo: 'Baixo',
};

export interface RiskBadgeProps {
  risk: RiskLabel;
}

export function RiskBadge({ risk }: RiskBadgeProps) {
  return <span className={`badge ${BADGE_CLASS[risk]}`}>{BADGE_LABEL[risk]}</span>;
}
