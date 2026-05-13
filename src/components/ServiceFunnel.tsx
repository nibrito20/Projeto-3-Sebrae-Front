import { useState, useEffect, useRef } from 'react'
import type { Service } from '../types';
import html2canvas from 'html2canvas';

interface ServiceFunnelProps {
  service: Service;
  servicos: Service[];
  onServiceChange: (service: Service) => void;
}

export function ServiceFunnel({ service, servicos, onServiceChange }: ServiceFunnelProps) {

  useEffect(() => {
  document.title = 'SEBRAE - Análise de Conclusão'
}, [])

  const taxaFinal = service.taxaConclusao || ((service.totalConcluidos / service.totalIniciados) * 100) || 0;
  const [mostrarDetalhes, setMostrarDetalhes] = useState(false);
  const [exportando, setExportando] = useState(false);

  const steps = [
    { label: 'Início',    pct: 100,       color: '#38761d' },
    { label: 'Etapa 1',  pct: 80,        color: '#6aa84f' },
    { label: 'Etapa 2',  pct: 60,        color: '#f1c232', hasWarning: true },
    { label: 'Conclusão', pct: taxaFinal, color: '#cc0000' },
  ];

  const funnelRef = useRef<HTMLDivElement>(null);

  const handleExportar = async () => {
    if (!funnelRef.current) return;
    setExportando(true);
    const canvas = await html2canvas(funnelRef.current);
    const link = document.createElement('a');
    link.download = `${service.nome}.png`;
    link.href = canvas.toDataURL();
    link.click();
    setExportando(false);
  };

  return (
    <div className="funnel-wrapper" ref={funnelRef}>
      <div className="funnel-main">
        <div className="funnel-controls">
          <select
            value={service.id}
            onChange={(e) => {
              const selecionado = servicos.find(s => s.id === Number(e.target.value));
              if (selecionado) onServiceChange(selecionado);
            }}
          >
            {servicos.map(s => (
              <option key={s.id} value={s.id}>{s.nome}</option>
            ))}
          </select>
          <select>
            <option>24/08/26</option>
          </select>
          <button className="btn-comparar" onClick={() => setMostrarDetalhes(!mostrarDetalhes)}>
            {mostrarDetalhes ? 'Fechar' : 'Comparar'}
          </button>
        </div>

        {mostrarDetalhes && (
          <div className="funnel-detalhes-popover">
            <div className="funnel-detalhes-popover__header">
              Média de tempo na etapa: {service.tempoMedioEtapa}
            </div>
            <div className="funnel-detalhes-popover__body">
              <p>
                <strong>Principais dispositivos:</strong><br/>
                {service.dispositivos?.map((d, i) => <span key={i}>{d}<br/></span>)}
              </p>
              <p>
                <strong>Origens de tráfego:</strong><br/>
                {service.origensTrafego?.map((o, i) => <span key={i}>• {o}<br/></span>)}
              </p>
              <div className="funnel-detalhes-popover__usuarios">
                <strong>Últimos usuários:</strong>
                <div>
                  {service.ultimosUsuarios?.map(u => (
                    <p key={u.id}>👤 ID: {u.id} — {u.data}</p>
                  ))}
                </div>
              </div>
              <p className="funnel-detalhes-popover__ver-mais">Ver mais detalhes</p>
            </div>
          </div>
        )}

        <svg className="funnel-svg" viewBox="0 0 500 350" preserveAspectRatio="xMidYMid meet">
          {steps.map((step, i) => {
            const nextPct = steps[i + 1]?.pct || step.pct;
            const yTop = i * 80 + 6;
            const yBot = (i + 1) * 80;
            const multiplier = 1.8;
            const x1 = 200 - step.pct * multiplier;
            const x2 = 200 + step.pct * multiplier;
            const x3 = 200 + (i === steps.length - 1 ? 0 : nextPct) * multiplier;
            const x4 = 200 - (i === steps.length - 1 ? 0 : nextPct) * multiplier;

            return (
              <g key={step.label}>
                <polygon
                  points={`${x1},${yTop} ${x2},${yTop} ${x3},${yBot} ${x4},${yBot}`}
                  fill={step.color}
                />
                <text x={x2 + 30} y={yTop + 25} fill="#333" fontSize="12" fontWeight="500">
                  {step.label} — {i === 0 ? '100%' : `${step.pct.toFixed(1)}%`} {step.hasWarning && '⚠️'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="funnel-sidebar">
        <h3 className="funnel-sidebar__title">Overview</h3>
        <p className="funnel-sidebar__subtitle">{service.nome}</p>

        <div className="funnel-sidebar__preview">
          <svg viewBox="0 0 100 80">
            <polygon points="10,0 90,0 75,20 25,20"  fill="#38761d" />
            <polygon points="25,20 75,20 65,40 35,40" fill="#6aa84f" />
            <polygon points="35,40 65,40 55,60 45,60" fill="#f1c232" />
            <polygon points="45,60 55,60 50,80 50,80" fill="#cc0000" />
          </svg>
        </div>

        <div className="funnel-sidebar__actions">
          <button onClick={handleExportar} disabled={exportando}>
            {exportando ? 'Exportando...' : 'Exportar'}
          </button>
          <button>24/08/26</button>
        </div>

        <div className="funnel-sidebar__metrics">
          <div>Taxa de conclusão total: <strong>{taxaFinal.toFixed(1)}%</strong></div>
          <div>Tempo médio de jornada: <strong>{service.tempoMedioMinutos}m</strong></div>
          <div>Maior gargalo: <strong>{service.gargalo}</strong></div>
        </div>
        
      </div>
    </div>
  );
}