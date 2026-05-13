import { useState, useEffect } from 'react';
import { Header } from "./Header";
import { NavDrawer } from './NavDrawer';
import type { Pagina } from '../types';

interface HomePageProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
  onMenuAbrir: () => void;
}

export function HomePage({ nomeUsuario, onNavegar }: HomePageProps) {

  useEffect(() => {
  document.title = 'SEBRAE - Home'
}, [])

  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div className="home-page">
      <Header 
        onMenuAbrir={() => setMenuAberto(true)}
        onNavegar={onNavegar}
        nomeUsuario={nomeUsuario}
      />
      <NavDrawer
        isOpen={menuAberto}
        onClose={() => setMenuAberto(false)}
        onNavegar={onNavegar}
        paginaAtiva="home"
      />
      <main className="home-page__content">
        <h1>Olá, {nomeUsuario}!</h1>
        <p>Bem-vindo ao painel do Sebrae.</p>
        {/* Conteúdo da Home aqui */}
      </main>
    </div>
  );
}