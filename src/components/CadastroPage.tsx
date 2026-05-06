import { useState } from 'react';

interface Props {
  onIrLogin: () => void;
}

export function CadastroPage({ onIrLogin }: Props) {
  const [nome, setNome] = useState('');
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
      const res = await fetch('http://localhost:8080/api/cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email, senha }),
      });

      const data = await res.json();

      if (res.ok) {
        setSucesso('Cadastro realizado! Redirecionando...');
        setTimeout(() => onIrLogin(), 2000);
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
        <div className="auth-header">
          <div className="auth-logo">Sebrae</div>
          <h1>Criar conta</h1>
          <p>Preencha os dados para se cadastrar</p>
        </div>

        <div className="auth-field">
          <label>Nome</label>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
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
        {sucesso && <p className="auth-sucesso">{sucesso}</p>}

        <button className="auth-btn" onClick={handleCadastro} disabled={carregando}>
          {carregando ? 'Cadastrando...' : 'Cadastrar'}
        </button>

        <p className="auth-footer">
          Já tem conta?{' '}
          <span onClick={onIrLogin}>Fazer login</span>
        </p>
      </div>
    </div>
  );
  
}