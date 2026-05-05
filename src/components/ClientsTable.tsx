import type { ClientEnriched } from '../types';
import { ClientRow } from './ClientRow';

export interface ClientsTableProps {
  clients: ClientEnriched[];
  onSelect: (id: string, trigger: HTMLElement) => void;
}

export function ClientsTable({ clients, onSelect }: ClientsTableProps) {
  return (
    <section aria-labelledby="table-heading">
      <div className="section-title">
        <h2 id="table-heading">Clientes com gatilhos disparados</h2>
        <span className="section-title__hint">
          {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
        </span>
      </div>

      <div className="table-wrap">
        <table className="table" aria-describedby="table-heading">
          <thead>
            <tr>
              <th scope="col">Cliente</th>
              <th scope="col">Inatividade</th>
              <th scope="col">Eficiência</th>
              <th scope="col">Score</th>
              <th scope="col">Risco</th>
              <th scope="col" aria-label="Ações" />
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan={6} className="table-empty">
                  Nenhum cliente corresponde aos filtros aplicados.
                </td>
              </tr>
            ) : (
              clients.map((c) => <ClientRow key={c.id} client={c} onSelect={onSelect} />)
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
