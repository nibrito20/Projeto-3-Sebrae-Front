import { useEffect } from 'react';
import { Header } from '../components/Header';
import { UserProfile } from '../components/UserProfile';
import type { Pagina } from '../types';

interface ProfilePageProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
  onLogout: () => void;
  onMenuAbrir: () => void;
}

export function ProfilePage({ nomeUsuario, onNavegar, onLogout, onMenuAbrir }: ProfilePageProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Perfil';
  }, []);

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <div className="page">
        <UserProfile nomeUsuario={nomeUsuario} onNavegar={onNavegar} onLogout={onLogout} />
      </div>
    </>
  );
}
