import { useEffect } from 'react';
import { Header } from '../components/Header';
import type { Pagina } from '../types';

interface ConversaPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
}

export function ConversaPage({ nomeUsuario, onMenuAbrir, onNavegar }: ConversaPageProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Na Conversa';
  }, []);

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="page">
        <div className="page-title">
          <h1>Na Conversa</h1>
          <p>Centralizando dados de conversa e engajamento em um só lugar.</p>
        </div>
        <div className="table-empty">
          <p>Estamos preparando esta funcionalidade para você. Enquanto isso, explore os demais recursos do painel.</p>
        </div>
      </main>
    </>
  );
}
