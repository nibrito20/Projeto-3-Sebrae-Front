import type { HeatmapPage } from '../types';

interface HeatmapCardProps {
  page: HeatmapPage;
  onClick: (page: HeatmapPage) => void;
}

export function HeatmapCard({ page, onClick }: HeatmapCardProps) {
  return (
    <button
      type="button"
      className="heatmap-card"
      onClick={() => onClick(page)}
      aria-label={`Ver mapa de calor: ${page.label}`}
    >
      <div className="heatmap-card__thumb">
        <img src={page.thumbnail} alt={page.label} loading="lazy" />
      </div>
      <span className="heatmap-card__label">{page.label}</span>
    </button>
  );
}