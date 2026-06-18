import { useState, useEffect, useRef } from 'react';
import type { Service } from '../types';
import html2canvas from 'html2canvas';

interface ServiceFunnelProps {
  service: Service;
  servicos: Service[];
  onServiceChange: (service: Service) => void;
}

export function ServiceFunnel({ service, servicos, onServiceChange }: ServiceFunnelProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Análise de Conclusão';
  }, []);

  const taxaFinal = service.taxaConclusao || ((service.totalConcluidos / service.totalIniciados) * 100) || 0;
  
  const [exportando, setExportando] = useState(false);
  const [isComparing, setIsComparing] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [compareServiceId, setCompareServiceId] = useState(servicos[0]?.id || 0);

  const funnelRef = useRef<HTMLDivElement>(null);

  const steps = [
    { label: 'Início',    pct: 100,       color: '#38761d' },
    { label: 'Etapa 1',   pct: 80,        color: '#6aa84f' },
    { label: 'Etapa 2',   pct: 60,        color: '#f1c232', hasWarning: true },
    { label: 'Conclusão', pct: taxaFinal, color: '#cc0000' },
  ];

  const compareSteps = [
    { label: 'Início',    pct: 100, color: '#298A19' },
    { label: 'Etapa 1',   pct: 70,  color: '#90B41E' },
    { label: 'Etapa 2',   pct: 55,  color: '#C7B912', hasWarning: true },
    { label: 'Conclusão', pct: 40,  color: '#cc0000' },
  ];

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

  const renderFunnelChart = (data: typeof steps, isInteractive: boolean) => (
    <svg className="funnel-svg" viewBox="0 0 500 350" preserveAspectRatio="xMidYMid meet">
      {data.map((step, i) => {
        const nextPct = data[i + 1]?.pct || step.pct;
        const yTop = i * 80 + 6;
        const yBot = (i + 1) * 80;
        const multiplier = 1.8;
        const x1 = 200 - step.pct * multiplier;
        const x2 = 200 + step.pct * multiplier;
        const x3 = 200 + (i === data.length - 1 ? 0 : nextPct) * multiplier;
        const x4 = 200 - (i === data.length - 1 ? 0 : nextPct) * multiplier;
        const pctText = step.pct % 1 === 0 ? step.pct : step.pct.toFixed(1);

        return (
          <g 
            key={step.label}
            onClick={() => {
              if (isInteractive && !isComparing) {
                setActiveStep(activeStep === i ? null : i);
              }
            }}
            style={{ cursor: isInteractive && !isComparing ? 'pointer' : 'default' }}
          >
            <polygon
              points={`${x1},${yTop} ${x2},${yTop} ${x3},${yBot} ${x4},${yBot}`}
              fill={step.color}
            />
            <text 
              x={x2 + 30} 
              y={yTop + 30} 
              fill="#333" 
              fontSize="18" 
              fontWeight="600"
              fontFamily="Montserrat"
            >
              {step.label} - {i === 0 ? '100%' : `${pctText}%`} {step.hasWarning && '⚠️'}
            </text>
          </g>
        );
      })}
    </svg>
  );

  return (
    <div className="funnel-wrapper" ref={funnelRef}>
      
      <div className="funnel-main card-bordered">
        <div className="funnel-controls">
          <span className="control-label">Serviço:</span>
          <select
            className="control-input"
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
          <select className="control-input">
            <option>24/08/26</option>
          </select>

          {}
          {isComparing && (
            <>
              <select 
                className="control-input"
                value={compareServiceId}
                onChange={(e) => setCompareServiceId(Number(e.target.value))}
              >
                {servicos.map(s => <option key={s.id} value={s.id}>{s.nome}</option>)}
              </select>
              <select className="control-input">
                <option>16/09/26</option>
              </select>
            </>
          )}

          <button 
            className="control-input" 
            onClick={() => {
              setIsComparing(!isComparing);
              setActiveStep(null);
            }}
          >
            {isComparing ? 'Voltar' : 'Comparar'}
          </button>
        </div>

        {}
        {activeStep !== null && !isComparing && (
          <div className="funnel-detalhes-popover" style={{ top: `${activeStep * 15 + 30}%` }}>
            <div className="funnel-detalhes-popover__header">
              Média de tempo ({steps[activeStep].label}): {service.tempoMedioEtapa}
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
                    <p key={u.id}>👤 ID: {u.id} - {u.data}</p>
                  ))}
                </div>
              </div>
              <p className="funnel-detalhes-popover__ver-mais" onClick={() => setActiveStep(null)}>
                Fechar detalhes
              </p>
            </div>
          </div>
        )}

        {}
        <div className={`funnel-charts-container ${isComparing ? 'is-comparing' : ''}`}>
          {renderFunnelChart(steps, true)}
          {isComparing && renderFunnelChart(compareSteps, false)}
        </div>
      </div>

      {}
      {!isComparing && (
        <div className="funnel-sidebar card-bordered">
          <div className="funnel-sidebar__header">
            <h3 className="funnel-sidebar__title">Overview</h3>
            <p className="funnel-sidebar__subtitle">{service.nome}</p>
          </div>

          <div className="funnel-sidebar__preview">
            <svg viewBox="0 0 100 80">
              <polygon points="10,0 90,0 75,20 25,20"  fill="#38761d" />
              <polygon points="25,20 75,20 65,40 35,40" fill="#6aa84f" />
              <polygon points="35,40 65,40 55,60 45,60" fill="#f1c232" />
              <polygon points="45,60 55,60 50,80 50,80" fill="#cc0000" />
            </svg>
          </div>

          <div className="funnel-sidebar__actions">
            <button className="control-input" onClick={handleExportar} disabled={exportando}>
              {exportando ? 'Exportando...' : 'Exportar'}
            </button>
            <button className="control-input">24/08/26</button>
          </div>

          <div className="funnel-sidebar__metrics">
            <div>Taxa de conclusão total: <strong>{Math.round(taxaFinal)}%</strong></div>
            <div>Tempo médio de jornada: <strong>{service.tempoMedioMinutos}m</strong></div>
            <div>Maior gargalo: <strong>{service.gargalo}</strong></div>
          </div>
        </div>
      )}

    </div>
  );
}