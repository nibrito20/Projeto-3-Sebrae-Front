import { CalendarIcon } from './icons/CalendarIcon';
import { SearchIcon } from './icons/SearchIcon';

export interface FiltersProps {
  periodDays: number;
  searchInput: string;
  onPeriodChange: (days: number) => void;
  onSearchInputChange: (value: string) => void;
}

const PERIOD_OPTIONS = [
  { value: 7, label: 'Últimos 7 dias' },
  { value: 30, label: 'Últimos 30 dias' },
  { value: 90, label: 'Últimos 90 dias' },
] as const;

export function Filters({
  periodDays,
  searchInput,
  onPeriodChange,
  onSearchInputChange,
}: FiltersProps) {
  return (
    <section className="filters" aria-label="Filtros">
      <label className="filters__field" htmlFor="filter-period">
        <CalendarIcon />
        <select
          id="filter-period"
          aria-label="Filtrar por período"
          value={periodDays}
          onChange={(e) => onPeriodChange(Number(e.target.value))}
        >
          {PERIOD_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      <label className="filters__field" htmlFor="filter-search">
        <SearchIcon />
        <input
          id="filter-search"
          type="search"
          placeholder="Buscar cliente ou CNPJ"
          autoComplete="off"
          value={searchInput}
          onChange={(e) => onSearchInputChange(e.target.value)}
        />
      </label>
    </section>
  );
}
