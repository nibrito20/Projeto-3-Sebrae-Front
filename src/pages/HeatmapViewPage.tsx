import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { HeatmapOverlay } from '../components/HeatmapOverlay';
import { LoadingScreen } from '../components/LoadingScreen';
import { useHeatmap } from '../hooks/useHeatmap';
import type { HeatmapPage as HeatmapPageType, Pagina } from '../types';

interface HeatmapViewPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
  selectedPage: HeatmapPageType;
  onVoltar: () => void;
}

export function HeatmapViewPage({
  nomeUsuario,
  onMenuAbrir,
  onNavegar,
  selectedPage,
  onVoltar,
}: HeatmapViewPageProps) {
  const { data, loading, error } = useHeatmap(selectedPage.id);
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    document.title = `SEBRAE - Mapa de Calor: ${selectedPage.label}`;
  }, [selectedPage.label]);

  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setImgSize({
          width: imgRef.current.offsetWidth,
          height: imgRef.current.offsetHeight,
        });
      }
    };
    const img = imgRef.current;
    if (img) {
      img.addEventListener('load', updateSize);
      updateSize();
    }
    window.addEventListener('resize', updateSize);
    return () => {
      img?.removeEventListener('load', updateSize);
      window.removeEventListener('resize', updateSize);
    };
  }, [selectedPage]);

  return (
    <div className="heatmap-view-page">
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="heatmap-view-page__content">
        <div className="heatmap-view-page__toolbar">
          <button type="button" className="heatmap-view-page__back" onClick={onVoltar}>
            ← Voltar
          </button>
          <h2 className="heatmap-view-page__title">
            Mapa de Calor — <span>{selectedPage.label}</span>
          </h2>
        </div>

        {loading && <LoadingScreen message="Carregando dados..." />}
        {error && <p className="heatmap-view-page__status heatmap-view-page__status--error">{error}</p>}

        <div className="heatmap-view-page__canvas">
          <img
            ref={imgRef}
            src={selectedPage.screenshot}
            alt={`Screenshot de ${selectedPage.label}`}
            className="heatmap-view-page__screenshot"
          />
          {!loading && imgSize.width > 0 && (
            <HeatmapOverlay
              data={data}
              width={imgSize.width}
              height={imgSize.height}
            />
          )}
        </div>

        {!loading && data.length === 0 && !error && (
          <p className="heatmap-view-page__status">
            Nenhuma interação registrada ainda nesta página.
          </p>
        )}
      </main>
    </div>
  );
}