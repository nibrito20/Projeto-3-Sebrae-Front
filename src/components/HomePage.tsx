import { Header } from "./Header";
import type { Pagina } from '../types';

interface HomePageProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
}

export function HomePage({ nomeUsuario, onNavegar }: HomePageProps) {
  return (
    <div className="home-page">
      <Header onNavegar={onNavegar} />
      <main className="home-page__content">
        <h1>Olá, {nomeUsuario}!</h1>
        <p>Bem-vindo ao painel do Sebrae.</p>
        {/* Conteúdo da Home aqui */}
      </main>
    </div>
  );
}