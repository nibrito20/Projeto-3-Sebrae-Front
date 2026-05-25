import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/components.css';
import './styles/heatmap.css';
import App from './App';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Elemento #root não encontrado em index.html');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
