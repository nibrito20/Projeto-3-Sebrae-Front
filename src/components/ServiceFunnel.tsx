import {useState } from 'react'
import type { Service } from '../types';

interface ServiceFunnelProps {
  service: Service;
}

export function ServiceFunnel({ service }: ServiceFunnelProps) {
  const taxaFinal = service.taxaConclusao || ((service.totalConcluidos / service.totalIniciados) * 100) || 0;
    const [mostrarDetalhes, setMostrarDetalhes] = useState(false);

  // Etapas baseadas fielmente no design do Figma
  const steps = [
    { label: 'Início', pct: 100, color: '#38761d' }, // Verde Sebrae
    { label: 'Etapa 1', pct: 80, color: '#6aa84f' },  // Verde Lima
    { label: 'Etapa 2', pct: 60, color: '#f1c232', hasWarning: true }, // Amarelo
    { label: 'Conclusão', pct: taxaFinal, color: '#cc0000' } // Vermelho
  ];

  return (
    <div style={{ 
      display: 'flex', 
      gap: '24px', 
      padding: '30px', 
      backgroundColor: '#f5f5f5', 
      borderRadius: '20px',
      fontFamily: 'sans-serif'
    }}>
      
      {/* ÁREA PRINCIPAL DO FUNIL */}
      <div style={{ 
        flex: 2, 
        backgroundColor: '#e0e0e0', 
        padding: '30px', 
        borderRadius: '16px',
        position: 'relative' 
      }}>
        <div style={{ marginBottom: '25px', display: 'flex', gap: '12px' }}>
          <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
            <option>{service.nome}</option>
          </select>
          <select style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #ccc', backgroundColor: 'white' }}>
            <option>24/08/26</option>
          </select>
          <button 
            onClick={() => setMostrarDetalhes(!mostrarDetalhes)}
            style={{ 
              padding: '8px 24px', 
              backgroundColor: '#ffffff', 
              border: '1px solid #ccc', 
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            {mostrarDetalhes ? 'Fechar' : 'Comparar'}
          </button>
        </div>

        {mostrarDetalhes && (
          <div style={{
            position: 'absolute',
            top: '85px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '320px',
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.15)',
            padding: '20px',
            zIndex: 100,
            border: '1px solid #eee',
            textAlign: 'left'
          }}>
            <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '5px' }}>
              Média de tempo na etapa: 12min
            </div>
            <div style={{ fontSize: '13px', color: '#444' }}>
              <p><strong>Principais dispositivos:</strong><br/> Mobile (iPhone) <br/> Desktop (Chrome)</p>
              <p><strong>Origens de tráfego:</strong><br/> • Busca Orgânica <br/> • Instagram</p>
              <div style={{ borderTop: '1px solid #eee', marginTop: '10px', paddingTop: '10px' }}>
                <strong style={{ fontSize: '12px', color: '#666' }}>Últimos usuários:</strong>
                <div style={{ marginTop: '5px' }}>
                <p style={{ margin: '2px 0' }}>👤 ID: 235980 — 24/08/26</p>
                <p style={{ margin: '2px 0' }}>👤 ID: 235643 — 19/08/26</p>
                </div>
            </div>
              <p style={{ color: '#0066cc', marginTop: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Ver mais detalhes</p>
            </div>
          </div>
        )}

        <svg viewBox="0 0 500 350" preserveAspectRatio="xMidYMid meet">
          {steps.map((step, i) => {
            const nextPct = steps[i + 1]?.pct || step.pct;
            
            // Altura de cada bloco
            const yTop = (i * 80) + 6; 
            const yBot = (i + 1) * 80;
            
            // Largura visual (multiplicador para o funil não ficar muito fino)
            const multiplier = 1.8;
            const x1 = 200 - (step.pct * multiplier);
            const x2 = 200 + (step.pct * multiplier);
            const x3 = 200 + ((i === steps.length - 1 ? 0 : nextPct) * multiplier);
            const x4 = 200 - ((i === steps.length - 1 ? 0 : nextPct) * multiplier);

            return (
              <g key={step.label} style={{ cursor: 'pointer' }}>
                <polygon 
                  points={`${x1},${yTop} ${x2},${yTop} ${x3},${yBot} ${x4},${yBot}`}
                  fill={step.color}
                />
                
                {/* Rótulos Externos (Alinhados à direita do funil) */}
                <text 
                  x={x2 + 30} 
                  y={yTop + 25} 
                  fill="#333" 
                  fontSize="12" 
                  fontWeight="500"
                >
                  {step.label} — {i === 0 ? '100%' : `${step.pct.toFixed(1)}%`} {step.hasWarning && '⚠️'}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* SIDEBAR DE OVERVIEW */}
      <div style={{ 
        flex: 0.8, 
        backgroundColor: '#d1d1d1', 
        padding: '24px', 
        borderRadius: '16px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <h3 style={{ margin: '0 0 4px 0', fontSize: '18px' }}>Overview</h3>
        <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#444' }}>{service.nome}</p>

        {/* Mini Preview do Funil (O retângulo branco do design) */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '15px', 
          borderRadius: '12px', 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'center',
          marginBottom: '20px'
        }}>
          <svg viewBox="0 0 100 80" style={{ width: '80px', height: 'auto' }}>
            <polygon points="10,0 90,0 75,20 25,20" fill="#38761d" />
            <polygon points="25,20 75,20 65,40 35,40" fill="#6aa84f" />
            <polygon points="35,40 65,40 55,60 45,60" fill="#f1c232" />
            <polygon points="45,60 55,60 50,80 50,80" fill="#cc0000" />
          </svg>
        </div>

        <div style={{ width: '100%', display: 'flex', gap: '8px', marginBottom: '20px' }}>
          <button style={{ flex: 1, padding: '6px', borderRadius: '4px', border: 'none', fontSize: '12px' }}>Exportar</button>
          <button style={{ flex: 1, padding: '6px', borderRadius: '4px', border: 'none', fontSize: '12px' }}>24/08/26</button>
        </div>

        <div style={{ width: '100%', fontSize: '13px', lineHeight: '1.6', color: '#333' }}>
          <div>Taxa de conclusão total: <strong>{taxaFinal.toFixed(1)}%</strong></div>
          <div>Tempo médio de jornada: <strong>23m</strong></div>
          <div>Maior gargalo: <strong>Etapa 2</strong></div>
        </div>
      </div>
    </div>
  );
}