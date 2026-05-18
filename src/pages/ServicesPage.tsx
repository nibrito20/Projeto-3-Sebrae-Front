import { useEffect } from 'react';
import { Header } from '../components/Header';
import { ServiceFunnel } from '../components/ServiceFunnel';
import type { Pagina, Service } from '../types';

interface ServicesPageProps {
  nomeUsuario: string;
  onMenuAbrir: () => void;
  onNavegar: (pagina: Pagina) => void;
  servicos: Service[];
  servicoSelecionado: number;
  onServiceChange: (service: Service) => void;
}

export function ServicesPage({
  nomeUsuario,
  onMenuAbrir,
  onNavegar,
  servicos,
  servicoSelecionado,
  onServiceChange,
}: ServicesPageProps) {
  useEffect(() => {
    document.title = 'SEBRAE - Serviços';
  }, []);

  return (
    <>
      <Header onMenuAbrir={onMenuAbrir} onNavegar={onNavegar} nomeUsuario={nomeUsuario} />
      <main className="page">
        <div className="page-title">
          <h1>Análise de Conclusão de Serviços</h1>
          <p>Acompanhamento de conversão e eficiência dos fluxos digitais.</p>
        </div>

        <div className="service-page__content">
          {servicos.length > 0 ? (
            <ServiceFunnel
              service={servicos[servicoSelecionado]}
              servicos={servicos}
              onServiceChange={onServiceChange}
            />
          ) : (
            <div className="table-empty">Nenhum serviço disponível para análise.</div>
          )}
        </div>
      </main>
    </>
  );
}
