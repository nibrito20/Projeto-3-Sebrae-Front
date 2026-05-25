import { useEffect, useMemo, useState } from 'react';
import { Header } from '../components/Header';
import type { ClientEnriched, EngagementRankingItem, Pagina } from '../types';
import { fetchEngagementRanking } from '../lib/data';

interface EngajamentoPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
  clients: ClientEnriched[];
}

function getAvatarLabel(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');
}

function statusClass(level: string) {
  if (level.toLowerCase() === 'alto') return 'engagement-badge--alto';
  if (level.toLowerCase() === 'medio') return 'engagement-badge--medio';
  return 'engagement-badge--baixo';
}

export function EngajamentoPage({ nomeUsuario, onMenuAbrir, onNavegar, clients }: EngajamentoPageProps) {
  const [ranking, setRanking] = useState<EngagementRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = 'SEBRAE - Score de Engajamento';
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchEngagementRanking()
      .then((data) => {
        setRanking(data);
      })
      .catch(() => {
        setError('Não foi possível carregar o ranking de engajamento.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const rows = useMemo(() => {
    return ranking.map((item) => ({
      ...item,
      nome: clients.find((client) => String(client.id) === String(item.clienteId))?.nome ?? `Cliente ${item.clienteId}`,
    }));
  }, [clients, ranking]);

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="page">
        <div className="page-title">
          <h1>Score de Engajamento por Cliente</h1>
          <p>Ranking dos clientes com base em frequência, profundidade e reuso.</p>
        </div>

        <section className="engagement-page__panel">
          <div className="engagement-page__toolbar">
            <span className="engagement-page__period">Últimos 7 dias</span>
            <div className="engagement-page__actions">
              <button type="button" className="btn-link">Buscar</button>
              <button type="button" className="btn-link">Filtrar</button>
            </div>
          </div>

          {loading ? (
            <div className="table-empty">Carregando ranking...</div>
          ) : error ? (
            <div className="table-empty">{error}</div>
          ) : (
            <ul className="engagement-list">
              {rows.map((item, index) => (
                <li key={`${item.clienteId}-${index}`} className="engagement-item">
                  <div className="engagement-item__rank">{index + 1}</div>
                  <div className="engagement-item__body">
                    <div className="engagement-item__avatar">{getAvatarLabel(item.nome ?? '')}</div>
                    <div className="engagement-item__info">
                      <div className="engagement-item__name">{item.nome}</div>
                      <div className="engagement-item__meta">
                        Frequência {item.frequencia.toFixed(1)} · Profundidade {item.profundidade.toFixed(1)} · Reuso {item.reuso.toFixed(1)}
                      </div>
                      <div className="engagement-item__meter">
                        <span className="engagement-item__meter-label">Score</span>
                        <div className="engagement-item__meter-bar">
                          <span
                            className="engagement-item__meter-fill"
                            style={{ width: `${Math.min(100, Math.round(item.scoreFinal * 10))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="engagement-item__status">
                    <span className={`engagement-badge ${statusClass(item.nivel ?? '')}`}>{item.nivel}</span>
                    <span className="engagement-score">{Math.round(item.scoreFinal)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </>
  );
}
