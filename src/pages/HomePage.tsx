import { useEffect } from 'react';
import { Header } from '../components/Header';
import analysisIcon from '../assets/Análise de Conclusão de Serviços.png';
import returnRateIcon from '../assets/Taxa de Retorno do Usuário.png';
import abandonmentIcon from '../assets/Detector de abandono inteligente.png';
import conversationIcon from '../assets/Na Conversa.png';
import heatmapIcon from '../assets/Mapa de Calor de Interações.png';
import scoreIcon from '../assets/Score de Engajamento.png';
import alertsIcon from '../assets/Alertas de Comportamento Atípico.png';
import signalsIcon from '../assets/Sinais Implícitos de Valor Percebido.png';
import type { Pagina } from '../types';

const HOME_FEATURES = [
  { label: 'Análise de Conclusão de Serviços', icon: analysisIcon, pagina: 'services' as Pagina },
  { label: 'Sinais Implícitos de Valor Percebido', icon: signalsIcon, pagina: 'dashboard' as Pagina },
  { label: 'Taxa de Retorno do Usuário', icon: returnRateIcon, pagina: 'retorno' as Pagina },
  { label: 'Score de Engajamento', icon: scoreIcon, pagina: 'engajamento' as Pagina },
  { label: 'Alertas de Comportamento Atípico', icon: alertsIcon, pagina: 'alertas' as Pagina },
  { label: 'Mapa de Calor de Interações', icon: heatmapIcon, pagina: 'heatmap' as Pagina },
  { label: 'Detector de Abandono Inteligente', icon: abandonmentIcon, pagina: 'abandono' as Pagina },
  { label: 'Na Conversa', icon: conversationIcon, pagina: 'conversa' as Pagina },
];

interface HomePageProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
  onMenuAbrir: () => void;
}

export function HomePage({ nomeUsuario, onNavegar, onMenuAbrir }: HomePageProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Home';
  }, []);

  const saudacao = nomeUsuario || 'visitante';

  return (
    <div className="home-page">
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="home-page__content home-page__hero">
        <div className="home-page__hero-copy">
          <span className="home-page__eyebrow">Olá {saudacao}</span>
          <h1>Bem-vindo ao painel do Sebrae</h1>
        </div>

        <div className="home-page__score-wrap">
          <div className="home-page__score-ring">
            <svg viewBox="0 0 160 160" aria-hidden="true">
              <circle cx="80" cy="80" r="70" className="home-page__score-track" />
              <circle cx="80" cy="80" r="70" className="home-page__score-fill" />
            </svg>
            <div className="home-page__score-center">
              <span className="home-page__score-value">7,45</span>
            </div>
          </div>
          <p className="home-page__score-updated">Última atualização: há 2 horas.</p>
          <p className="home-page__score-desc">Hoje, a experiência do cliente do Sebrae está mediana.</p>
        </div>

        <section className="home-page__services" aria-label="Principais recursos">
          <div className="home-page__service-grid">
            {HOME_FEATURES.map((feature) => (
              <button
                type="button"
                key={feature.label}
                className="home-page__service-card"
                onClick={() => onNavegar(feature.pagina)}
                aria-label={`Ir para ${feature.label}`}
              >
                <div className="home-page__service-icon">
                  <img src={feature.icon} alt="" aria-hidden="true" />
                </div>
                <p>{feature.label}</p>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}