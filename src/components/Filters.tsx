import { SearchIcon } from './icons/SearchIcon';

export interface FiltersProps {
  periodDays: number;
  searchInput: string;
  onPeriodChange: (days: number) => void;
  onSearchInputChange: (value: string) => void;
}

const PERIOD_OPTIONS = [
  { value: 30, label: 'Maio/2026' },
  { value: 60, label: 'Abril/2026' },
  { value: 90, label: 'Março/2026' },
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