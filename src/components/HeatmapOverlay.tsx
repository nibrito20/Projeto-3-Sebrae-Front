import type { HeatmapGrid } from '../types';

const CELL_SIZE = 50;

interface HeatmapOverlayProps {
  data: HeatmapGrid[];
  width: number;
  height: number;
}

function getColor(intensity: number): string {
  if (intensity > 0.65) return `rgba(220, 38, 38, ${0.55 + intensity * 0.45})`;
  if (intensity > 0.45) return `rgba(251, 146, 60, ${0.45 + intensity * 0.35})`;
  if (intensity > 0.28) return `rgba(250, 204, 21, ${0.4 + intensity * 0.3})`;
  if (intensity > 0.12) return `rgba(34, 197, 94, ${0.3 + intensity * 0.3})`;
  return `rgba(59, 130, 246, ${0.15 + intensity * 0.25})`; 
}

export function HeatmapOverlay({ data, width, height }: HeatmapOverlayProps) {
  if (!data.length) return null;

  const realMax = Math.max(...data.map((d) => d.totalClicks), 1);
  const maxClicks = realMax * 1.05; 

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: 'none',
      }}
      viewBox={`0 0 ${width} ${height}`}
    >
      <defs>
        <filter id="heatmap-blur">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>
      <g filter="url(#heatmap-blur)">
        {data.map((cell) => {
          const intensity = cell.totalClicks / maxClicks;
          
          const centerX = cell.gridX * CELL_SIZE + CELL_SIZE / 2;
          const centerY = cell.gridY * CELL_SIZE + CELL_SIZE / 2;

          return (
            <circle
              key={cell.id}
              cx={centerX}
              cy={centerY}
              r={38}
              fill={getColor(intensity)}
            />
          );
        })}
      </g>
    </svg>
  );
}