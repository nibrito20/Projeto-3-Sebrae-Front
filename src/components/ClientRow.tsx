import type { KeyboardEvent } from 'react';
import { inactivityLevel } from '../lib/risk';
import { inactivityLabel } from '../lib/format';
import type { ClientEnriched, InactivityLevel } from '../types';
import { EfficiencyCell } from './EfficiencyCell';
import { RiskBadge } from './RiskBadge';

const INACTIVITY_CLASS: Record<InactivityLevel, string> = {
  high: 'cell-inactivity--high',
  med: 'cell-inactivity--med',
  low: 'cell-inactivity--low',
};

export interface ClientRowProps {
  client: ClientEnriched;
  onSelect: (id: string, trigger: HTMLElement) => void;
}

export function ClientRow({ client, onSelect }: ClientRowProps) {
  const level = inactivityLevel(client.daysSinceLastAccess);

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    onSelect(client.id, e.currentTarget);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTableRowElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (e.target !== e.currentTarget) return;
    e.preventDefault();
    onSelect(client.id, e.currentTarget);
  };

  return (
    <tr tabIndex={0} onClick={handleClick} onKeyDown={handleKeyDown}>
      <td>
        <div className="cell-client">
          <span className="cell-client__name">{client.nome}</span>
          <span className="cell-client__cnpj">{client.cnpj}</span>
        </div>
      </td>
      <td>
        <span className={INACTIVITY_CLASS[level]}>
          {inactivityLabel(client.daysSinceLastAccess)}
        </span>
      </td>
      <td>
        <EfficiencyCell client={client} />
      </td>
      <td>
        <span className="cell-score">{client.healthScore}</span>
      </td>
      <td>
        <RiskBadge risk={client.risk} />
      </td>
      <td>
        <button
          type="button"
          className="btn-link"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(client.id, e.currentTarget);
          }}
          aria-label={`Ver detalhes de ${client.nome}`}
        >
          Ver detalhes
        </button>
      </td>
    </tr>
  );
}
