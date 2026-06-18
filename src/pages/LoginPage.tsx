import { useState, useEffect } from 'react';
import '../styles/auth.css';
import type { Pagina } from '../types';
import { Header } from '../components/Header';

interface Props {
  onLogin: (nome: string) => void;
  onIrCadastro: () => void;
  onNavegar: (pagina: Pagina) => void;
}

export function LoginPage({ onLogin, onIrCadastro, onNavegar }: Props) {
  useEffect(() => {
    document.title = 'SEBRAE - Login';
  }, []);

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    setErro('');
    setSucesso(false);
    setCarregando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identificador, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso(true);
        setTimeout(() => onLogin(data.nome), 900);
      } else {
        setErro(data.erro || 'E-mail, CPF ou senha inválidos.');
      }
    } catch {
      setErro('Erro ao conectar com o servidor.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <>
      <Header onMenuAbrir={() => {}} onNavegar={onNavegar} nomeUsuario="" />
      <div className="auth-wrapper">
        <div className="auth-bg" />
        <div className="auth-card">
          <div className="auth-card-top auth-card-top-space">
            <p className="auth-small-title">
              Bem-vindo ao <strong>SEBRAE</strong>
            </p>
            <button type="button" className="auth-card-link" onClick={onIrCadastro}>
              Sem cadastro? <strong>Criar conta</strong>
            </button>
          </div>

          <div className="auth-header">
            <h1>Entrar</h1>
          </div>

        <button
          type="button"
          className="back-button-login"
          onClick={() => onNavegar('home')}
          title="Voltar para Home"
        >
          ←
        </button>

        <div className="auth-field">
          <label>E-mail ou CPF</label>
          <input
            className={erro ? 'invalid' : ''}
            type="text"
            placeholder="E-mail ou CPF"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Senha</label>
          <input
            className={erro ? 'invalid' : ''}
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <div className="auth-row">
          <span className="auth-link">Esqueci a senha</span>
        </div>

        {erro && <p className="auth-erro">{erro}</p>}

        <button
          className={`auth-btn ${sucesso ? 'auth-btn-success' : ''}`}
          onClick={handleLogin}
          disabled={carregando || sucesso}
        >
          {carregando ? 'Entrando...' : sucesso ? '✓' : 'Entrar'}
        </button>
      </div>
    </div>
    </>
  );
}
