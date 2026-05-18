import { useEffect } from 'react';
import { Header } from '../components/Header';
import type { Pagina } from '../types';

interface HomePageProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
  onMenuAbrir: () => void;
}

export function HomePage({ nomeUsuario, onNavegar, onMenuAbrir }: HomePageProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Home';
  }, []);

  return (
    <div className="home-page">
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="home-page__content">
        <h1>Olá, {nomeUsuario || 'visitante'}!</h1>
        <p>Bem-vindo ao painel do Sebrae.</p>
      </main>
    </div>
  );
}