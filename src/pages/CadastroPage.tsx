import { useState, useEffect } from 'react';
import '../styles/auth.css';
import type { Pagina } from '../types';
import { Header } from '../components/Header';

interface Props {
  onIrLogin: () => void;
  onNavegar: (pagina: Pagina) => void;
}

export function CadastroPage({ onIrLogin, onNavegar }: Props) {
  useEffect(() => {
    document.title = 'SEBRAE - Cadastro';
  }, []);

  const [cpf, setCpf] = useState('');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleCadastro = async () => {
    setErro('');
    setSucesso('');
    setCarregando(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cpf, nome, telefone, cep, email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso('Cadastro realizado! Redirecionando...');
        setTimeout(() => onIrLogin(), 1400);
      } else {
        setErro(data.erro || 'Erro ao cadastrar.');
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
            <button type="button" className="auth-card-link" onClick={onIrLogin}>
              Já tem conta? <strong>Entrar</strong>
            </button>
          </div>

          <div className="auth-header">
            <h1>Cadastre-se</h1>
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
          <label>CPF</label>
          <input
            type="text"
            placeholder="CPF"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Nome Completo</label>
          <input
            type="text"
            placeholder="Nome Completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Telefone</label>
          <input
            type="text"
            placeholder="Telefone"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>CEP</label>
          <input
            type="text"
            placeholder="CEP"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>E-mail</label>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="auth-field">
          <label>Senha</label>
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        {erro && <p className="auth-erro">{erro}</p>}
        {sucesso && <p className="auth-sucesso">{sucesso}</p>}

        <button className="auth-btn" onClick={handleCadastro} disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Criar conta'}
        </button>
      </div>
    </div>
    </>
  );
}
