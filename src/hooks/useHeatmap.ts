import { useState, useEffect } from 'react';
import type { HeatmapGrid } from '../types';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

async function fetchHeatmapData(page: string): Promise<HeatmapGrid[]> {
  const res = await fetch(`${API_BASE}/api/heatmap?page=${encodeURIComponent(page)}`);
  if (!res.ok) throw new Error('Erro ao buscar mapa de calor');
  return res.json();
}

export function useHeatmap(page: string | null) {
  const [data, setData] = useState<HeatmapGrid[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!page) return;
    setLoading(true);
    setError(null);
    fetchHeatmapData(page)
      .then(setData)
      .catch(() => setError('Não foi possível carregar os dados.'))
      .finally(() => setLoading(false));
  }, [page]);

  return { data, loading, error };
}