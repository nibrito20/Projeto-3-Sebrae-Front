import { useEffect } from 'react'
import type { Pagina } from '../types';

interface UserProfileProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
  onLogout: () => void;
}

export function UserProfile({ nomeUsuario, onNavegar, onLogout }: UserProfileProps) {

  useEffect(() => {
  document.title = 'SEBRAE - Perfil'
}, [])

  return (
    <div className="user-profile">
      <header className="page-header">
        <button className="back-button" onClick={() => onNavegar('home')}>
          ← Voltar
        </button>
        <h1>Meu Perfil</h1>
      </header>

      <main className="profile-content">
        <div className="profile-card">
          <div className="avatar-placeholder">
            {nomeUsuario.charAt(0).toUpperCase()}
          </div>
          
          <div className="user-info">
            <label>Nome de Usuário</label>
            <p>{nomeUsuario}</p>
          </div>

          <div className="user-info">
            <label>E-mail</label>
            <p>{nomeUsuario.toLowerCase().replace(' ', '.')}@email.com</p>
          </div>

          <button className="edit-button">Editar Perfil</button>

          <button className="logout-button" onClick={onLogout}>
            Sair da Conta
          </button>

        </div>
      </main>
    </div>
  );
}