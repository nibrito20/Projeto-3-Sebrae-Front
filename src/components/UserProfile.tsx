import { useEffect } from 'react'
import type { Pagina } from '../types';

interface UserProfileProps {
  nomeUsuario: string;
  onNavegar: (pagina: Pagina) => void;
  onLogout: () => void;
}

export function UserProfile({ nomeUsuario, onNavegar, onLogout }: UserProfileProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Perfil';
  }, []);

  const [firstName, ...rest] = nomeUsuario.split(' ');
  const lastName = rest.join(' ') || firstName;
  const email = `${nomeUsuario.toLowerCase().replace(/\s+/g, '.')}@gmail.com`;
  const telefone = '81 9 8667 7457';

  return (
    <div className="user-profile">
      <div className="user-profile__header-pane">
        <button className="user-profile__back" type="button" onClick={() => onNavegar('home')}>
          ←
        </button>
        <h1>Perfil do Usuário</h1>
      </div>

      <section className="user-profile__summary">
        <div className="user-profile__summary-top">
          <div className="user-profile__details">
            <h2>{nomeUsuario}</h2>
            <p className="user-profile__role">Administrador</p>
            <div className="user-profile__meta">
              <div className="user-profile__meta-item">
                <span>Email</span>
                <strong>{email}</strong>
              </div>
              <div className="user-profile__meta-item">
                <span>Telefone</span>
                <strong>{telefone}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="profile-data-card">
        <div className="profile-data-card__header">
          <h2>Dados Pessoais</h2>
        </div>

        <div className="profile-data-form">
          <div className="profile-field">
            <label>Primeiro nome</label>
            <input type="text" value={firstName} readOnly />
          </div>
          <div className="profile-field">
            <label>Sobrenome</label>
            <input type="text" value={lastName} readOnly />
          </div>
          <div className="profile-field">
            <label>Email</label>
            <input type="email" value={email} readOnly />
          </div>
          <div className="profile-field">
            <label>Telefone</label>
            <input type="text" value={telefone} readOnly />
          </div>
        </div>
      </section>

      <div className="profile-actions">
        <button className="logout-button logout-button--wide" type="button" onClick={onLogout}>
          Sair da conta
        </button>
      </div>
    </div>
  );
}
