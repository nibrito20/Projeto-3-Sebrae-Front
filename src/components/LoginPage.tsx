import { useState } from 'react';
import '../styles/auth.css';
import type { Pagina } from '../types';

interface Props {
  onLogin: (nome: string) => void;
  onIrCadastro: () => void;
  onNavegar: (pagina: Pagina) => void;
}

export function LoginPage({ onLogin, onIrCadastro, onNavegar}: Props) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    setErro('');
    setCarregando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        onLogin(data.nome);
      } else {
        setErro(data.erro);
      }
    } catch {
      setErro('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <button 
          type="button" 
          className="back-button-login" 
          onClick={() => onNavegar('home')}
          title="Voltar para Home"
        >
          ←
        </button>
        <div className="auth-header">
          <div className="auth-logo">Sebrae</div>
          <h1>Bem-vindo</h1>
          <p>Faça login para acessar o painel</p>
        </div>

        <div className="auth-field">
          <label>E-mail</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Senha</label>
          <input
            type="password"
            placeholder="••••••••"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && <p className="auth-erro">{erro}</p>}

        <button className="auth-btn" onClick={handleLogin} disabled={carregando}>
          {carregando ? 'Entrando...' : 'Entrar'}
        </button>

        <p className="auth-footer">
          Não tem conta?{' '}
          <span onClick={onIrCadastro}>Cadastre-se</span>
        </p>
      </div>
    </div>
  );
  
}