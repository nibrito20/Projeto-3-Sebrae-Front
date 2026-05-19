import { useEffect, useRef, useState } from 'react';
import { Header } from '../components/Header';
import { HeatmapCard } from '../components/HeatmapCard';
import type { HeatmapPage as HeatmapPageType, Pagina } from '../types';

const HEATMAP_PAGES: HeatmapPageType[] = [
  { id: 'home',           label: 'Home',                       thumbnail: '/assets/heatmap/thumb/home.png',           screenshot: '/assets/heatmap/full/home.png' },
  { id: 'conteudos',      label: 'Conteúdos',                  thumbnail: '/assets/heatmap/thumb/conteudos.png',      screenshot: '/assets/heatmap/full/conteudos.png' },
  { id: 'cursos-eventos', label: 'Cursos e eventos',           thumbnail: '/assets/heatmap/thumb/cursos-eventos.png', screenshot: '/assets/heatmap/full/cursos-eventos.png' },
  { id: 'cursos-ead',     label: 'Cursos online - EAD',        thumbnail: '/assets/heatmap/thumb/cursos-ead.png',     screenshot: '/assets/heatmap/full/cursos-ead.png' },
  { id: 'guia-mei',       label: 'Guia do MEI',                thumbnail: '/assets/heatmap/thumb/guia-mei.png',       screenshot: '/assets/heatmap/full/guia-mei.png' },
  { id: 'pro-negocio',    label: 'Pro seu negócio',            thumbnail: '/assets/heatmap/thumb/pro-negocio.png',    screenshot: '/assets/heatmap/full/pro-negocio.png' },
  { id: 'solucoes',       label: 'Soluções',                   thumbnail: '/assets/heatmap/thumb/solucoes.png',       screenshot: '/assets/heatmap/full/solucoes.png' },
  { id: 'sobre-nos',      label: 'Sobre nós',                  thumbnail: '/assets/heatmap/thumb/sobre-nos.png',      screenshot: '/assets/heatmap/full/sobre-nos.png' },
  { id: 'contato',        label: 'Contato',                    thumbnail: '/assets/heatmap/thumb/contato.png',        screenshot: '/assets/heatmap/full/contato.png' },
  { id: 'abrir-empresa',  label: 'Como abrir uma empresa',     thumbnail: '/assets/heatmap/thumb/abrir-empresa.png',  screenshot: '/assets/heatmap/full/abrir-empresa.png' },
  { id: 'habilidades',    label: 'Habilidades Empreendedoras', thumbnail: '/assets/heatmap/thumb/habilidades.png',    screenshot: '/assets/heatmap/full/habilidades.png' },
  { id: 'fluxo-caixa',    label: 'Crie Seu Fluxo de Caixa',   thumbnail: '/assets/heatmap/thumb/fluxo-caixa.png',    screenshot: '/assets/heatmap/full/fluxo-caixa.png' },
  { id: 'credito',        label: 'Como conseguir crédito',     thumbnail: '/assets/heatmap/thumb/credito.png',        screenshot: '/assets/heatmap/full/credito.png' },
  { id: 'vender-mais',    label: 'Como vender mais',           thumbnail: '/assets/heatmap/thumb/vender-mais.png',    screenshot: '/assets/heatmap/full/vender-mais.png' },
  { id: 'engajamento',    label: 'Tenha mais engajamento',     thumbnail: '/assets/heatmap/thumb/engajamento.png',    screenshot: '/assets/heatmap/full/engajamento.png' },
  { id: 'venda-online',   label: 'Venda online',               thumbnail: '/assets/heatmap/thumb/venda-online.png',  screenshot: '/assets/heatmap/full/venda-online.png' },
];

interface HeatmapPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
  onSelectPage: (page: HeatmapPageType) => void;
}

export function HeatmapPage({ nomeUsuario, onMenuAbrir, onNavegar, onSelectPage }: HeatmapPageProps) {
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.title = 'SEBRAE - Mapa de Calor';
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const filtered = HEATMAP_PAGES.filter((p) =>
    p.label.toLowerCase().includes(search.toLowerCase()),
  );

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  return (
    <div className="heatmap-page">
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="heatmap-page__content">
        <div className="heatmap-page__intro">
          <h1 className="heatmap-page__title">Mapas de Calor</h1>
          <p className="heatmap-page__subtitle">Selecione a jornada que deseja visualizar.</p>

          <div className="heatmap-page__search-wrap">
            <input
              ref={searchRef}
              className={`heatmap-page__search${searchOpen ? ' is-open' : ''}`}
              type="search"
              placeholder="Buscar página..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onBlur={() => { if (!search) setSearchOpen(false); }}
              aria-label="Buscar página"
            />
          </div>

          <div className="heatmap-page__actions">
            <button type="button" className="heatmap-page__icon-btn" aria-label="Buscar" onClick={() => setSearchOpen((v) => !v)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button type="button" className="heatmap-page__icon-btn" aria-label="Filtrar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="heatmap-page__grid">
          {visible.map((page) => (
            <HeatmapCard key={page.id} page={page} onClick={onSelectPage} />
          ))}
          {filtered.length === 0 && (
            <p className="heatmap-page__empty">Nenhuma página encontrada.</p>
          )}
        </div>

        {hasMore && (
          <button type="button" className="heatmap-page__load-more" onClick={() => setVisibleCount((v) => v + 8)}>
            Mostrar Mais
          </button>
        )}
      </main>
    </div>
  );
}